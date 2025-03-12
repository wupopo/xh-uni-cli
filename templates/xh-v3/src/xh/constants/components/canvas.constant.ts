export enum ItemType {
  'IMG'='image',
  'TEXT'='text',
  'REACT'='react'
}

export interface ImageItem{
    type:ItemType.IMG;
    url:string;
    width:number;
    height:number;
    x:number;
    y:number;
    radius?:number;
}

export interface TextItem{
    type:ItemType.TEXT;
    text:string;
    fontSize:number;
    fontFamily?:string;
    fontWeight?:string;
    maxWidth?:number;
    color:string;
    x:number;
    y:number;
}

export interface RectItem{
    type:ItemType.REACT;
    width:number;
    height:number;
    x:number;
    y:number;
    bgColor?:string;
    radius?:number;
}

export type CanvasItem = ImageItem|TextItem|RectItem;


export interface XhCanvasProps{
    data:CanvasItem[];
    width:number;
    height:number;
}