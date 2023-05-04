## 准备工作
1. 安装 [pnpm](https://pnpm.io/)，pnpm 是一个更好的包管理器，可以替代 npm，yarn，安装命令如下：
``` shell
npm install -g pnpm
```
2. 安装 whistle，whistle 是一个抓包工具，用于调试接口，安装命令如下：
``` shell
npm install -g whistle
```
3. 推荐单独使用一个 chrome 浏览器进行开发调试，安装用于代理的插件 [SwitchyOmega](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif?hl=zh-CN)
，安装插件之后，进入配置页面，进入 导入导出 页面，选择在线恢复，输入 https://niuniu-1257163508.cos.ap-nanjing.myqcloud.com/OmegaOptions%20%281%29.bak  即可。开发时插件模式选择到 auto switch。
## 开始开发
``` md
1. 依赖安装
pnpm install

2. 启动开发模式
pnpm start
```


## 如何参与贡献
克隆下来仓库之后，基于 `main` 分支 `checkout` 一条自己的分支出来，修改完之后`git push`，`push` 之后命令行中会给出一个链接，点击链接提交PR即可。将 PR 的链接发给项目负责人，项目负责人会进行审核，审核通过之后即可合并到主分支。
### 如何部署修改到线上
本项目使用 Github Actions 自动部署到 Github Pages，只需要将修改提交到 main 分支即可。
### 分支规范
- `main` 主分支，用于部署到线上

- `feature/` 功能分支，用于开发新功能，命名规范为 `feature/作者名_功能点_日期`，例如 `feature/atomliu_doc_0504`
