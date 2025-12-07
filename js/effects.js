// 图片加载优化和滚动特效脚本

// 图片加载器
class ImageLoader {
    constructor() {
        this.backgroundImage = new Image();
        this.highQualityImage = new Image();
        this.loadingElement = document.getElementById('backgroundLoader');
        this.isLoaded = false;
    }

    async loadImages() {
        return new Promise((resolve) => {
            // 先加载普通背景图
            this.backgroundImage.src = '../img/背景.png';
            
            this.backgroundImage.onload = () => {
                console.log('普通背景图加载完成');
                
                // 延迟加载高清背景图
                setTimeout(() => {
                    this.highQualityImage.src = '../img/高清背景.PNG';
                    
                    this.highQualityImage.onload = () => {
                        console.log('高清背景图加载完成');
                        this.applyBackground();
                        this.hideLoader();
                        resolve();
                    };
                    
                    this.highQualityImage.onerror = () => {
                        console.log('高清背景图加载失败，使用普通背景图');
                        this.applyBackground();
                        this.hideLoader();
                        resolve();
                    };
                }, 500);
            };
            
            this.backgroundImage.onerror = () => {
                console.log('普通背景图加载失败，使用默认背景');
                this.hideLoader();
                resolve();
            };
        });
    }

    applyBackground() {
        document.body.style.background = `url('${this.highQualityImage.src || this.backgroundImage.src}') center/cover no-repeat fixed`;
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
        this.init();
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
            // 加载项目数量（从GitHub API）
            await this.loadGitHubStats();
            
            // 加载音乐文件数量
            await this.loadMusicCount();
            
            // 加载文件数量
            await this.loadFileCount();
            
        } catch (error) {
            console.warn('统计数据加载失败:', error);
            this.handleDataLoadError();
        }
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
            console.warn('GitHub统计数据加载失败，使用默认值');
            this.stats.projects = 17; // 默认值
            this.stats.followers = 0;
        }
    }

    async loadMusicCount() {
        try {
            const response = await fetch('./musiclist.json');
            if (response.ok) {
                const data = await response.json();
                this.stats.music = Array.isArray(data) ? data.length : 0;
            } else {
                throw new Error('音乐列表加载失败');
            }
        } catch (error) {
            console.warn('音乐数量加载失败，使用默认值');
            this.stats.music = 70; // 默认值
        }
    }

    async loadFileCount() {
        try {
            const response = await fetch('./filelist.json');
            if (response.ok) {
                const data = await response.json();
                this.stats.files = Array.isArray(data) ? data.length : 0;
            } else {
                throw new Error('文件列表加载失败');
            }
        } catch (error) {
            console.warn('文件数量加载失败，使用默认值');
            this.stats.files = 3; // 默认值
        }
    }

    async loadGitHubRepos() {
        try {
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
        
        if (musicStats) musicStats.textContent = `${this.stats.music} 首歌曲`;
        if (fileStats) fileStats.textContent = `${this.stats.files} 个文件`;
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
            followers: '个'
        };
        return units[type] || '';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('页面加载完成，开始初始化特效...');
    
    // 初始化图片加载器
    const imageLoader = new ImageLoader();
    await imageLoader.loadImages();
    
    // 初始化数据管理器
    const dataManager = new DataManager();
    await dataManager.init();
    
    // 初始化滚动效果控制器
    const scrollController = new ScrollEffectController();
    scrollController.init();
    
    // 初始化视差效果
    const parallaxEffect = new ParallaxEffect();
    
    // 添加鼠标移动效果
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.querySelectorAll('.repo-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;
            
            const distanceX = (e.clientX - cardX) / window.innerWidth;
            const distanceY = (e.clientY - cardY) / window.innerHeight;
            
            card.style.transform = `perspective(1000px) rotateY(${distanceX * 5}deg) rotateX(${-distanceY * 5}deg)`;
        });
    });
    
    console.log('特效初始化完成！');
});

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