
export interface GoRouter{
    name:string;
    query?:Record<string,string>;
}


export type GoParams=string|GoRouter;





export interface Route{

    path:string;

    auth:boolean;

    name:string;

    title?:string;

    fullPath:string;
 
    query:Record<string,string>;
}


export type RouterIntercepotr=(formRoute:Route|null|undefined|void,toRoute:Route)=>Route;


export interface RouterInterceptorItem{
    interceptor:RouterIntercepotr;
    order:number;
}






