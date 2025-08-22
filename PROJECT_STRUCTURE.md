# 项目结构与功能说明

本文档详细介绍 `huluobuo.github.io` 项目的结构和每个部分的功能。

## 项目结构
```
├── .gitignore
├── PROJECT_STRUCTURE.md
├── README.md
├── css/
│   ├── styles.css
│   └── styles.min.css
├── favicon.ico
├── files/
│   ├── Donald-Trump.zip
│   ├── Never Gonna Give You Up.zip
│   ├── download.html
│   ├── fastgithub_win-x64.zip
│   ├── filelist.json
│   └── index.html
├── img/
│   └── github_logo.png
├── index.html
├── js/
│   └── animations.js
├── music/
│   ├── Counter Attack-Mankind (Sasha Version) (Sasha Version)-Samuel Kim.mp3
│   ├── Die For You-The Weeknd.mp3
│   ├── Eutopia-Yoohsic Roomz.mp3
│   ├── I Like U Like-时代少年团.mp3
│   ├── Say When-Selina Mour.mp3
│   ├── Stitches-Shawn Mendes.mp3
│   ├── Way Back-Cozi Zuehlsdorff,Vicetone.mp3
│   ├── collapsing world-Lightscape.mp3
│   ├── get_musiclist.py
│   ├── index.html
│   ├── musiclist.json
│   ├── 两 难-加木.mp3
│   ├── 小孩-罗森涛.mp3
│   ├── 忏悔录-KKECHO.mp3
│   ├── 念念相忘 LIVE-卡捷琳娜（Katya）.mp3
│   ├── 悬溺-葛东琪.mp3
│   ├── 把回忆拼好给你-王贰浪.mp3
│   ├── 无赖-h3R3.mp3
│   ├── 最好的我-刘大拿.mp3
│   ├── 有趣-单依纯.mp3
│   ├── 罗生门（Follow）-梨冻紧,Wiz_H张子豪.mp3
│   ├── 芯房-CJ 周密.mp3
│   └── 莫愁乡-亞細亞曠世奇才.mp3
└── package.json
```

## 各结构功能说明
### `css/` 目录
该目录用于存放项目的 CSS 样式文件，用于定义网页的视觉样式：
- `styles.css`：完整的样式文件，便于开发和调试。
- `styles.min.css`：压缩后的样式文件，用于优化网页加载速度。

### `files/` 目录
该目录主要用于存放可下载的文件和相关配置，具体内容如下：
- `Donald-Trump.zip`：与 Donald Trump 相关的压缩文件。
- `Never Gonna Give You Up.zip`：包含歌曲《Never Gonna Give You Up》的压缩文件。
- `download.html`：下载页面，用于展示可下载资源。
- `fastgithub_win-x64.zip`：Windows 64 位系统下的 fastgithub 工具压缩包。
- `filelist.json`：文件列表配置文件，用于管理 `files` 目录下的文件信息。
- `index.html`：`files` 目录的索引页面。

### `img/` 目录
该目录用于存放项目所需的图片资源：
- `github_logo.png`：GitHub 标志图片，用于项目中的链接或标识。

### `js/` 目录
该目录用于存放项目的 JavaScript 文件，用于实现网页的交互功能：
- `animations.js`：包含网页动画效果的实现代码。

### `music/` 目录
此目录专门存放音乐文件和相关配置：
- 多个 MP3 文件：包含各种风格的音乐，如流行音乐、电子音乐等。
- `get_musiclist.py`：用于生成或更新音乐列表的 Python 脚本。
- `index.html`：`music` 目录的索引页面，用于展示音乐列表。
- `musiclist.json`：音乐列表配置文件，用于管理音乐文件信息。

### 根目录文件
- `.gitignore`：Git 忽略文件，指定不需要纳入版本控制的文件和目录。
- `PROJECT_STRUCTURE.md`：项目结构说明文档，介绍项目的结构和各部分功能。
- `README.md`：项目的说明文档，介绍项目基本信息和使用方法。
- `index.html`：项目主页面，是用户访问项目的入口。
- `package.json`：项目的包配置文件，可能包含项目的依赖信息和脚本。
- `favicon.ico`：网站图标，会显示在浏览器标签页上。