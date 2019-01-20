interface Param {
  type: string;
  data?: string;
  senderId?: string;
  direct?: boolean;
  to?: string;
}

export class WsMessageModel {
  type: string;
  data: string;
  senderId: string;
  direct: boolean;
  to: string;

  constructor(param: Param) {
    if (param) {
      this.type = param.type;
      this.data = param.data;
      this.senderId = param.senderId;
      this.direct = param.direct;
      this.to = param.to;
    }
  }
}