# 开发文档

## 1. 环境搭建

### 1.1 安装 Node.js
访问 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本（>= 16）

验证安装：
```bash
node -v
npm -v
```

### 1.2 安装 Pnpm
```bash
npm install -g pnpm
```

验证安装：
```bash
pnpm -v
```

### 1.3 配置国内镜像源（可选）
```bash
pnpm config set registry https://registry.npmmirror.com
```

## 2. 项目初始化

### 2.1 创建 Vite + React 项目
```bash
pnpm create vite@latest calculator-ai --template react
cd calculator-ai
pnpm install
```

### 2.2 启动开发服务器
```bash
pnpm dev
```

浏览器访问 http://localhost:5173

## 3. 代码结构说明

### 3.1 核心文件

#### src/App.jsx
主应用组件，包含：
- 状态管理（计算器、转换器、模式切换）
- 业务逻辑（计算、转换算法）
- UI 渲染

#### src/App.css
应用样式文件，包含：
- 全局样式重置
- 组件样式定义
- 动画效果
- 响应式布局

#### src/main.jsx
应用入口文件，负责：
- React 应用初始化
- 根组件渲染

### 3.2 关键代码解析

#### 计算器逻辑
```javascript
const handleClick = (val) => {
  if (val === 'C') return setInput('');
  if (val === '=') {
    try {
      const result = Function('return ' + input)();
      setInput(String(result));
    } catch {
      setInput('Error');
    }
    return;
  }
  setInput(prev => prev + val);
};
```

**说明**:
- 使用 `Function` 构造函数动态执行数学表达式
- try-catch 捕获语法错误
- 支持连续输入和运算

#### 单位转换逻辑
```javascript
const handleConvert = () => {
  if (!value || isNaN(value)) {
    setResult('请输入有效数字');
    return;
  }

  const numValue = parseFloat(value);
  let converted;

  if (conversionType === 'temperature') {
    converted = convertTemperature(numValue, fromUnit, toUnit);
  } else {
    const fromRate = conversionTypes[conversionType].units[fromUnit].rate;
    const toRate = conversionTypes[conversionType].units[toUnit].rate;
    converted = (numValue / fromRate) * toRate;
  }

  setResult(converted.toFixed(4).replace(/\.?0+$/, ''));
};
```

**说明**:
- 温度转换使用特殊公式
- 其他单位使用比率转换
- 结果保留4位小数，去除末尾零

## 4. 样式设计

### 4.1 CSS 特性使用

#### 渐变背景
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

#### 玻璃态效果
```css
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.95);
```

#### 动画定义
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 响应式设计
```css
@media (max-width: 480px) {
  .calculator-wrapper {
    padding: 20px;
  }
}
```

### 4.2 设计原则
- **一致性**: 统一的圆角、间距、颜色
- **层次性**: 通过阴影和渐变营造深度
- **反馈性**: 悬停、点击状态的视觉反馈
- **可用性**: 清晰的对比度，易读的字体

## 5. Git 版本控制

### 5.1 初始化仓库
```bash
git init
```

### 5.2 配置用户信息
```bash
git config user.name "你的名字"
git config user.email "你的邮箱"
```

### 5.3 创建 .gitignore
确保以下文件不被提交：
```
node_modules/
dist/
.env
.DS_Store
```

### 5.4 分支管理

#### 创建 dev 分支
```bash
git checkout -b dev
```

#### 提交代码
```bash
git add .
git commit -m "feat: 添加计算器基础功能"
```

#### 合并到 main
```bash
git checkout main
git merge dev
```

### 5.5 常用 Git 命令

| 命令 | 说明 |
|------|------|
| `git status` | 查看文件状态 |
| `git add <file>` | 添加文件到暂存区 |
| `git commit -m "msg"` | 提交更改 |
| `git log` | 查看提交历史 |
| `git branch` | 查看分支 |
| `git checkout <branch>` | 切换分支 |
| `git push` | 推送到远程仓库 |
| `git pull` | 拉取远程更新 |

## 6. 调试技巧

### 6.1 React DevTools
安装 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) 浏览器扩展

### 6.2 控制台调试
```javascript
console.log('当前状态:', { input, mode });
```

### 6.3 浏览器开发者工具
- **Elements**: 检查 DOM 和样式
- **Console**: 查看日志和错误
- **Network**: 监控网络请求
- **Performance**: 分析性能

## 7. 常见问题

### 7.1 依赖安装失败
**问题**: pnpm install 报错

**解决**:
```bash
# 清除缓存
pnpm store prune

# 删除 node_modules 重新安装
rm -rf node_modules
pnpm install
```

### 7.2 端口被占用
**问题**: 开发服务器启动失败

**解决**:
```bash
# 指定其他端口
pnpm dev --port 3000
```

### 7.3 样式不生效
**问题**: CSS 修改后没有效果

**解决**:
- 检查 CSS 文件是否正确导入
- 清除浏览器缓存
- 检查 CSS 选择器优先级

### 7.4 计算结果不准确
**问题**: 浮点数精度问题

**解决**:
```javascript
// 使用 toFixed 控制精度
result.toFixed(4)
```

## 8. 性能优化

### 8.1 代码分割
Vite 自动进行代码分割，无需额外配置

### 8.2 懒加载
对于大型应用可以考虑：
```javascript
const Converter = lazy(() => import('./Converter'));
```

### 8.3 记忆化
使用 `useMemo` 和 `useCallback` 优化重渲染

### 8.4 构建优化
```bash
# 分析打包体积
pnpm build
# 查看 dist 目录大小
```

## 9. 部署指南

### 9.1 GitHub Pages

#### 安装 gh-pages
```bash
pnpm add -D gh-pages
```

#### 配置 package.json
```json
{
  "homepage": "https://用户名.github.io/calculator-ai",
  "scripts": {
    "predeploy": "pnpm build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 部署
```bash
pnpm deploy
```

### 9.2 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动部署

### 9.3 Netlify
1. 访问 [netlify.com](https://netlify.com)
2. 拖拽 dist 文件夹或连接 Git
3. 自动部署

## 10. AI 编程最佳实践

### 10.1 提示词设计

#### 好的提示词示例
```
请创建一个 React 计算器组件，要求：
1. 支持四则运算
2. 有清除功能
3. 使用 useState 管理状态
4. 样式使用紫色渐变主题
```

#### 避免的提示词
```
写个计算器
```

### 10.2 迭代开发
1. **明确需求**: 详细描述功能
2. **生成代码**: 让 AI 生成初版
3. **测试验证**: 运行并测试
4. **反馈优化**: 指出问题，要求改进
5. **重复迭代**: 直到满意

### 10.3 代码审查
- 理解 AI 生成的每一行代码
- 检查潜在的安全问题
- 验证边界情况处理
- 确保代码符合规范

### 10.4 学习要点
- 不要盲目复制代码
- 理解背后的原理
- 学会提出更好的问题
- 积累常用的提示词模板

## 11. 扩展阅读

- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [Pnpm 官方文档](https://pnpm.io/)
- [Git 教程](https://git-scm.com/book/zh/v2)
- [CSS Tricks](https://css-tricks.com/)

## 12. 总结

本文档记录了项目的开发过程、技术细节和最佳实践。通过遵循这些指南，可以快速上手开发并维护这个项目。

记住：
- 先设计，后编码
- 小步快跑，频繁提交
- 善用 AI，但要保持思考
- 持续学习，不断进步
