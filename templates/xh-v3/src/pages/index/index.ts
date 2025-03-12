import { GETMAGICLIST_RES } from "@/api";
import { ROLEANIMATION_RES } from "@/api/common";
import { ILLUSTRATIONS_RES, TASK_LIST_RES } from "@/api/picture";
import { NoticeItem } from "@/constants/api/notice.constant";
import { HB_TYPE } from "@/constants/common/common.constant";

export interface STATE_INTER {
  hbShow: boolean;
  hbType: HB_TYPE;
  loading: boolean;
  myRole: GETMAGICLIST_RES;
  allRoleData: Record<string, ROLEANIMATION_RES[]>;
  /**收藏任务弹窗 */
  collectShow: boolean;
  /**弹窗标题 */
  roleDescTitle: string;
  /**当前查看角色 */
  currRole: ILLUSTRATIONS_RES;
  /**角色介绍弹窗 */
  roleDescShow: boolean;
  /**获得弹窗 */
  obtainShow: boolean;
  /**当前获得奖励 */
  currObtain: TASK_LIST_RES | null;
  noticeInfo: NoticeItem | null;
  showNotice: boolean;
}

export const global_page = {
  change: false,
};

export interface HouseItem {
  path: string;
  yp: string;
  styles: Record<string, string>;
}

export interface SIZE_ENUM {
  /**微小 */
  a: number;
  /**小 */
  b: number;
  /**中 */
  c: number;
  /**大 */
  d: number;
  /**超大 */
  e: number;
}
