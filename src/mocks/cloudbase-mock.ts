/**
 * Mock CloudBase SDK for local development
 * Only active when MOCK_MODE=true in development
 */

interface MockDoc {
  _id: string;
  [key: string]: any;
}

interface MockCollection {
  name: string;
  data: MockDoc[];
}

export class MockDatabase {
  private collections: Map<string, MockCollection> = new Map();
  command = {
    RegExp: ({ regexp }: { regexp: string }) => ({ regexp }),
    neq: (value: unknown) => ({ neq: value }),
    gt: (value: unknown) => ({ gt: value }),
    in: (value: unknown) => ({ in: value }),
    eq: (value: unknown) => ({ eq: value }),
  };

  constructor() {
    this.seedData();
  }

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, { name, data: [] });
    }
    return new MockCollectionReference(this.collections.get(name)!);
  }

  private seedData() {
    // Seed Users
    const users = [
      {
        _id: 'admin-user-id',
        unionId: 'admin-union-id',
        name: '管理员',
        phone: '13800138000',
        isLeave: false,
        hasAddInfo: true,
        role: 'admin',
        admin: true,
      },
      {
        _id: 'normal-user-id',
        unionId: 'normal-union-id',
        name: '普通律师',
        phone: '13900139000',
        isLeave: false,
        hasAddInfo: true,
        admin: false,
      },
      {
        _id: 'departed-user-id',
        unionId: 'departed-union-id',
        name: '已离职律师',
        phone: '13700137000',
        isLeave: true,
        hasAddInfo: true,
        admin: false,
      },
    ];
    this.collections.set('User', { name: 'User', data: users });

    // Seed Cases
    const cases = [
      {
        _id: 'case-1',
        caseId: '湘河清(2026)字第001号',
        CaseType: 0,
        caseCause: '合同纠纷',
        litigant: '张三',
        otherlitigant: '李四',
        undertaker: 'admin-union-id',
        undertakerName: '管理员',
        proposedFees: '50000',
        agencyStage: '一审',
        caseSituation: '案件基本情况描述',
        opinionBoss: '主任意见',
        approveStatus: 1,
        createTime: '2026-01-15',
        unionId: 'admin-union-id',
      },
      {
        _id: 'case-2',
        caseId: '湘河清(2026)字第002号',
        CaseType: 2,
        caseCause: '故意伤害',
        litigant: '王五',
        undertaker: 'normal-union-id',
        undertakerName: '普通律师',
        proposedFees: '30000',
        agencyStage: '侦查阶段',
        caseSituation: '刑事案件情况',
        approveStatus: 0,
        createTime: '2026-02-20',
        unionId: 'normal-union-id',
      },
    ];
    this.collections.set('Cases', { name: 'Cases', data: cases });

    // Seed Advisory
    const advisory = [
      {
        _id: 'advisory-1',
        name: '某科技公司',
        timeRange: ['2026-01-01', '2026-12-31'],
        unionId: 'admin-union-id',
      },
    ];
    this.collections.set('Advisory', { name: 'Advisory', data: advisory });

    // Seed Notice
    const notices = [
      {
        _id: 'notice-1',
        type: 0,
        state: 0,
        content: '测试通知内容',
        caseId: 'case-1',
        createTime: new Date().toISOString(),
        unionId: 'admin-union-id',
      },
    ];
    this.collections.set('Notice', { name: 'Notice', data: notices });

    // Seed Cache
    this.collections.set('Cache', { name: 'Cache', data: [
      { _id: 'case-id-counter', value: 3 }
    ]});
  }
}

class MockCollectionReference {
  private collection: MockCollection;
  private whereClause: any = {};
  private orderByField: string | null = null;
  private orderByDirection: 'asc' | 'desc' = 'asc';
  private skipCount: number = 0;
  private limitCount: number = 1000;

  constructor(collection: MockCollection) {
    this.collection = collection;
  }

  where(condition: any) {
    this.whereClause = { ...this.whereClause, ...condition };
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    this.orderByField = field;
    this.orderByDirection = direction;
    return this;
  }

  skip(count: number) {
    this.skipCount = count;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  doc(id: string) {
    return new MockDocReference(this.collection, id);
  }

  async get() {
    let results = [...this.collection.data];

    // Apply where clause
    if (Object.keys(this.whereClause).length > 0) {
      results = results.filter((doc) => {
        return Object.entries(this.whereClause).every(([key, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Handle command operators
            return true; // Simplified for mock
          }
          return doc[key] === value;
        });
      });
    }

    // Apply orderBy
    if (this.orderByField) {
      results.sort((a, b) => {
        const aVal = a[this.orderByField!];
        const bVal = b[this.orderByField!];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return this.orderByDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Apply skip and limit
    results = results.slice(this.skipCount, this.skipCount + this.limitCount);

    return { data: results };
  }

  async count() {
    const result = await this.get();
    return { total: result.data.length };
  }

  async add(data: any) {
    const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newDoc = { _id: id, ...data };
    this.collection.data.push(newDoc);
    return { _id: id, id };
  }

  command = {
    aggregate: () => ({
      sum: () => ({ done: async () => ({ list: [{ _sum: 0 }] }) }),
    }),
  };
}

class MockDocReference {
  private collection: MockCollection;
  private docId: string;

  constructor(collection: MockCollection, docId: string) {
    this.collection = collection;
    this.docId = docId;
  }

  async get() {
    const doc = this.collection.data.find((d) => d._id === this.docId);
    return { data: doc ? [doc] : [] };
  }

  async update(data: any) {
    const index = this.collection.data.findIndex((d) => d._id === this.docId);
    if (index >= 0) {
      // Handle special operations like _.inc
      const processedData = { ...data };
      Object.keys(processedData).forEach(key => {
        const value = processedData[key];
        if (value && typeof value === 'object' && value._inc !== undefined) {
          processedData[key] = (this.collection.data[index][key] || 0) + value._inc;
        }
      });
      
      this.collection.data[index] = {
        ...this.collection.data[index],
        ...processedData,
      };
      return { updated: 1 };
    }
    return { updated: 0 };
  }

  async remove() {
    const index = this.collection.data.findIndex((d) => d._id === this.docId);
    if (index >= 0) {
      this.collection.data.splice(index, 1);
      return { deleted: 1 };
    }
    return { deleted: 0 };
  }

  async set(data: any) {
    const index = this.collection.data.findIndex((d) => d._id === this.docId);
    if (index >= 0) {
      this.collection.data[index] = { _id: this.docId, ...data };
    } else {
      this.collection.data.push({ _id: this.docId, ...data });
    }
    return { _id: this.docId };
  }
}

class MockAuth {
  public currentUser: any = null;

  async signInAnonymously() {
    return { user: null };
  }

  async getCurrentUser() {
    return this.currentUser;
  }

  async getLoginState() {
    return this.currentUser ? { isAnonymous: false, user: this.currentUser } : null;
  }

  hasLoginState() {
    return !!this.currentUser;
  }

  async signOut() {
    this.currentUser = null;
  }

  // Mock login for testing
  mockLogin(userType: 'admin' | 'normal' = 'admin') {
    if (userType === 'admin') {
      this.currentUser = {
        uid: 'admin-union-id',
        unionId: 'admin-union-id',
        nickName: '管理员',
      };
    } else {
      this.currentUser = {
        uid: 'normal-union-id',
        unionId: 'normal-union-id',
        nickName: '普通律师',
      };
    }
    return this.currentUser;
  }
}

class MockCloudApp {
  private db: MockDatabase;
  private authInstance: MockAuth;

  constructor() {
    this.db = new MockDatabase();
    this.authInstance = new MockAuth();
    
    // Auto-login as admin in mock mode
    const userType = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mockUser')) || 'admin';
    this.authInstance.mockLogin(userType as 'admin' | 'normal');
  }

  database() {
    return this.db;
  }

  auth(_options?: any) {
    // CloudBase clients call app.auth(); keep that distinct from the auth instance.
    return this.authInstance;
  }

  async getRedirectResult() {
    return null;
  }

  signInWithRedirect() {
    return Promise.resolve();
  }

  async callFunction(params: { name: string; data: any }) {
    // Route to local function handlers
    console.log('[Mock] callFunction:', params.name, params.data);
    
    if (params.name === 'fn_call') {
      const { fnName, data } = params.data;
      
      // Create a mock context similar to CloudBase
      const context = {
        TCB_UUID: this.authInstance.currentUser?.uid || 'mock-uuid',
        TCB_UNIONID: this.authInstance.currentUser?.unionId || 'mock-unionid',
        TCB_OPENID: this.authInstance.currentUser?.openid || 'mock-openid',
      };
      
      try {
        // Execute the mock function handler with mock DB
        const { executeMockFunction } = await import('./function-adapter');
        const result = await executeMockFunction(this.db, fnName, data, context);
        return { result };
      } catch (error: any) {
        console.error('[Mock] Function execution error:', error);
        return {
          result: {
            error: true,
            message: error.message || '服务器错误',
          },
        };
      }
    }
    
    // Fallback for other functions
    return {
      result: {
        success: true,
        message: 'Mock function executed',
      },
    };
  }

  uploadFile(params: { cloudPath: string; filePath: any }) {
    console.log('[Mock] uploadFile:', params.cloudPath);
    return Promise.resolve({
      fileID: `mock-file-${Date.now()}`,
    });
  }

  getTempFileURL(params: { fileList: string[] }) {
    console.log('[Mock] getTempFileURL:', params.fileList);
    return Promise.resolve({
      fileList: params.fileList.map((fileID) => ({
        fileID,
        tempFileURL: `https://mock-storage.example.com/${fileID}`,
      })),
    });
  }
}

// Command helpers for mock
export const mockCommand = {
  inc: (value: number) => ({ _inc: value }),
};

// Singleton instance
let mockCloudAppInstance: MockCloudApp | null = null;

export function getMockCloudApp() {
  if (!mockCloudAppInstance) {
    mockCloudAppInstance = new MockCloudApp();
  }
  return mockCloudAppInstance;
}

export function isMockMode() {
  return process.env.MOCK_MODE === 'true' || process.env.UMI_ENV === 'mock';
}
