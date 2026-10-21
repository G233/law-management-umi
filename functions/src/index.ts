import { CreateCase } from './create_case';
import { fetchAllAdvisory } from './fetch_all_advisory';
import { fetchAllUser } from './fetch_all_user';
import { oneClickApprove } from './one_click_approve';
import { getCaseList } from './get_case_list';
import { UpdateUserInfo } from './update_user_info';
import { wxLogin } from './wx_login';
import { changeCase } from './change_case';
import { generateCaseId } from './generate_case_id';

const fnList = {
  create_case: CreateCase,
  fetch_all_advisory: fetchAllAdvisory,
  fetch_all_user: fetchAllUser,
  one_click_approve: oneClickApprove,
  get_case_list: getCaseList,
  update_user_info: UpdateUserInfo,
  wx_login: wxLogin,
  change_case: changeCase,
  generate_case_id: generateCaseId,
};

export const isDev = false;

exports.main = async function (
  { fnName, data, isDev }: any,
  context: any,
) {
  try {
    //@ts-ignore
    return await fnList[fnName](data, context);
  } catch (error: any) {
    console.error('云函数执行错误:', error);
    return {
      error: true,
      message: error.message || '服务器错误',
    };
  }
};
