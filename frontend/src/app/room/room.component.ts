import {Component, OnInit} from '@angular/core';
import {WebSocketUtil} from '../util/web-socket.util';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DieModel} from '../model/die.model';
import {MatDialog} from '@angular/material';
import {RoomDialogComponent} from './room-dialog/room-dialog.component';
import {Router} from '@angular/router';
import {PlayerModel} from '../model/player.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  num: string;
  diceFormGroup: FormGroup; // todo: move this and other things from here to PlayerSeatComponent
  players: Array<PlayerModel>;

  private readonly diceValues: Array<DieModel>; // rename me

  private wsConnection: WebSocket;
  private uuid: string;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.diceValues = [
      new DieModel('d6', 'white', false),
      new DieModel('d6', 'white', true),
      new DieModel('d6', 'white', false)
    ];

    this.diceFormGroup = fb.group({
      dice: fb.array(this.diceValues)
    });
  }

  ngOnInit(): void {
    setTimeout(() => { // hack to avoid 'value has been changed before check'
      const dialogRef = this.dialog.open(RoomDialogComponent, {
        width: '250px',
        data: { name: 'name', animal: 'animal' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.router.navigate(['/']);
        }
      });
    });

    this.players = [ new PlayerModel('Kim'), new PlayerModel('Charlie') ]; // todo: take names from RoomDialog
    this.uuid = this.createUuid();
    this.wsConnection = WebSocketUtil.connect(this.getWsMessageCallback());
  }

  get dice(): FormArray {
    return this.diceFormGroup.get('dice') as FormArray;
  }

  addDie() {
    const newDie = new DieModel('d6', 'white', false);
    this.dice.push(new FormControl(newDie));
  }

  removeDie() {
    this.dice.removeAt(this.dice.length - 1);
  }

  roll() {
    // refactor me
    console.log(this.dice.getRawValue());
    const diceValues = this.dice.getRawValue().filter((v: DieModel) => v.selected).map(() => 'd6').join(';');
    console.log(diceValues);
    this.wsConnection.send(JSON.stringify({type: 'roll', data: diceValues, uuid: this.uuid}));
  }

  private getWsMessageCallback(): (string) => void {
    return (message) => {
      /*const signal = JSON.parse(message.data);
      if (signal.uuid === this.uuid) {
        console.log('Received self signal');
        return;
      }*/
      this.num = message.data;
    };
  }

  // Taken from http://stackoverflow.com/a/105074/515584
  // Strictly speaking, it's not a real UUID, but it gets the job done here
  private createUuid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
