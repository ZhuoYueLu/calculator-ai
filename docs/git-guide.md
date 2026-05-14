# Git 配置与使用指南

## 1. 安装 Git

### Windows 系统

#### 方法一：官方安装包（推荐）
1. 访问 [Git 官网](https://git-scm.com/download/win)
2. 下载最新版本的 Git for Windows
3. 运行安装程序，保持默认选项即可
4. 安装完成后，重启终端

#### 方法二：使用包管理器
```powershell
# 使用 Chocolatey
choco install git

# 使用 Scoop
scoop install git
```

### 验证安装
打开新的 PowerShell 或 CMD 窗口，执行：
```bash
git --version
```

应该显示类似：`git version 2.xx.x`

## 2. 配置 Git

### 2.1 设置用户信息
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### 2.2 查看配置
```bash
git config --list
```

### 2.3 配置常用别名（可选）
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

## 3. 初始化项目仓库

### 3.1 进入项目目录
```bash
cd d:\calculator-ai
```

### 3.2 初始化 Git 仓库
```bash
git init
```

这会创建一个隐藏的 `.git` 文件夹

### 3.3 查看状态
```bash
git status
```

你应该看到所有未跟踪的文件

## 4. 首次提交

### 4.1 添加所有文件到暂存区
```bash
git add .
```

### 4.2 查看暂存的文件
```bash
git status
```

### 4.3 提交代码
```bash
git commit -m "feat: 初始化 AI 计算器项目"
```

**提交消息规范**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

## 5. 分支管理

### 5.1 创建 dev 分支
```bash
git checkout -b dev
```

或者使用新命令：
```bash
git switch -c dev
```

### 5.2 查看分支
```bash
git branch
```

输出示例：
```
* dev
  main
```

星号 (*) 表示当前所在分支

### 5.3 切换分支
```bash
# 切换到 main 分支
git checkout main
# 或
git switch main

# 切换到 dev 分支
git checkout dev
# 或
git switch dev
```

## 6. 日常开发流程

### 6.1 在 dev 分支开发
```bash
# 确保在 dev 分支
git checkout dev

# 进行代码修改...

# 查看修改
git status

# 添加修改的文件
git add .
# 或添加特定文件
git add src/App.jsx

# 提交更改
git commit -m "feat: 添加单位转换功能"
```

### 6.2 合并到 main 分支
```bash
# 切换到 main 分支
git checkout main

# 合并 dev 分支
git merge dev

# 推送到远程仓库（如果已配置）
git push origin main
```

### 6.3 解决冲突（如果出现）
```bash
# 查看冲突文件
git status

# 手动编辑冲突文件，解决冲突

# 标记冲突已解决
git add <冲突文件>

# 完成合并
git commit -m "merge: 解决合并冲突"
```

## 7. 远程仓库

### 7.1 创建远程仓库

#### GitHub
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写仓库名称：`calculator-ai`
4. 选择 Public 或 Private
5. **不要** 初始化 README、.gitignore 或 license
6. 点击 "Create repository"

#### Gitee
1. 访问 https://gitee.com
2. 点击右上角 "+" → "新建仓库"
3. 填写仓库名称：`calculator-ai`
4. 选择公开或私有
5. **不要** 初始化 README
6. 点击 "创建"

#### GitCode
1. 访问 https://gitcode.com
2. 创建新仓库
3. 类似上述步骤

### 7.2 关联远程仓库

```bash
# GitHub
git remote add origin https://github.com/你的用户名/calculator-ai.git

# Gitee
git remote add origin https://gitee.com/你的用户名/calculator-ai.git

# GitCode
git remote add origin https://gitcode.com/你的用户名/calculator-ai.git
```

### 7.3 推送代码
```bash
# 推送 main 分支
git push -u origin main

# 推送 dev 分支
git push -u origin dev
```

### 7.4 拉取更新
```bash
git pull origin main
```

## 8. 常用 Git 命令速查

### 查看类
```bash
git status          # 查看文件状态
git log             # 查看提交历史
git log --oneline   # 简洁的提交历史
git diff            # 查看未暂存的修改
git diff --staged   # 查看已暂存的修改
git branch          # 查看分支
git remote -v       # 查看远程仓库
```

### 操作类
```bash
git add .           # 添加所有修改
git add <file>      # 添加指定文件
git commit -m "msg" # 提交更改
git push            # 推送到远程
git pull            # 拉取远程更新
git checkout <file> # 撤销文件修改
git reset HEAD <file> # 从暂存区移除
```

### 分支类
```bash
git branch              # 查看分支
git branch <name>       # 创建分支
git checkout <branch>   # 切换分支
git merge <branch>      # 合并分支
git branch -d <branch>  # 删除分支
```

## 9. Git 工作流程示例

### 完整开发周期
```bash
# 1. 克隆仓库（如果是首次）
git clone https://github.com/用户名/calculator-ai.git
cd calculator-ai

# 2. 创建并切换到 dev 分支
git checkout -b dev

# 3. 开发新功能
# ... 编辑代码 ...

# 4. 查看修改
git status
git diff

# 5. 暂存满意的部分
git add src/App.jsx

# 6. 提交
git commit -m "feat: 优化计算器UI"

# 7. 继续开发
# ... 更多修改 ...
git add .
git commit -m "feat: 添加单位转换功能"

# 8. 功能完成，切换到 main
git checkout main

# 9. 合并 dev
git merge dev

# 10. 推送到远程
git push origin main
git push origin dev
```

## 10. 最佳实践

### 10.1 提交规范
- ✅ 小而频繁的提交
- ✅ 清晰的提交消息
- ✅ 一次提交只做一件事
- ❌ 不要提交 node_modules
- ❌ 不要提交敏感信息

### 10.2 分支策略
- `main`: 稳定版本，随时可部署
- `dev`: 开发分支，新功能在此开发
- `feature/*`: 特性分支（可选）

### 10.3 提交消息模板
```
<类型>: <简短描述>

<详细说明（可选）>

<相关问题（可选）>
```

示例：
```
feat: 添加温度单位转换功能

- 支持摄氏度、华氏度、开尔文之间的转换
- 实现温度转换算法
- 添加相应的 UI 组件

Closes #123
```

## 11. 常见问题

### Q1: 如何撤销最后一次提交？
```bash
git reset --soft HEAD~1  # 保留修改在暂存区
git reset --hard HEAD~1  # 完全丢弃修改（危险！）
```

### Q2: 如何撤销已推送到远程的提交？
```bash
# 谨慎使用！
git revert <commit-hash>
git push origin main
```

### Q3: 如何查看某个文件的修改历史？
```bash
git log --follow -- <filename>
git blame <filename>
```

### Q4: 如何暂存当前工作？
```bash
git stash           # 暂存
git stash list      # 查看暂存列表
git stash pop       # 恢复暂存
```

### Q5: 如何删除远程分支？
```bash
git push origin --delete <branch-name>
```

## 12. 学习资源

- [Git 官方文档](https://git-scm.com/doc)
- [Git 教程 - 菜鸟教程](https://www.runoob.com/git/git-tutorial.html)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [Learn Git Branching](https://learngitbranching.js.org/?locale=zh_CN)

## 13. 下一步

完成本地 Git 配置后：

1. ✅ 安装 Git
2. ✅ 配置用户信息
3. ✅ 初始化仓库
4. ✅ 创建 dev 分支
5. ✅ 提交代码
6. 📤 创建远程仓库（GitHub/Gitee/GitCode）
7. 📤 关联远程仓库
8. 📤 推送代码
9. 📤 填写作业提交的仓库链接

祝你好运！🚀
