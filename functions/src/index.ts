import { CreateCase } from './create_case';
import { fetchAllAdvisory } from './fetch_all_advisory';
import { fetchAllUser } from './fetch_all_user';
import { oneClickApprove } from './one_click_approve';
import { getCaseList } from './get_case_list';
import { UpdateUserInfo } from './update_user_info';

const fnList = {
  create_case: CreateCase,
  fetch_all_advisory: fetchAllAdvisory,
  fetch_all_user: fetchAllUser,
  one_click_approve: oneClickApprove,
  get_case_list: getCaseList,
  update_user_info: UpdateUserInfo,
};

export let isDev = false;

exports.main = async function ({ fnName, data, isDev }: any) {
  isDev = isDev;
  console.log(`当前处于${isDev ? '开发' : '生产'}环境`);
  //@ts-ignore
  return await fnList[fnName](data);
};
