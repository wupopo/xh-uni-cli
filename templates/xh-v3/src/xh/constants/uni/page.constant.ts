export interface UniPageStyle{
    navigationBarBackgroundColor?:string;
    navigationBarTextStyle?:string;
    navigationBarTitleText?:string;
    navigationStyle?:string;
    enablePullDownRefresh?:boolean;
}

export interface UniGlobalStyle{
    navigationBarBackgroundColor?:string;
    navigationBarTextStyle?:string;
    navigationBarTitleText?:string;
    navigationStyle?:string;
}


export interface UniPageItem{
    path:string;
    style:UniPageStyle;
    auth:boolean;
    name:string;
}

export interface UniTabbarItem{
    pagePath:string;
    text?:string;
    iconPath:string;
    selectedIconPath:string;
}


export interface UniTabbar{
    color:string;
    selectedColor:string;
    backgroundColor:string;
    borderStyle?:string;
    list:UniTabbarItem[];
}


export interface UniPages{
    pages:UniPageItem[];
    tabBar?:UniTabbar;
    globalStyle:UniGlobalStyle;
}