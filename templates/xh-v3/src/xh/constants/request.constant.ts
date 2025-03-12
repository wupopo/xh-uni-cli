export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  CONNECT = 'CONNECT',
  TRACE= 'TRACE',
}

export interface SendRequest{
    host?: string;
    baseUrl?: string;
    url: string;
    method: RequestMethod;
    data?: any;
    params?: any;
    headers?: Record<string, string>;
    timeout?: number;
}


export interface ResponseData<T=any>{
    data: T;
    statusCode: number;
    headers: Record<string, string>;
    cookies: Record<string, string>;
}


export type RequestInterceptor=(sendRequest:SendRequest)=>SendRequest|Promise<SendRequest>;

export type ResponseInterceptor<T=any>=(response:ResponseData<T>)=>ResponseData<T>;


export interface RequestInterceptorItem{
    interceptor: RequestInterceptor;
    order: number;
}

export interface ResponseInterceptorItem{
    interceptor: ResponseInterceptor;
    order: number;
}