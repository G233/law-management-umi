import { db, cloudApp } from '@/cloud_function/index';
import { message } from 'antd';

const _ = db.command;
/**
 * 调用云函数
 * @param {string} name - 云函数的名字.
 * @param {string} data - 函数参数.
 */
export const cloudFunction = async (name: string, data?: any) => {
  const res = await cloudApp
    .callFunction({
      name: name,
      data: data,
    })
    .catch(() => showError());
  return res?.result;
};

/**
 * 条件查询数据库
 * @param {string} dbName - 集合的名字.
 * @param {string} data - 查询参数.
 */
export const cloudWhere = async (dbName: string, data: any) => {
  const res = await db
    .collection(dbName)
    .where(data)
    .get()
    .catch(() => showError());
  return res?.data;
};

/**
 * 根据文档 id 查询数据库
 * @param {string} dbName - 集合的名字.
 * @param {string} docId - 文档 id.
 */
export const cloudFIndById = async (dbName: string, docId: string) => {
  const res = await db
    .collection(dbName)
    .doc(docId)
    .get()
    .catch(() => showError());
  return res?.data[0];
};

/**
 * 根据文档 id 更新
 * @param {string} dbName - 集合的名字.
 * @param {string} docId - 文档 id.
 * @param {Object} data - 需要更新的数据.
 */
export const cloudUpdateById = async (
  dbName: string,
  docId: string,
  data: any,
) => {
  const res = await db
    .collection(dbName)
    .doc(docId)
    .update(data)
    .catch(() => showError());
  console.log(res);
  return res;
};

const showError = () => message.error('请求出错，请稍后重试或联系刘固');
