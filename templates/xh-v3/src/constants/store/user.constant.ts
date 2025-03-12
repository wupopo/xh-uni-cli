// import { UserInfo } from "../api/auth.constant";
// import { ConfigValue } from "../api/common.constant";

export enum CONFIG_ENUM {
  /**魔晶手续费率 */
  ore_transfer_fee = "ore_transfer_fee",
  /**魔晶转赠开关 */
  t_o = "t_o",
  /**羽毛减免手续费比例(魔晶:羽毛(1:1)) */
  feather_rate = "feather_rate",
  /**最低转赠 */
  min_transfer = "min_transfer",
  /**魔晶兑换体力比例 */
  action_power_exchange_ratio = "action_power_exchange_ratio",
}

export interface UserState {
  userInfo: Record<string, any> | null;
  token: string | null;
  config: Record<string, Record<string, any>> | null;
  showRabbitLimit: boolean;
  showLogin: boolean;
}
