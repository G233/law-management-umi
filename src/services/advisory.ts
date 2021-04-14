import { message } from 'antd';
import { db } from '@/cloud_function/index';
import { cloudFunction, cloudWhere } from '@/services/until';
import { requestProp } from '@/services/cases';

export interface AdvisoryType {
  // 法律顾问单位名称
  name: string;
  // 聘任期限
  timeRange: string;
  _id: string;
  _openid: string;
}

const AdDb = db.collection('Advisory');
/**
 * 新建一个法律顾问单位
 */
export const newAdvisory = async (data: AdvisoryType) => {
  console.log(data);
  const res = await AdDb.add({ ...data, createTime: new Date() });
  if (!res.message) {
    message.success('添加法律顾问单位成功');
    return;
  }
  message.error('请求出错');
};

/**
 * 获取我的所有法律顾问单位
 */
export const featchMyAdvisory = async (data: requestProp) => {
  const res = await cloudWhere('Advisory', { _openid: data.openId });
  console.log(res);
  return {
    data: res ?? [],
    success: true,
  };
};

/**
 * 获取所有法律顾问单位
 */
export const featchAllAdvisory = async () => {
  const res = await cloudFunction('fetch_all_advisory');
  console.log(res);
  return {
    data: res?.data ?? [],
    success: true,
  };
};
