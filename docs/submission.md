# 📤 作业提交指南

## ⚠️ 重要提醒

在提交作业前，请确保完成以下步骤！

## ✅ 提交前检查清单

### 1. 功能测试
- [ ] 计算器四则运算正常
- [ ] 单位转换功能正常
- [ ] 界面美观无bug
- [ ] 响应式设计正常

### 2. 文档检查
- [ ] README.md 完整
- [ ] docs 目录存在
- [ ] docs 下有详细文档

### 3. Git 配置（必须完成）

#### 步骤 1: 安装 Git（如果未安装）
下载地址：https://git-scm.com/download/win

安装后重启终端，验证：
```bash
git --version
```

#### 步骤 2: 配置 Git 用户信息
```bash
git config --global user.name "你的真实姓名"
git config --global user.email "你的邮箱@example.com"
```

#### 步骤 3: 初始化仓库
```bash
cd d:\calculator-ai
git init
```

#### 步骤 4: 添加并提交代码
```bash
git add .
git commit -m "feat: 完成 AI 计算器项目

- 实现四则运算功能
- 实现单位转换功能（长度、重量、温度、面积）
- 设计现代化 UI 界面
- 编写完整的项目文档
"
```

#### 步骤 5: 创建 dev 分支
```bash
git checkout -b dev
```

#### 步骤 6: 创建远程仓库

**选择以下任一平台：**

##### 选项 A: GitHub（推荐）
1. 访问 https://github.com
2. 登录账号
3. 点击右上角 "+" → "New repository"
4. Repository name: `calculator-ai`
5. Description: `AI 计算器 Web 应用 - 支持四则运算和单位转换`
6. 选择 **Public**（公开）
7. **不要勾选** Initialize this repository with a README
8. 点击 "Create repository"
9. 复制仓库地址，例如：`https://github.com/你的用户名/calculator-ai.git`

##### 选项 B: Gitee（码云）
1. 访问 https://gitee.com
2. 登录账号
3. 点击右上角 "+" → "新建仓库"
4. 仓库名称: `calculator-ai`
5. 介绍: `AI 计算器 Web 应用`
6. 选择 **公开**
7. **不要勾选** 使用 Readme 文件初始化这个仓库
8. 点击 "创建"
9. 复制仓库地址

##### 选项 C: GitCode
1. 访问 https://gitcode.com
2. 创建新仓库
3. 类似上述步骤

#### 步骤 7: 关联远程仓库并推送

```bash
# 替换为你的实际仓库地址
git remote add origin https://github.com/你的用户名/calculator-ai.git

# 重命名当前分支为 main
git branch -M main

# 推送 main 分支
git push -u origin main

# 推送 dev 分支
git checkout dev
git push -u origin dev
```

如果推送时需要登录，使用你的 GitHub/Gitee 账号密码或 Token。

#### 步骤 8: 验证推送成功
访问你的仓库页面，确认：
- [ ] 能看到所有文件
- [ ] main 分支存在
- [ ] dev 分支存在
- [ ] README.md 显示正常

### 4. 获取仓库链接

复制你的仓库 URL，格式如下：
- GitHub: `https://github.com/你的用户名/calculator-ai`
- Gitee: `https://gitee.com/你的用户名/calculator-ai`
- GitCode: `https://gitcode.com/你的用户名/calculator-ai`

**示例**:
```
https://github.com/zhangsan/calculator-ai
```

### 5. 填写作业提交表单

将上面的仓库链接复制到作业提交框中。

## 📋 快速命令汇总

如果你已经安装了 Git，可以直接执行以下命令：

```bash
# 进入项目目录
cd d:\calculator-ai

# 配置 Git（首次需要）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 初始化并提交
git init
git add .
git commit -m "feat: 完成 AI 计算器项目"

# 创建 dev 分支
git checkout -b dev

# 关联远程仓库（替换为你的实际地址）
git remote add origin https://github.com/你的用户名/calculator-ai.git

# 推送
git branch -M main
git push -u origin main
git checkout dev
git push -u origin dev
```

## 🔍 验证清单

提交前最后确认：

### 远程仓库检查
- [ ] 可以访问仓库页面
- [ ] main 分支有代码
- [ ] dev 分支有代码
- [ ] README.md 正确显示
- [ ] docs 目录存在
- [ ] 所有文件都已上传

### 本地检查
- [ ] `git branch` 显示 main 和 dev
- [ ] `git status` 显示干净（无待提交文件）
- [ ] `git log` 有提交记录

### 功能检查
- [ ] 运行 `pnpm dev` 能正常启动
- [ ] 浏览器访问正常
- [ ] 所有功能可用

## ❓ 常见问题

### Q1: git 命令找不到？
**A**: 需要先安装 Git，下载地址：https://git-scm.com/download/win

### Q2: push 时认证失败？
**A**: 
- GitHub: 使用 Personal Access Token 代替密码
- Gitee: 使用账号密码即可

### Q3: 提示分支已存在？
**A**: 
```bash
# 删除本地分支重新创建
git branch -D dev
git checkout -b dev
```

### Q4: 推送到错误的仓库？
**A**: 
```bash
# 移除错误的远程仓库
git remote remove origin

# 添加正确的
git remote add origin 正确的仓库地址
```

### Q5: 忘记创建 dev 分支？
**A**: 
```bash
git checkout -b dev
git push -u origin dev
```

## 📸 建议添加截图（可选但推荐）

为了让作业更完整，建议在 README.md 中添加应用截图：

1. 打开应用（pnpm dev）
2. 截取计算器模式
3. 截取单位转换模式
4. 将图片放到项目中
5. 在 README.md 中引用

示例：
```markdown
## 📸 应用截图

### 计算器模式
![计算器](./screenshots/calculator.png)

### 单位转换模式
![转换器](./screenshots/converter.png)
```

## 🎯 最终提交

确认以上所有步骤完成后：

1. ✅ 复制仓库链接
2. ✅ 粘贴到作业提交框
3. ✅ 提交作业
4. ✅ 等待评分

## 💡 加分项

如果想获得更高分数，可以：

1. **完善 README**: 添加截图、GIF 动图
2. **在线演示**: 部署到 Vercel/Netlify，提供在线访问链接
3. **更多功能**: 添加历史记录、科学计算等
4. **TypeScript**: 用 TypeScript 重构
5. **单元测试**: 添加测试用例

## 📞 需要帮助？

如果遇到问题：
1. 查看 `docs/git-guide.md` 详细教程
2. 在群里提问
3. 私聊群主

---

**祝你作业顺利！🎉**

记得：
- ⏰ 注意提交截止时间
- 🔗 确保仓库链接正确
- ✅ 确认所有要求都满足
- 🎊 享受完成的成就感！
