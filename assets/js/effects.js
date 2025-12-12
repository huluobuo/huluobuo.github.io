/*
 * huluobuo个人网站特效脚本
 * 主要包含以下功能模块：
 * - 图片加载器 (ImageLoader)
 * - 滚动效果控制器 (ScrollEffectController)
 * - 视差滚动效果 (ParallaxEffect)
 * - 数据自动获取与展示管理器 (DataManager)
 */

/**
 * 图片加载器类
 * 负责背景图片的异步加载和应用
 */
class ImageLoader {
    /**
     * 构造函数
     * @param {string} backgroundUrl - 背景图片的URL，默认为null
     */
    constructor(backgroundUrl = null) {
        this.backgroundImage = new Image();
        this.loadingElement = document.getElementById('backgroundLoader');
        this.isLoaded = false;
        this.backgroundUrl = backgroundUrl;
    }

    async loadImages() {
        return new Promise((resolve) => {
            // 如果没有提供背景图片URL，则直接隐藏加载器
            if (!this.backgroundUrl) {
                this.hideLoader();
                resolve();
                return;
            }
            
            this.backgroundImage.src = this.backgroundUrl;
            
            this.backgroundImage.onload = () => {
                console.log('背景图加载完成');
                this.applyBackground();
                this.hideLoader();
                resolve();
            };
            
            this.backgroundImage.onerror = () => {
                console.log('背景图加载失败，不使用背景图');
                this.hideLoader();
                resolve();
            };
        });
    }

    applyBackground() {
        document.body.style.background = `url('${this.backgroundImage.src}') center/cover no-repeat fixed`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    hideLoader() {
        this.loadingElement.classList.add('hidden');
        setTimeout(() => {
            this.loadingElement.style.display = 'none';
        }, 500);
    }
}

// 滚动效果控制器
class ScrollEffectController {
    constructor() {
        this.scrollContainer = document.querySelector('.scroll-text-container');
        this.githubContainer = document.querySelector('.github-container');
        this.hasScrolled = false;
        this.scrollThreshold = 100; // 滚动阈值
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // 鼠标滚轮事件
        window.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });
        
        // 触摸滑动事件
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        
        // 键盘事件
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // 点击事件（用于跳过动画）
        window.addEventListener('click', this.handleClick.bind(this));
    }

    handleScroll(event) {
        if (this.hasScrolled) return;
        
        event.preventDefault();
        
        const delta = Math.sign(event.deltaY);
        if (delta > 0) {
            this.triggerScrollAnimation();
        }
    }

    handleTouchMove(event) {
        if (this.hasScrolled) return;
        
        const touch = event.touches[0];
        if (!this.startY) {
            this.startY = touch.clientY;
            return;
        }
        
        const deltaY = this.startY - touch.clientY;
        
        if (deltaY > 50) { // 向下滑动超过50px
            this.triggerScrollAnimation();
            this.startY = null;
        }
    }

    handleKeyDown(event) {
        if (this.hasScrolled) return;
        
        if (event.key === 'ArrowDown' || event.key === ' ' || event.key === 'PageDown') {
            event.preventDefault();
            this.triggerScrollAnimation();
        }
    }

    handleClick() {
        if (!this.hasScrolled) {
            this.triggerScrollAnimation();
        }
    }

    triggerScrollAnimation() {
        if (this.hasScrolled) return;
        
        this.hasScrolled = true;
        
        // 添加滚动类名触发动画
        this.scrollContainer.classList.add('scrolled');
        this.githubContainer.classList.add('visible');
        
        // 移除初始事件监听器
        window.removeEventListener('wheel', this.handleScroll);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('click', this.handleClick);
        
        // 添加滚动监听器
        window.addEventListener('scroll', this.handlePageScroll.bind(this));
        
        // 允许页面正常滚动
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }, 800);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('.repo-card, .stat, .profile-avatar');
        animatedElements.forEach(el => observer.observe(el));
    }

    handlePageScroll() {
        const scrollY = window.scrollY;
        const elements = document.querySelectorAll('.repo-card, .stat');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            
            if (scrollY > elementTop - window.innerHeight * 0.8) {
                element.style.transform = `translateY(${Math.max(0, (elementTop - scrollY - window.innerHeight * 0.8) * 0.1)}px)`;
            }
        });
    }
}

// 视差滚动效果
class ParallaxEffect {
    constructor() {
        this.sections = document.querySelectorAll('.github-header, .github-main');
        // 只有在找到相关元素时才初始化
        if (this.sections.length > 0) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        this.sections.forEach((section, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            section.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// 数据自动获取与展示管理器
class DataManager {
    constructor() {
        this.stats = {
            projects: 0,
            music: 0,
            files: 0,
            images: 0,
            followers: 0
        };
        this.githubRepos = [];
    }

    async init() {
        await this.loadStatsData();
        await this.loadGitHubRepos();
        this.updateUI();
    }

    async loadStatsData() {
        try {
            // 设置加载状态
            this.showLoadingState();
            
            // 并行加载所有数据
            await Promise.all([
                this.loadGitHubStats(),
                this.loadMusicCount(),
                this.loadFileCount(),
                this.loadImageCount()
            ]);
            
        } catch (error) {
            console.warn('统计数据加载失败:', error);
            this.handleDataLoadError();
        } finally {
            // 确保隐藏加载状态
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        // 显示加载状态
        const loadingElements = document.querySelectorAll('.stat-number, .repo-stats');
        loadingElements.forEach(el => {
            el.textContent = '加载中...';
        });
    }

    hideLoadingState() {
        // 确保UI更新
        this.updateUI();
    }

    async loadGitHubStats() {
        try {
            const response = await fetch('https://api.github.com/users/huluobuo');
            if (response.ok) {
                const data = await response.json();
                this.stats.projects = data.public_repos || 0;
                this.stats.followers = data.followers || 0;
            } else {
                throw new Error('GitHub API请求失败');
            }
        } catch (error) {
            console.warn('GitHub统计数据加载失败');
            this.stats.projects = 0;
            this.stats.followers = 0;
        }
        // 确保UI更新
        this.updateUI();
    }

    async loadMusicCount() {
        try {
            const response = await fetch('./api/musiclist.json');
            if (response.ok) {
                const data = await response.json();
                this.stats.music = Array.isArray(data) ? data.length : 0;
            } else {
                throw new Error('音乐列表加载失败');
            }
        } catch (error) {
            console.warn('音乐数量加载失败');
            this.stats.music = 0;
        }
    }

    async loadFileCount() {
        try {
            const response = await fetch('./api/filelist.json');
            if (response.ok) {
                const data = await response.json();
                this.stats.files = Array.isArray(data) ? data.length : 0;
            } else {
                throw new Error('文件列表加载失败');
            }
        } catch (error) {
            console.warn('文件数量加载失败');
            this.stats.files = 0;
        }
    }

    async loadImageCount() {
        try {
            const response = await fetch('./api/imagelist.json');
            if (response.ok) {
                const data = await response.json();
                this.stats.images = Array.isArray(data) ? data.length : 0;
            } else {
                throw new Error('图片列表加载失败');
            }
        } catch (error) {
            console.warn('图片数量加载失败');
            this.stats.images = 0;
        }
    }

    async loadGitHubRepos() {
        try {
            // 显示加载状态
            const reposList = document.getElementById('reposList');
            if (reposList) {
                reposList.innerHTML = '<div style="text-align: center; padding: 20px;">加载中...</div>';
            }
            
            const response = await fetch('https://api.github.com/users/huluobuo/repos?sort=updated&per_page=6');
            if (response.ok) {
                this.githubRepos = await response.json();
                this.updateGitHubReposUI();
            } else {
                throw new Error('GitHub仓库API请求失败');
            }
        } catch (error) {
            console.warn('GitHub仓库加载失败:', error);
            this.hideGitHubReposSection();
        }
    }

    updateUI() {
        // 更新统计数据
        Object.keys(this.stats).forEach(type => {
            const statElement = document.querySelector(`.stat[data-type="${type}"]`);
            if (statElement) {
                const numberElement = statElement.querySelector('.stat-number');
                if (numberElement) {
                    numberElement.textContent = `${this.stats[type]} ${this.getUnit(type)}`;
                }
            }
        });

        // 更新卡片统计数据
        const musicStats = document.querySelector('.repo-card[href="./music.html"] .repo-stats');
        const fileStats = document.querySelector('.repo-card[href="./file.html"] .repo-stats');
        const imageStats = document.querySelector('.repo-card[href="./images.html"] .repo-stats');
        
        if (musicStats) musicStats.textContent = `${this.stats.music} 首歌曲`;
        if (fileStats) fileStats.textContent = `${this.stats.files} 个文件`;
        if (imageStats) imageStats.textContent = `${this.stats.images} 张图片`;
    }

    updateGitHubReposUI() {
        const reposList = document.getElementById('reposList');
        const badge = document.querySelector('#githubReposSection .repo-badge');
        
        if (!reposList) return;

        if (this.githubRepos.length === 0) {
            this.hideGitHubReposSection();
            return;
        }

        // 更新徽章
        if (badge) {
            badge.textContent = `${this.githubRepos.length} repos`;
        }

        // 生成仓库列表
        reposList.innerHTML = this.githubRepos.map(repo => `
            <div class="repo-item">
                <div class="repo-item-header">
                    <h4 class="repo-item-title">
                        <a href="${repo.html_url}" target="_blank" class="repo-item-link">
                            ${repo.name}
                        </a>
                    </h4>
                    <span class="repo-item-badge ${repo.private ? 'private' : 'public'}">
                        ${repo.private ? 'Private' : 'Public'}
                    </span>
                </div>
                <p class="repo-item-description">${repo.description || '暂无描述'}</p>
                <div class="repo-item-meta">
                    <span class="repo-item-language">${repo.language || 'Text'}</span>
                    <span class="repo-item-stars">⭐ ${repo.stargazers_count}</span>
                    <span class="repo-item-forks">🔀 ${repo.forks_count}</span>
                </div>
            </div>
        `).join('');
    }

    hideGitHubReposSection() {
        const section = document.getElementById('githubReposSection');
        if (section) {
            section.style.display = 'none';
            // 重新布局其他卡片
            this.adjustLayout();
        }
    }

    handleDataLoadError() {
        // 隐藏失败的统计项
        Object.keys(this.stats).forEach(type => {
            if (this.stats[type] === 0) {
                const statElement = document.querySelector(`.stat[data-type="${type}"]`);
                if (statElement) {
                    statElement.style.display = 'none';
                }
            }
        });
        
        // 重新布局统计区域
        this.adjustLayout();
    }

    adjustLayout() {
        // 统计区域自适应布局
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const visibleStats = statsSection.querySelectorAll('.stat:not([style*="display: none"])');
            if (visibleStats.length === 0) {
                statsSection.style.display = 'none';
            }
        }
    }

    getUnit(type) {
        const units = {
            projects: '个',
            music: '首',
            files: '个',
            images: '张',
            followers: '个'
        };
        return units[type] || '';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('页面加载完成，开始初始化特效...');
    
    // 根据当前页面路径决定是否加载背景图片
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // 只有在首页加载背景图片，其他页面根据需要通过外部调用
    let backgroundUrl = null;
    if (pageName === 'index.html') {
        backgroundUrl = './img/背景.png';
    }
    
    // 初始化图片加载器
    const imageLoader = new ImageLoader(backgroundUrl);
    await imageLoader.loadImages();
    
    // 初始化数据管理器
    const dataManager = new DataManager();
    await dataManager.init();
    
    // 初始化滚动效果控制器
    // 只有在首页初始化滚动效果控制器
    if (pageName === 'index.html') {
        const scrollController = new ScrollEffectController();
        scrollController.init();
    }
    
    // 初始化视差效果
    // 只有在首页初始化视差效果，避免影响其他页面
    if (pageName === 'index.html') {
        const parallaxEffect = new ParallaxEffect();
    }
    
    // 添加鼠标移动效果 - 只有在有repo-card元素时才添加
    const repoCards = document.querySelectorAll('.repo-card');
    if (repoCards.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            repoCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardX = rect.left + rect.width / 2;
                const cardY = rect.top + rect.height / 2;
                
                const distanceX = (e.clientX - cardX) / window.innerWidth;
                const distanceY = (e.clientY - cardY) / window.innerHeight;
                
                card.style.transform = `perspective(1000px) rotateY(${distanceX * 5}deg) rotateX(${-distanceY * 5}deg)`;
            });
        });
    }
    
    console.log('特效初始化完成！');
});

// 暴露ImageLoader类到全局，方便其他页面调用
window.ImageLoader = ImageLoader;

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .repo-card {
        transition: all 0.3s ease;
    }
    
    .github-header, .github-main {
        transition: transform 0.1s ease-out;
    }
`;

document.head.appendChild(style);