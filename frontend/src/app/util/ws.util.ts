import {WsMessage, WsMessageParam} from '../model/ws-message';


export class WsUtil {
  static connect(onMessageCallback: (string) => void): WebSocket {
    const connection = new WebSocket(`ws://${window.location.hostname}:8080/ws/echo`);
    connection.onmessage = onMessageCallback;
    return connection;
  }

  static send(conn: WebSocket, params: WsMessageParam) {
    conn.send(JSON.stringify(new WsMessage(params)));
  }
}
