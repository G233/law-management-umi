/**
 * CloudBase Mock
 * 用于本地开发和测试，不连接真实的 CloudBase 环境
 */

const mockUsers = [
  {
    _id: 'mock-user-1',
    unionId: 'mock-union-1',
    name: '张律师',
    phone: '13800138000',
    role: 'admin',
    isLeave: false,
    hasAddInfo: true,
  },
  {
    _id: 'mock-user-2',
    unionId: 'mock-union-2',
    name: '李律师',
    phone: '13800138001',
    role: 'user',
    isLeave: false,
    hasAddInfo: true,
  },
];

const mockCases: any[] = [];
const mockNotices: any[] = [];

export const createMockCloudBase = () => {
  const currentUser: any = null;

  const mockDB = {
    collection: (name: string) => ({
      where: (query: any) => ({
        get: async () => {
          let data: any[] = [];
          if (name === 'User') {
            data = mockUsers.filter((user) => {
              return Object.keys(query).every((key) => {
                if (typeof query[key] === 'object' && query[key]?.neq !== undefined) {
                  return user[key] !== query[key].neq;
                }
                return user[key] === query[key];
              });
            });
          } else if (name === 'Cases') {
            data = mockCases.filter((c) =>
              Object.keys(query).every((key) => c[key] === query[key]),
            );
          }
          return { data };
        },
        orderBy: () => ({
          get: async () => ({ data: [] }),
        }),
      }),
      get: async () => {
        if (name === 'User') return { data: mockUsers };
        if (name === 'Cases') return { data: mockCases };
        return { data: [] };
      },
      add: async (doc: any) => {
        const id = `mock-${name}-${Date.now()}`;
        const newDoc = { ...doc, _id: id };
        if (name === 'Cases') mockCases.push(newDoc);
        return { id };
      },
      doc: (id: string) => ({
        get: async () => {
          let doc;
          if (name === 'User') doc = mockUsers.find((u) => u._id === id);
          if (name === 'Cases') doc = mockCases.find((c) => c._id === id);
          if (name === 'Cache' && id === '28ee4e3e605adc2d08064d5d28764c11') {
            doc = {
              2024: { 0: 10, 1: 5, 2: 3 },
              caseCauseList: ['合同纠纷', '侵权纠纷'],
            };
          }
          return { data: doc ? [doc] : [] };
        },
        update: async (data: any) => {
          return { updated: 1 };
        },
        set: async (data: any) => {
          return { updated: 1 };
        },
        remove: async () => {
          return { deleted: 1 };
        },
      }),
      aggregate: () => ({
        match: () => ({
          sort: () => ({
            skip: () => ({
              limit: () => ({
                lookup: () => ({
                  addFields: () => ({
                    project: () => ({
                      end: async () => ({ data: [] }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
        count: () => ({
          end: async () => ({ data: [{ count: 0 }] }),
        }),
      }),
    }),
    command: {
      aggregate: {
        gt: (val: any) => ({ $gt: val }),
        neq: (val: any) => ({ $neq: val }),
      },
    },
    RegExp: class {
      constructor(options: any) {
        return { $regex: options.regexp };
      }
    },
  };

  const mockAuth = {
    hasLoginState: () => true,
    getCurrenUser: async () => ({
      unionId: 'mock-union-1',
      nickName: '张律师',
      avatarUrl: '',
    }),
    signOut: async () => {},
    weixinAuthProvider: () => ({
      signInWithRedirect: () => {
        console.log('[Mock] 微信扫码登录');
      },
    }),
    getRedirectResult: async () => null,
    currentUser: null,
  };

  return {
    init: () => ({
      auth: (config?: any) => {
        const provider = mockAuth.weixinAuthProvider();
        return {
          ...mockAuth,
          weixinAuthProvider: () => provider,
          getRedirectResult: mockAuth.getRedirectResult,
        };
      },
      database: () => mockDB,
      callFunction: async ({ name, data }: any) => {
        console.log(`[Mock] Cloud function called: ${name}`, data);
        return { result: { success: true } };
      },
      uploadFile: async ({ cloudPath, filePath }: any) => {
        console.log(`[Mock] Upload file: ${cloudPath}`);
        return { fileID: `mock-file-${Date.now()}` };
      },
      downloadFile: async ({ fileID }: any) => {
        console.log(`[Mock] Download file: ${fileID}`);
        return { tempFilePath: '/tmp/mock-file' };
      },
    }),
  };
};

// 判断是否使用 mock
export const shouldUseMock = () => {
  return process.env.USE_MOCK_CLOUDBASE === 'true';
};
