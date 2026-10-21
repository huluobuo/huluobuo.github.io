# 胡萝啵啵的小寨



**一个喜欢折腾代码的人的小寨 · 每个东西都专注做好一件事**

[![访问小站](https://img.shields.io/badge/访问小站-huluobuo.github.io-4A90D9?style=flat-square)](https://huluobuo.github.io)
[![构建](https://img.shields.io/badge/构建-原生三件套-FF8FAB?style=flat-square)](#技术栈)
[![样式](https://img.shields.io/badge/主题-柔光玻璃-4A90D9?style=flat-square)](#站点特色)

---

## 你好，欢迎随便逛逛

一个喜欢折腾代码的人：写音乐播放器、做盲文艺术字，也玩网页和本地 AI。
这里是胡萝啵啵的小寨 —— 收录了一些平时写的小工具和作品，欢迎浏览、试用，也欢迎提出建议。

## 小寨里有什么

### 🎵 [音乐播放器](https://huluobuo.github.io/music.html)

> 多源搜索 · 歌词同步 · 歌单

- 多源聚合搜索（网易云、QQ、酷我、JOOX），一处输入全站结果
- 实时同步逐行歌词、专辑封面与播放进度
- 封面玻璃背景 + 自动取色：深浅主题与主题色随封面切换，也可一键锁定
- 歌单、播放历史、下载与本地数据持久化

### ⠿ [盲文艺术字生成器](https://huluobuo.github.io/ascll.html)

> 文字转盲文点阵 · 一键复制下载

- 将任意文字渲染为盲文点阵艺术字，逐行动画浮现
- 内置多种系统字体，支持上传自定义字体文件（.ttf / .otf）
- 字号可调，实时预览，字符数与行列统计一目了然
- 结果一键复制，或下载为文本文件

### 🏠 [首页](https://huluobuo.github.io/)

> 线稿视频背景 · 背景音乐 · 成长时间线

- 白底线稿视频背景，随鼠标视差移动，下滑时高斯模糊
- 背景音乐一键开关
- 「胡萝啵啵的小寨」成长史时间线，滚动逐条浮现

## 资源下载

一些自托管的文件，点击即可下载或在线查看（清单见 [`assets/data/files.json`](assets/data/files.json)）：

| 文件 | 类型 | 大小 | 说明 |
| --- | --- | --- | --- |
| [【哲风壁纸】Kuroha作品-动漫线稿](<download/【哲风壁纸】Kuroha作品-动漫线稿.mp4>) | 视频 | 29 MB | 很好看的一个壁纸（也是本站首页背景） |
| [【Yunomi】イントロ系ならトラックメイカー【MV】](<download/1.【Yunomi】イントロ系ならトラックメイカー【MV】(Av19412189,P1).mp4>) | 视频 | 50 MB | Yunomi 的 MV（B站 av19412189） |
| [ccp](<download/ccp.mp4>) | 视频 | 12 MB | 一个视频 |
| [週末京都現実逃避](<download/週末京都現実逃避.mp3>) | 音频 | 4 MB | 一首好听的歌 |

## 站点特色

| 特色 | 说明 |
| --- | --- |
| 柔光玻璃主题 | 大半径柔光光晕 + 玻璃卡片（`backdrop-filter`），深浅两套配色 |
| 原生三件套 | 无框架无构建，纯 HTML / CSS / JavaScript |
| 统一资源 | 全站共用一份 `main.css` 与 `main.js`，按 `body.page-xxx` 作用域隔离 |
| 手绘图标 | 所有图标均为手写 SVG 线稿，风格统一 |
| 本地字体 | 山海夏日烟火体（标题）× 梦想超凝宁体（正文） |

## 技术栈

`HTML5` · `CSS3`（玻璃拟态 / Grid / 动画） · `JavaScript ES6+` · `Canvas`（盲文渲染 / 封面取色） · `Web Storage`（本地持久化）

## 成长史

<details>
<summary><b>点开查看小寨的成长时间线</b></summary>

- **2019 年末** —— 由于疫情开始学习电脑并使用电脑上网课
- **2020 年初** —— 接触了[编程猫社区](https://shequ.codemao.cn)
- **2021 年** —— 开始学习 Python 编程
- **2022 年** —— 开始学习 HTML 网页制作
- **2023 年** —— 由于学业停止学习
- **2024 年 10 月 17 日** —— 注册了 GitHub 账户，正式开始做项目
- **2025 年 2 月 28 日** —— 上传了第一个正式项目 MyOs（Python 终端操作系统）
- **2025 年 7 月** —— 音乐、个人介绍、钟表（Python + turtle）、简易计算器，加入[盒子IM](https://www.boximchat.com)
- **2025 年 8 月** —— 开始正式学习编程，创建学习资料仓库
- **2025 年 9-10 月** —— 专注 Web 开发并制作社区网站，初步研究网络安全并完成安全更新
- **2025 年 11 月** —— 研究人工智能，做了一个不太成熟的人脸识别（后因精力不足作废）
- **2025 年 12 月** —— 重构 10 月之前的老项目，使其更加现代
- **2026 年 1-3 月** —— 常用工具集、小日历、由 Ollama 驱动的本地 AI 编程 IDE
- **2026 年 7 月** —— 盒子IM CSS 美化脚本、两个盒子IM机器人、盒子IM客户端，重新设计个人网站
- **2026 年 10 月** —— 无法登录 GitHub 的风波解决，重新设计了这个个人网站

</details>

## 本地运行

纯静态站点，无需安装依赖：

```bash
git clone https://github.com/huluobuo/huluobuo.github.io.git
```

直接用浏览器打开 `index.html` 即可；也可以起一个本地服务：

```bash
python -m http.server 8080
# 访问 http://localhost:8080
```

## 目录结构

```text
huluobuo.github.io
├── index.html            # 首页（视频背景 + 时间线）
├── music.html            # 音乐播放器
├── ascll.html            # 盲文艺术字生成器
├── README.md
├── download/             # 自托管的可下载资源
└── assets
    ├── css/main.css      # 全站统一样式（柔光玻璃主题）
    ├── js/main.js        # 全站统一脚本
    ├── fonts/            # 山海夏日烟火体 / 梦想超凝宁体
    ├── images/           # 默认封面等图片资源
    ├── data/files.json   # 下载资源清单
    └── media/            # 背景视频 / 背景音乐
```


### 未来规划

- [ ] 添加midi制作工具
- [ ] 添加下载文件功能
- [ ] 记录生活，保存到我的时间线



---

**2026 (c) 胡萝啵啵**

小寨常新，欢迎常来逛逛 · [回到首页](https://huluobuo.github.io)