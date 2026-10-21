# 湖南河清律师事务所内部管理系统

## 项目简介

这是湖南河清律师事务所的内部案件管理系统，支持案件报批、审批、律师信息管理、法律顾问单位管理等功能。

**技术栈：**
- 前端：Umi 4 + React 18 + antd 5 + ProComponents
- 后端：腾讯云开发 CloudBase（云数据库 + 云函数）
- 认证：微信扫码登录
- 部署：GitHub Actions + 腾讯云 COS

**线上地址：** law.liuxiaogu.com

## 主要功能

- **案件报批**：律师可以提交民事/刑事/行政案件报批申请
- **案件审批**：管理员可以审批案件，支持批量审批
- **案件查询**：查看已审批案件列表、我的案件
- **律师信息管理**：管理员可以管理律师信息，包括权限设置
- **顾问单位管理**：管理法律顾问单位信息
- **站内通知**：案件审批结果自动通知相关人员
- **附件管理**：支持案件附件上传下载

## 开发环境要求

- Node.js >= 20.0.0
- pnpm >= 8.0.0

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm start
```

开发服务器会自动配置 whistle 代理用于调试。

### 3. 构建生产版本

```bash
# 仅构建云函数
pnpm run build:function

# 仅构建前端
pnpm run build
```

**注意：** `pnpm run build` 不再自动部署云函数到生产环境。

## 开发指南

### 项目结构

```
├── src/                    # 前端源码
│   ├── pages/             # 页面组件
│   ├── components/        # 公共组件
│   ├── services/          # 服务层（API 调用）
│   ├── models/            # 数据模型
│   └── app.tsx            # 应用入口
├── functions/             # 云函数源码
│   └── src/
│       ├── index.ts       # 云函数入口
│       ├── auth.ts        # 身份验证
│       └── *.ts           # 各功能模块
├── config/                # 配置文件
│   └── config.ts          # Umi 配置
└── public/                # 静态资源
```

### 代码质量

```bash
# TypeScript 类型检查
pnpm run typecheck

# ESLint 检查
pnpm run lint

# 自动修复 lint 问题
pnpm run lint:fix

# 运行测试
pnpm run test

# 代码格式化
pnpm run prettier
```

### 云函数说明

所有云函数统一通过 `fn_call` 入口调用，支持的函数包括：

- `create_case`: 创建案件（自动生成案号）
- `change_case`: 修改案件信息
- `one_click_approve`: 批量审批（管理员专用）
- `update_user_info`: 更新用户信息（管理员专用）
- `fetch_all_user`: 获取用户列表（自动过滤敏感信息）
- `fetch_all_advisory`: 获取顾问单位列表
- `get_case_list`: 查询案件列表
- `generate_case_id`: 原子生成案号
- `wx_login`: 微信登录

**安全特性：**
- 所有云函数调用都会进行身份验证
- 管理员操作需要角色校验
- 非管理员无法查看其他用户手机号
- 审批人 ID 由服务端获取，不允许前端伪造

## 部署说明

### 生产部署

推送到 `main` 分支会自动触发生产部署流程：

1. 类型检查
2. Lint 检查
3. 运行测试
4. 构建云函数
5. 构建前端
6. 部署云函数到腾讯云
7. 上传静态文件到 COS

### PR 检查

创建 Pull Request 时会自动运行：

1. 类型检查
2. Lint 检查
3. 运行测试
4. 构建验证

**不会部署到生产环境。**

### 手动部署云函数

```bash
# 部署到开发环境
pnpm run fnDeployDev

# 部署到生产环境
pnpm run fnDeployPrd
```

**注意：** 需要先配置好 CloudBase CLI 凭证。

## 环境配置

### 开发环境

- CloudBase 环境 ID: `atom-2gbnzw0gde4242dc`
- 微信 AppID: `wx6df6a071b2944a44`

### 生产环境

- CloudBase 环境 ID: `atom-build-3gucmakw82f1fc3c`
- 微信 AppID: `wx6df6a071b2944a44`

### GitHub Secrets 配置

需要在 GitHub 仓库设置中配置以下 Secrets：

- `SECRET_ID`: 腾讯云 API 密钥 ID
- `SECRET_KEY`: 腾讯云 API 密钥 Key
- `BUCKET`: 腾讯云 COS Bucket 名称

## 贡献指南

1. 从 `main` 分支创建新分支：`git checkout -b feature/your-feature-name`
2. 提交代码：`git commit -m "feat: your feature description"`
3. 推送分支：`git push origin feature/your-feature-name`
4. 创建 Pull Request

### 分支命名规范

- `feature/作者名_功能点_日期`：功能分支
- `fix/描述`：Bug 修复
- `docs/描述`：文档更新

### Commit 规范

遵循 Conventional Commits 规范：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 已知问题与改进建议

### 安全相关

- 数据库安全规则不在代码仓库中，建议导出并纳入版本控制
- 建议定期轮换 API 密钥
- 考虑添加更细粒度的权限控制

### 功能增强

- 支持多附件上传
- 优化附件命名避免覆盖
- 添加更多的数据统计和报表功能
- 支持案件导出

## 技术支持

如有问题，请联系项目负责人或提交 Issue。

## License

Private - 仅供湖南河清律师事务所内部使用
