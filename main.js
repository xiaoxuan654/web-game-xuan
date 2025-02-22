// 浏览器特性检测
const browserSupport = {
    webp: false,
    webgl: false,
    transform3d: false,
    touchEvents: false
};

function checkBrowserSupport() {
    // 检查 WebP 支持
    const webp = new Image();
    webp.onload = function() { browserSupport.webp = (webp.width > 0) && (webp.height > 0); };
    webp.onerror = function() { browserSupport.webp = false; };
    webp.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';

    // 检查 WebGL 支持
    try {
        const canvas = document.createElement('canvas');
        browserSupport.webgl = !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
        browserSupport.webgl = false;
    }

    // 检查 3D 转换支持
    browserSupport.transform3d = (function() {
        const el = document.createElement('div');
        const transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
        };

        document.body.insertBefore(el, null);
        for (const t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = 'translate3d(1px,1px,1px)';
                const has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                document.body.removeChild(el);
                return has3d !== undefined && has3d.length > 0 && has3d !== "none";
            }
        }
        return false;
    })();

    // 检查触摸事件支持
    browserSupport.touchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// 根据浏览器支持情况调整功能
function adjustFeatures() {
    if (!browserSupport.transform3d) {
        // 禁用 3D 效果，使用降级动画
        document.documentElement.classList.add('no-3d');
    }

    // Safari 特定修复
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        document.documentElement.classList.add('is-safari');
    }

    // iOS Safari 修复
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        document.documentElement.classList.add('is-ios');
    }
}

// 事件兼容性处理
function addEventListenerWithFallback(element, event, callback) {
    if (element.addEventListener) {
        element.addEventListener(event, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, callback);
    } else {
        element['on' + event] = callback;
    }
}

// Polyfill requestAnimationFrame
(function() {
    let lastTime = 0;
    const vendors = ['webkit', 'moz', 'ms', 'o'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// 主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // 检查本地存储的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 添加切换动画
        document.body.style.opacity = '0.5';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// 检测设备类型
const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

// 优化视差效果
function initParallax() {
    if (isTouchDevice()) {
        // 在触摸设备上使用设备方向作为视差来源
        window.addEventListener('deviceorientation', (e) => {
            const cards = document.querySelectorAll('.game-card');
            const tiltX = Math.min(Math.max(e.beta, -45), 45) / 45;
            const tiltY = Math.min(Math.max(e.gamma, -45), 45) / 45;

            cards.forEach(card => {
                card.style.transform = `perspective(1000px) rotateX(${tiltX * 10}deg) rotateY(${tiltY * 10}deg)`;
            });
        }, true);
    } else {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.game-card');
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                
                const angleX = (cardCenterY - e.clientY) / 30;
                const angleY = (e.clientX - cardCenterX) / 30;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });
        });
    }
}

// 优化触摸事件处理
function initTouchInteractions() {
    if (isTouchDevice()) {
        const cards = document.querySelectorAll('.game-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', () => {
                card.style.transform = 'scale(1)';
            });
        });
    }
}

async function loadGames() {
    try {
        const response = await fetch('/data/games.json');
        const data = await response.json();
        const gameList = document.getElementById('gameList');
        
        data.games.forEach((game, index) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.style.setProperty('--i', index);
            gameCard.innerHTML = `
                <div class="game-preview" style="background-color: ${game.backgroundColor || '#f6f3ff'}">
                    <img src="${game.preview}" alt="${game.name}" loading="lazy">
                    <div class="game-overlay">
                        <div class="play-button"></div>
                    </div>
                </div>
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                </div>
            `;
            
            // 添加平滑过渡效果
            gameCard.onclick = (e) => {
                e.preventDefault();
                gameCard.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    window.location.href = game.path;
                }, 200);
            };

            gameCard.addEventListener('mouseleave', () => {
                gameCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
            
            // 设置路径数据
            gameCard.dataset.path = game.path;
            
            gameList.appendChild(gameCard);
        });

        // 初始化卡片交互
        initCardInteractions();

        // 移除加载动画
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.remove();
            }, 500);
        }

        // 添加错误处理和重试机制
        const maxRetries = 3;
        let retries = 0;
        
        while (retries < maxRetries) {
            try {
                const response = await fetch('/data/games.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                // ...process data...
                break;
            } catch (err) {
                retries++;
                if (retries === maxRetries) throw err;
                await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
        }
        
        // 优化图片加载
        const images = document.querySelectorAll('.game-preview img');
        images.forEach(img => {
            img.onerror = () => {
                img.src = 'fallback-image.png';
            };
        });
        
    } catch (error) {
        console.error('加载失败:', error);
        // 显示用户友好的错误信息
        const gameList = document.getElementById('gameList');
        gameList.innerHTML = `
            <div class="error-message">
                加载失败，请稍后重试
                <button onclick="location.reload()">重新加载</button>
            </div>
        `;
    }
}

// 优化移动端触摸交互
function initMobileInteractions() {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach(card => {
        let touchStartX, touchStartY, touchStartTime;
        let rippleElement = null;
        
        // 添加触摸反馈效果
        function createRipple(e) {
            const rect = card.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            rippleElement = document.createElement('div');
            rippleElement.className = 'touch-feedback';
            rippleElement.style.left = `${x}px`;
            rippleElement.style.top = `${y}px`;
            
            card.appendChild(rippleElement);
            
            // 动画结束后移除元素
            rippleElement.addEventListener('animationend', () => {
                rippleElement && rippleElement.remove();
                rippleElement = null;
            });
        }

        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            
            createRipple(e);
            
            // 添加按压效果
            card.style.transform = 'scale(0.96)';
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            const deltaX = e.touches[0].clientX - touchStartX;
            const deltaY = e.touches[0].clientY - touchStartY;
            
            // 判断是否为滚动意图
            if (Math.abs(deltaY) > 10) {
                card.style.transform = 'none';
                rippleElement && rippleElement.remove();
            }
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            // 恢复原始状态
            card.style.transform = 'none';
            
            // 判断是否为有效点击
            if (touchDuration < 300) {
                const deltaX = e.changedTouches[0].clientX - touchStartX;
                const deltaY = e.changedTouches[0].clientY - touchStartY;
                
                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                    handleCardClick(card);
                }
            }
        });

        // 处理触摸取消
        card.addEventListener('touchcancel', () => {
            card.style.transform = 'none';
            rippleElement && rippleElement.remove();
        });
    });
}

// 优化卡片点击处理
function handleCardClick(card) {
    // 添加过渡动画
    requestAnimationFrame(() => {
        navigateToGame(card);
    });
}

// 优化滚动性能
function optimizeScroll() {
    let isScrolling;
    const cards = document.querySelectorAll('.game-card');
    
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        
        requestAnimationFrame(() => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const isVisible = (
                    rect.top <= window.innerHeight &&
                    rect.bottom >= 0
                );
                
                if (isVisible) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        });
        
        isScrolling = setTimeout(() => {
            // 滚动结束后的清理工作
        }, 66);
    }, { passive: true });
}

// 优化移动端触摸处理
function initMobileInteractions() {
    const cards = document.querySelectorAll('.game-card');
    let tapTimeout;
    
    cards.forEach(card => {
        let startX, startY, startTime;
        
        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            
            // 立即显示按下状态
            card.style.transform = 'scale(0.97)';
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            // 如果用户开始滚动，取消按下状态
            if (Math.abs(deltaY) > 10 || Math.abs(deltaX) > 10) {
                card.style.transform = 'none';
            }
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            const deltaTime = Date.now() - startTime;
            const deltaX = e.changedTouches[0].clientX - startX;
            const deltaY = e.changedTouches[0].clientY - startY;
            
            // 恢复原始状态
            card.style.transform = 'none';
            
            // 只有在快速点击且移动距离小的情况下才触发
            if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                clearTimeout(tapTimeout);
                tapTimeout = setTimeout(() => {
                    navigateToGame(card);
                }, 50);
            }
        });
    });

    // 防止iOS的双击缩放
    let lastTapTime = 0;
    document.addEventListener('touchend', (e) => {
        const currentTime = Date.now();
        const tapLength = currentTime - lastTapTime;
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
        }
        lastTapTime = currentTime;
    });
}

// 优化游戏导航
function navigateToGame(card) {
    const gameName = card.querySelector('h3').textContent;
    const gamePath = card.dataset.path;
    
    // 记录导航状态
    sessionStorage.setItem('gameNavigating', 'true');
    
    const transition = createTransitionElement(gameName);

    // 触觉反馈
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }

    // 显示过渡动画
    requestAnimationFrame(() => {
        transition.classList.add('active');
        
        // 预加载游戏资源
        const preloadGame = new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'document';
            link.href = gamePath;
            link.onload = resolve;
            document.head.appendChild(link);
        });

        // 等待动画和预加载完成
        Promise.all([
            new Promise(resolve => setTimeout(resolve, 800)),
            preloadGame
        ]).then(() => {
            window.location.href = gamePath;
        });
    });
}

// 优化过渡动画
function createTransitionElement(gameName) {
    // 如果已经存在过渡元素，先移除
    const existingTransition = document.querySelector('.game-transition');
    if (existingTransition) {
        existingTransition.remove();
    }

    const transition = document.createElement('div');
    transition.className = 'game-transition';
    transition.innerHTML = `
        <div class="loading-circle"></div>
        <div class="game-title">
            <span class="title-inner">${gameName}</span>
        </div>
    `;
    
    // 添加优雅的动画效果
    const titleSpan = transition.querySelector('.title-inner');
    titleSpan.style.opacity = '0';
    titleSpan.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        titleSpan.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
        titleSpan.style.opacity = '1';
        titleSpan.style.transform = 'translateY(0)';
    });
    
    document.body.appendChild(transition);
    return transition;
}

// 更新卡片点击处理
function initCardInteractions() {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 添加点击效果
            card.style.transform = 'scale(0.96)';
            
            // 启动过渡动画
            requestAnimationFrame(() => {
                navigateToGame(card);
            });
        });
    });
}

// 优化滚动处理
function initScrollOptimization() {
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const cards = document.querySelectorAll('.game-card');
                
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        card.style.transform = 'translateY(0)';
                        card.style.opacity = '1';
                    }
                });
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// 优化图片加载
function optimizeImages() {
    const images = document.querySelectorAll('.game-preview img');
    const placeholderUrl = './assets/previews/placeholder.svg';
    
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.onerror = () => {
            console.log('Image load error:', img.src); // 添加错误日志
            img.src = placeholderUrl;
            img.classList.add('error');
        };
        
        img.onload = () => {
            img.classList.add('loaded');
        };
    });
}

// 优化卡片动画
function initCardAnimations() {
    const cards = document.querySelectorAll('.game-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

// 更新初始化函数
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否是从游戏页面返回
    if (window.performance && window.performance.navigation.type === 2) {
        // 清除导航状态
        sessionStorage.removeItem('gameNavigating');
        
        // 移除所有存在的过渡动画元素
        const existingTransitions = document.querySelectorAll('.game-transition');
        existingTransitions.forEach(el => el.remove());
    }
    
    // 检测移动设备
    if (isTouchDevice()) {
        document.documentElement.classList.add('touch-device');
        // 禁用不必要的桌面端功能
        disableDesktopFeatures();
    }
    
    initMobileInteractions();
    initScrollOptimization();
    
    checkBrowserSupport();
    adjustFeatures();
    
    initThemeToggle();
    initParallax();
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
        // 设置加载动画的过渡效果
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.transition = 'opacity 0.5s ease';
        }
        
        loadGames();
    }, 100);

    initTouchInteractions();
    optimizeImages();
    initCardAnimations();
    
    // 添加离线支持检测
    if ('onLine' in navigator) {
        window.addEventListener('online', () => {
            loadGames();
        });
    }

    // 使用兼容性事件监听
    addEventListenerWithFallback(window, 'resize', () => {
        // 处理窗口调整大小
    });

    // 处理屏幕方向变化
    window.addEventListener('orientationchange', () => {
        // 等待方向变化完成
        setTimeout(() => {
            // 重新计算布局
            window.scrollTo(0, 0);
        }, 100);
    });

    // 添加返回监听
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // 页面从缓存恢复时清理
            const transitions = document.querySelectorAll('.game-transition');
            transitions.forEach(el => el.remove());
            sessionStorage.removeItem('gameNavigating');
        }
    });
});

// 禁用桌面端特性
function disableDesktopFeatures() {
    // 禁用视差效果
    initParallax = () => {};
    // 移除不必要的事件监听
    window.removeEventListener('mousemove', null);
}

// 添加页面可见性处理
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});
