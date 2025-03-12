import { BaseResponse } from '@/constants/api/common.constant';
import { SendRequest } from '@/xh/constants/request.constant';
import Request from '@/xh/utils/request/index'


export default function<T=any>(data:SendRequest):Promise<BaseResponse<T>>{   
    return Request.send<BaseResponse<T>>(data);
}