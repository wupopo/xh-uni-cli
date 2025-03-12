export interface QrcodeProps{
    size:number;

    padding?:number;

    text:string;

    activeColor?:string;

    bgColor?:string;

    logo?:string;
    
    logoSize?:number;

    logoRadius?:number;

    bgImg?:string;

    bgRadius?:number;
}

export interface QrcodeEmits{
    (event:'finish',dataUrl:string):void;
    (event:'error',msg:string):void;
}


export enum BuildStatus{
    unbuilt='unbuilt',
    loading='loading',
    success='success',
    error='error'
}


export interface QrcodeData{
    dataUrl:string;

    qrcodeArr:Record<string,any>[][];

    status:BuildStatus;
}