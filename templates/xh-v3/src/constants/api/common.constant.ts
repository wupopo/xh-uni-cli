export enum SmsType {
  "register" = "register",
  "login" = "login",
  "resetpwd" = "resetpwd",
  "logout" = "logout",
  "changemobile" = "changemobile",
}

export enum ErrorCode {
  "success" = 1,
  "error" = 0,
  "unauthorized" = 401,
  "forbidden" = 403,
  "notFound" = 404,
  "serverError" = 500,
  "receiveLimit" = 666,
  "un_realname" = 702,
  "goExchange" = 704,
  "aliverify" = 705,
}

export interface BaseResponse<T> {
  code: ErrorCode;
  msg: string;
  data: T;
}

export interface Puzzle {
  pass_token: string;
  lot_number: string;
  captcha_output: string;
  gen_time: string;
  captcha_id: string;
  eventKey: string;
}

export interface SmsCodeForm {
  mobile: string;
  event: SmsType;
  puzzle?: Puzzle;
}

export interface ConfigValue {
  name: string;
  value: string;
  title: string;
}

export interface ConfigItem {
  [key: string]: ConfigValue;
}

export interface PageList<T> {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  data: T[];
}

export interface PageListParams {
  page: number;
  list_rows: number;
}

export interface GETUPLOADPARAMS_RES {
  accessid: string;
  callback: string;
  code: string;
  expire: string;
  host: string;
  key: string;
  policy: string;
  signature: string;
}

export interface LogItem {
  event: string;
  memo: string;
  data: string;
}
