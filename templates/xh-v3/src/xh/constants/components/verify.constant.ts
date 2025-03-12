export interface Geeid {
  bd: string;
  d: string;
  e: string;
  fp: string;
  ts: string;
  ver: string;
  client_type: string;
}

export interface Mi {
  geeid: Geeid;
  packageName: string;
  displayName: string;
  appVer: string;
  build: string;
  clientVersion: string;
  process_id: string;
  process_id_test: string;
  zid: string;
}

export interface Config {
  challenge: string;
  riskType: string;
  captchaId: string;
  clientVersion: string;
  clientType: string;
  protocol: string;
  mi: Mi;
}

export interface State {
  wv: PlusWebviewWebviewObject | null;
  appWv: PlusWebviewWebviewObject | null;
  lastTime: string;
  config: Config;
  captchaObj: any;
}

export interface Exports {
  showCaptcha(): void;
}

export interface Emits {
  (event: "ready"): void;
  (event: "error", reslut: any): void;
  (event: "close"): void;
  (event: "fail"): void;
  (event: "success", reslut: any): void;
}


