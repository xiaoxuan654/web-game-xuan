<p align="center">
  <img src="./assets/previews/logo.png" alt="Web Game Collection" width="200"/>
</p>

<div align="center">

# Web Game Collection

🎮 一个优雅而现代的网页游戏合集平台 | A Modern Web Game Collection Platform

[![GitHub stars](https://img.shields.io/github/stars/xiaoxuan654/web-game-xuan)](https://github.com/xiaoxuan654/web-game-xuan/stargazers)
[![GitHub license](https://img.shields.io/github/license/xiaoxuan654/web-game-xuan)](https://github.com/xiaoxuan654/web-game-xuan/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/xiaoxuan654/web-game-xuan)](https://github.com/xiaoxuan654/web-game-xuan/issues)
[![GitHub forks](https://img.shields.io/github/forks/xiaoxuan654/web-game-xuan)](https://github.com/xiaoxuan654/web-game-xuan/network)
[![GitHub release](https://img.shields.io/github/v/release/xiaoxuan654/web-game-xuan)](https://github.com/xiaoxuan654/web-game-xuan/releases)

[在线预览](https://xiaoxuan654.github.io/web-game-xuan) | [English](./README_EN.md) | [反馈问题](https://github.com/xiaoxuan654/web-game-xuan/issues)

</div>

## 📖 简介

Web Game Collection 是一个使用纯原生技术栈开发的现代化游戏集合平台，提供流畅的游戏体验和精致的视觉效果。支持多主题切换、响应式布局、触控优化等特性。

## 🚀 特性

- 🎮 优雅的游戏卡片展示
- 🌓 明暗主题切换
- 📱 完美的移动端适配
- 🎯 流畅的过渡动画
- 🖼️ 智能图片加载优化
- 🔄 平滑的状态切换
- 💫 精美的视觉效果
- 🔒 可靠的错误处理

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/xiaoxuan654/web-game-xuan.git

# 进入项目目录
cd web-game-xuan

# 启动开发服务器
python -m http.server 8080
# 或
npx http-server
```

## 🎮 使用方法

访问 `http://localhost:8080` 即可开始体验：

1. 点击游戏卡片进入对应游戏
2. 使用主题切换按钮更改外观
3. 支持触控和键盘操作

## 📦 项目结构

```
web-game-xuan/
├── assets/
│   └── previews/         # 游戏预览图
│       ├── game1/
│       ├── game2/
│       └── placeholder.svg
├── data/
│   ├── games.json        # 游戏配置
│   └── games/           # 游戏源码
│       ├── game1/
│       └── game2/
├── styles.css           # 全局样式
├── main.js             # 主逻辑
└── index.html          # 入口文件
```

## 🔧 开发指南

### 环境要求

- 现代浏览器支持
- 本地开发服务器

### 安装和运行

1. 克隆仓库
```bash
git clone https://github.com/xiaoxuan654/web-game-xuan.git
cd web-game-xuan
```

2. 启动本地服务器
```bash
# 使用 Python 的简单 HTTP 服务器
python -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server
```

3. 访问 `http://localhost:8080`

## 🎮 添加新游戏

1. 在 `data/games/` 创建新游戏目录
2. 添加游戏预览图到 `assets/previews/`
3. 更新 `data/games.json` 配置

```json
{
  "games": [
    {
      "id": "your-game-id",
      "name": "游戏名称",
      "description": "游戏描述",
      "path": "/data/games/your-game-id/index.html",
      "preview": "./assets/previews/your-game-id/cover.jpg",
      "backgroundColor": "#F7F2ED"
    }
  ]
}
```

## 📱 移动端支持

- 触摸优化
- 响应式布局
- 性能优化
- 手势支持

## 🎨 主题定制

通过修改 CSS 变量轻松自定义主题：

```css
:root[data-theme="light"] {
    --bg-primary: #fcf9f6;
    --color-primary: #33292E;
    /* ...其他变量... */
}
```

## 🤝 贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/xiaoxuan654/web-game-xuan/issues/new) 或者提交一个 Pull Request。

## 🌟 Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=xiaoxuan654/web-game-xuan&type=Date)](https://star-history.com/#xiaoxuan654/web-game-xuan&Date)

## 📄 开源协议

该项目签署了 MIT 授权许可，详情请参阅 [LICENSE](LICENSE)

## 👏 鸣谢

- [Font Awesome](https://fontawesome.com/)
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)

---

> GitHub [@xiaoxuan654](https://github.com/xiaoxuan654) · Telegram [@xiaoxuan_654](https://t.me/xiaoxuan_654)
