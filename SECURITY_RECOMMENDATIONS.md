# 安全加固建议

本文档列出了系统的安全加固措施和需要手动配置的安全设置。

## 已实现的安全加固

### 1. 云函数身份验证和授权

所有云函数现在都会验证调用者身份：

- ✅ 所有云函数调用需要用户登录
- ✅ 检查用户是否已离职
- ✅ 管理员操作需要角色验证
- ✅ 审批人 ID 由服务端获取，防止前端伪造

### 2. 敏感信息保护

- ✅ 非管理员无法查看其他用户的手机号
- ✅ `fetch_all_user` 自动过滤敏感字段

### 3. 输入验证

- ✅ 搜索输入自动转义正则表达式特殊字符，防止 ReDoS 攻击

### 4. 原子操作

- ✅ 案号生成使用云函数原子自增，避免并发重号

## 需要手动配置的安全设置

### 1. CloudBase 数据库安全规则

**当前状态：** 数据库安全规则不在代码仓库中，需要在 CloudBase 控制台手动配置。

**推荐配置：**

```json
{
  "read": "auth.uid != null && !get('database.User.${auth.uid}').isLeave",
  "write": false
}
```

**说明：**
- 所有读操作需要用户已登录且未离职
- 禁止客户端直接写入数据库，所有写操作通过云函数进行

**具体集合规则：**

#### Cases（案件）集合
```json
{
  "read": "auth.uid != null && !get('database.User.${auth.uid}').isLeave",
  "write": false
}
```

#### User（用户）集合
```json
{
  "read": "auth.uid != null && (auth.uid == doc.unionId || get('database.User.${auth.uid}').role == 'admin')",
  "write": false
}
```

#### Advisory（顾问单位）集合
```json
{
  "read": "auth.uid != null && !get('database.User.${auth.uid}').isLeave",
  "write": false
}
```

#### Notice（通知）集合
```json
{
  "read": "auth.uid != null && auth.uid == doc.unionId",
  "write": false
}
```

#### Cache（缓存）集合
```json
{
  "read": "auth.uid != null",
  "write": false
}
```

### 2. CloudBase 云函数运行时配置

**当前配置：** 云函数 target 设置为 `node20`

**需要在 CloudBase 控制台确认：**
1. 打开 CloudBase 控制台
2. 进入云函数 `fn_call` 配置
3. 确认运行环境为 Node.js 20
4. 如果不是，手动更新运行环境

### 3. 环境变量和密钥

**不要在代码中硬编码：**
- ❌ 微信 AppID（当前在代码中）
- ❌ CloudBase 环境 ID（当前在代码中）

**建议：**
1. 使用 CloudBase 环境变量存储敏感配置
2. 在云函数中通过 `process.env` 读取
3. 定期轮换 API 密钥

### 4. GitHub Secrets 配置

确保以下 Secrets 已正确配置：

- `SECRET_ID`: 腾讯云 API 密钥 ID
- `SECRET_KEY`: 腾讯云 API 密钥 Key
- `BUCKET`: 腾讯云 COS Bucket 名称

### 5. 用户注册控制

**当前实现：**
- 微信扫码登录会自动创建用户记录
- 新用户需要填写完整信息才能使用系统

**建议增强：**
1. 在 CloudBase 中配置白名单机制
2. 只允许特定的微信 unionId 注册
3. 或者实现管理员审批机制

### 6. 云存储（COS）安全

**附件上传路径：** `caseAnnex/{unionId}/{filename}`

**当前问题：**
- 同名文件会被覆盖
- 没有文件大小限制
- 没有文件类型限制

**建议：**
1. 在 COS 配置中设置：
   - 文件大小限制（如 10MB）
   - 允许的文件类型白名单
   - 启用防盗链
2. 修改文件命名策略，添加时间戳或 UUID 避免覆盖

### 7. 网络安全

**建议配置：**
1. 启用 HTTPS（当前应该已启用）
2. 配置 CSP（内容安全策略）
3. 启用 CloudBase 的 IP 白名单（如果需要）

## 部署后验证清单

部署到生产环境后，请验证：

- [ ] 数据库安全规则已正确配置
- [ ] 云函数运行环境为 Node.js 20
- [ ] 非管理员无法查看其他用户手机号
- [ ] 非管理员无法调用管理员专用云函数
- [ ] 已离职用户无法登录
- [ ] 案号生成没有重复（并发测试）
- [ ] 搜索功能正常（包含特殊字符）
- [ ] 审批功能正常且审批人正确

## 安全监控建议

1. **定期检查：**
   - CloudBase 审计日志
   - 异常的 API 调用
   - 大量失败的登录尝试

2. **告警配置：**
   - 云函数异常错误率告警
   - 数据库操作失败告警
   - COS 异常访问告警

3. **定期更新：**
   - 依赖包安全更新
   - CloudBase SDK 版本更新
   - Node.js 运行时更新

## 联系方式

如有安全问题或建议，请联系系统管理员。
