import { message } from 'antd';
import { db } from '@/cloud_function/index';
import {
  cloudFunction,
  cloudUpdateById,
  cloudWhere,
  cloudRemoveById,
} from '@/services/until';
import { requestProp } from '@/services/cases';

export interface AdvisoryType {
  // 法律顾问单位名称
  name: string;
  // 聘任期限
  timeRange: string;
  _id: string;
  unionId: string;
}
export interface resAdvisoryType extends AdvisoryType {
  userName: string;
}

const AdDb = db.collection('Advisory');
/**
 * 新建一个法律顾问单位
 */
export const newAdvisory = async (data: AdvisoryType, unionId: string) => {
  const res = await AdDb.add({ ...data, createTime: new Date(), unionId });
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
  const res = await cloudWhere('Advisory', { unionId: data.unionId });
  return {
    data: res ?? [],
    success: true,
  };
};

interface tableProp {
  name?: string;
  undertaker?: string;
  current?: number;
  pageSize?: number;
}
/**
 * 获取所有法律顾问单位
 */
export const featchAllAdvisory = async ({ name, undertaker }: tableProp) => {
  const res = await cloudFunction('fetch_all_advisory', { name, undertaker });
  return {
    data: res?.data ?? [],
    success: true,
  };
};

type rowType = AdvisoryType & {
  index?: number | undefined;
};

// 修改自己的法律顾问单位信息
export const updateAdvisory = async (_: any, row: rowType) => {
  const res = await cloudUpdateById('Advisory', row._id, {
    name: row.name,
    timeRange: row.timeRange,
  });
  if (res?.updated) {
    message.success('更新信息成功！');
    return true;
  }
};

// 删除法律顾问单位信息
export const deleteAdvisory = async (_: any, row: rowType) => {
  const res = await cloudRemoveById('Advisory', row._id);
  console.log(res);
  if (res?.deleted) {
    message.success('删除法律顾问单位信息成功');
    return true;
  }
};
