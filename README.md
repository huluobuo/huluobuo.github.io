# 个人网站

这是我的个人网站，主要用于分享音乐、文件、图片和其他内容。
目前有3个文件，142首歌，184张图片。
文件来源： [bing](https://www.bing.com)
音频来源： [爱听音乐](https://www.2t58.com/)
图片来源： 乱七八糟，比如一些群里的图片，或者一些自己收集的图片

## 功能特性

- 🎵 **音乐库**：在线播放和下载音乐文件（142首歌曲）
- 📁 **文件库**：分享各类文件供下载（3个文件）
- 🖼️ **图片库**：浏览和下载图片资源（184张图片）
- 📱 **响应式设计**：适配不同设备屏幕尺寸
- 🎨 **现代化UI**：简洁美观的界面设计

## 项目结构

```
huluobuo.github.io/
├── api/                  # API数据文件
│   ├── filelist.json     # 文件列表数据
│   ├── imagelist.json    # 图片列表数据
│   └── musiclist.json    # 音乐列表数据
├── assets/               # 静态资源
│   ├── css/              # 样式文件
│   └── js/               # JavaScript文件
├── files/                # 文件存储目录（3个文件）
├── images/               # 图片存储目录（184张图片）
├── img/                  # 网站图片资源
│   ├── github_logo.png   # GitHub图标
│   ├── 头像.png          # 头像图片
│   └── 背景.png          # 背景图片
├── musics/               # 音乐文件存储目录（142首歌曲）
├── tools/                # 工具脚本
│   ├── get_filelist.py   # 生成文件列表的Python脚本
│   ├── get_imagelist.py  # 生成图片列表的Python脚本
│   └── get_musiclist.py  # 生成音乐列表的Python脚本
├── .gitignore            # Git忽略文件
├── README.md             # 项目说明文档
├── index.html            # 首页
├── music.html            # 音乐库页面
├── file.html             # 文件库页面
└── images.html           # 图片库页面
```

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **部署**：GitHub Pages
- **工具**：Python（生成音乐列表）

## 本地运行

1. 克隆仓库到本地
2. 在浏览器中打开 `index.html` 文件
3. 或使用本地HTTP服务器：
   ```bash
   python -m http.server 8000
   # 然后访问 http://localhost:8000
   ```

## 已完成功能

- ✅ **照片库**：已实现图片库功能，支持浏览和下载图片
- ✅ **音乐库**：142首歌曲在线播放和下载
- ✅ **文件库**：3个文件供下载
- ✅ **响应式设计**：适配不同设备屏幕

## 未来计划

- 支持歌词显示
- 添加搜索功能
- 优化图片浏览体验
- 增加更多文件类型支持

### PS

- 所有文件、音频均为个人分享，不用于任何商业用途。
- 如果有其他文件或音乐需要分享，请联系我。
- 如果你有其他建议的话，也欢迎联系我。
- 联系方式： 邮箱：[hu_luo_buo@outlook.com](mailto:hu_luo_buo@outlook.com)

## License

[MIT License](./LICENSE)
