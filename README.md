# 胡萝啵啵的小寨



**小南梁~**

[![访问小站](https://img.shields.io/badge/访问小站-huluobuo.github.io-4A90D9?style=flat-square)](https://huluobuo.github.io)
[![构建](https://img.shields.io/badge/构建-原生三件套-FF8FAB?style=flat-square)](#技术栈)
[![样式](https://img.shields.io/badge/主题-柔光玻璃-4A90D9?style=flat-square)](#站点特色)

---

## 你好，欢迎随便逛逛

一个喜欢折腾代码的人，喜欢指使AI。
这里是胡萝啵啵的小寨 —— 有我制作的一些小东西，欢迎使用。

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