import { db } from './until';

const fetchAllAdvisory = async ({
  name,
  undertaker,
}: {
  name: string;
  undertaker: string;
}) => {
  const res = await db
    .collection('Advisory')
    .aggregate()
    .match({
      //@ts-ignore
      name: new db.RegExp({
        regexp: `.*${name || ''}.*`,
        options: 'i',
      }),
      //@ts-ignore
      _openid: new db.RegExp({
        regexp: `.*${undertaker || ''}.*`,
        options: 'i',
      }),
    })
    .limit(1000)
    .sort({
      createTime: -1,
    })
    // 获取律师的名字
    .lookup({
      from: 'User',
      localField: '_openid',
      foreignField: '_openid',
      as: 'User',
    })
    .addFields({
      userName: '$User.name',
    })
    .project({
      User: 0,
    })
    .end();
  return res;
};

export { fetchAllAdvisory };
