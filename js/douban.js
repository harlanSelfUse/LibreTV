// 模拟 showToast 函数
function showToast(message, type) {
    console.log(`[${type}] ${message}`);
}

// 模拟 fetchDoubanData 函数
function fetchDoubanData(url) {
    return new Promise((resolve) => {
        // 模拟返回数据
        resolve({ tags: ['模拟标签'] });
    });
}

// 模拟 renderDoubanCards 函数
function renderDoubanCards(data, container) {
    container.innerHTML = '<div>模拟渲染豆瓣卡片</div>';
}

// 模拟 showTagManageModal 函数
function showTagManageModal() {
    console.log('显示标签管理模态框');
}

// 模拟 addTag 函数里的 safeTag 处理
function addTag(tag) {
    const safeTag = tag.trim();
    // 确定当前使用的是电影、电视剧还是动漫标签
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    const isTv = doubanMovieTvCurrentSwitch === 'tv';
    const currentTags = isMovie ? movieTags : isTv ? tvTags : dongmanTags;

    if (!currentTags.includes(safeTag)) {
        // 添加到对应的标签数组
        if (isMovie) {
            movieTags.push(safeTag);
        } else if (isTv) {
            tvTags.push(safeTag);
        } else {
            dongmanTags.push(safeTag);
        }
        saveUserTags();
        renderDoubanTags();
    }
}

// 模拟 deleteTag 函数
function deleteTag(tag) {
    // 确定当前使用的是电影、电视剧还是动漫标签
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    const isTv = doubanMovieTvCurrentSwitch === 'tv';
    const currentTags = isMovie ? movieTags : isTv ? tvTags : dongmanTags;

    const index = currentTags.indexOf(tag);
    // 如果找到标签，则删除
    if (index !== -1) {
        if (isMovie) {
            movieTags.splice(index, 1);
        } else if (isTv) {
            tvTags.splice(index, 1);
        } else {
            dongmanTags.splice(index, 1);
        }
        saveUserTags();
        renderDoubanTags();
    }
}

// 模拟 setupDoubanRefreshBtn 函数
function setupDoubanRefreshBtn() {
    const refreshBtn = document.getElementById('douban-refresh-btn');
    if (refreshBtn) {
        refreshBtn.onclick = function () {
            renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
        };
    }
}

// 豆瓣标签列表 - 修改为默认标签
let defaultMovieTags = ['热门', '最新', '经典', '豆瓣高分', '冷门佳片', '华语', '欧美', '韩国', '日本', '动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '治愈'];
let defaultTvTags = ['热门', '美剧', '英剧', '韩剧', '日剧', '国产剧', '港剧', '日本动画', '综艺', '纪录片'];
// 添加默认动漫标签
let defaultDongmanTags = ['热门', '新番', '经典', '热血', '冒险', '搞笑', '校园', '恋爱', '奇幻', '科幻', '治愈', '悬疑'];

// 用户标签列表 - 存储用户实际使用的标签（包含保留的系统标签和用户添加的自定义标签）
let movieTags = [];
let tvTags = [];
// 添加用户动漫标签
let dongmanTags = [];

// 加载用户标签
function loadUserTags() {
    try {
        // 尝试从本地存储加载用户保存的标签
        const savedMovieTags = localStorage.getItem('userMovieTags');
        const savedTvTags = localStorage.getItem('userTvTags');
        // 尝试加载动漫标签
        const savedDongmanTags = localStorage.getItem('userDongmanTags');

        // 如果本地存储中有标签数据，则使用它
        if (savedMovieTags) {
            movieTags = JSON.parse(savedMovieTags);
        } else {
            // 否则使用默认标签
            movieTags = [...defaultMovieTags];
        }

        if (savedTvTags) {
            tvTags = JSON.parse(savedTvTags);
        } else {
            // 否则使用默认标签
            tvTags = [...defaultTvTags];
        }

        if (savedDongmanTags) {
            dongmanTags = JSON.parse(savedDongmanTags);
        } else {
            dongmanTags = [...defaultDongmanTags];
        }
    } catch (e) {
        console.error('加载标签失败：', e);
        // 初始化为默认值，防止错误
        movieTags = [...defaultMovieTags];
        tvTags = [...defaultTvTags];
        dongmanTags = [...defaultDongmanTags];
    }
}

// 保存用户标签
function saveUserTags() {
    try {
        localStorage.setItem('userMovieTags', JSON.stringify(movieTags));
        localStorage.setItem('userTvTags', JSON.stringify(tvTags));
        // 保存动漫标签
        localStorage.setItem('userDongmanTags', JSON.stringify(dongmanTags));
    } catch (e) {
        console.error('保存标签失败：', e);
        showToast('保存标签失败', 'error');
    }
}

let doubanMovieTvCurrentSwitch = 'movie';
let doubanCurrentTag = '热门';
let doubanPageStart = 0;
const doubanPageSize = 16; // 一次显示的项目数量

// 初始化豆瓣功能
// 初始化豆瓣功能
function initDouban() {
    // 设置豆瓣开关的初始状态
    const doubanToggle = document.getElementById('doubanToggle');
    if (doubanToggle) {
        const isEnabled = localStorage.getItem('doubanEnabled') === 'true';
        doubanToggle.checked = isEnabled;
        
        // 设置开关外观
        const toggleBg = doubanToggle.nextElementSibling;
        const toggleDot = toggleBg.nextElementSibling;
        if (isEnabled) {
            toggleBg.classList.add('bg-pink-600');
            toggleDot.classList.add('translate-x-6');
        }
        
        // 添加事件监听
        doubanToggle.addEventListener('change', function(e) {
            const isChecked = e.target.checked;
            localStorage.setItem('doubanEnabled', isChecked);
            
            // 更新开关外观
            if (isChecked) {
                toggleBg.classList.add('bg-pink-600');
                toggleDot.classList.add('translate-x-6');
            } else {
                toggleBg.classList.remove('bg-pink-600');
                toggleDot.classList.remove('translate-x-6');
            }
            
            // 更新显示状态
            updateDoubanVisibility();
        });
        
        // 初始更新显示状态
        updateDoubanVisibility();

        // 滚动到页面顶部
        window.scrollTo(0, 0);
    }

    // 加载用户标签
    loadUserTags();

    // 渲染电影/电视剧切换
    renderDoubanMovieTvSwitch();
    
    // 渲染豆瓣标签
    renderDoubanTags();
    
    // 换一批按钮事件监听
    setupDoubanRefreshBtn();
    
    // 初始加载热门内容
    if (localStorage.getItem('doubanEnabled') === 'true') {
        renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
    }
}
// 渲染电影/电视剧切换器
// ... existing code ...

// 渲染电影/电视剧切换器
function renderDoubanMovieTvSwitch() {
    // 获取切换按钮元素
    const movieToggle = document.getElementById('douban-movie-toggle');
    const tvToggle = document.getElementById('douban-tv-toggle');
    const dmToggle = document.getElementById('douban-dongman-toggle');

    if (!movieToggle || !tvToggle || !dmToggle) return;

    movieToggle.addEventListener('click', function() {
        if (doubanMovieTvCurrentSwitch !== 'movie') {
            // 更新按钮样式
            movieToggle.classList.add('bg-pink-600', 'text-white');
            movieToggle.classList.remove('text-gray-300');
            
            tvToggle.classList.remove('bg-pink-600', 'text-white');
            tvToggle.classList.add('text-gray-300');
            dmToggle.classList.remove('bg-pink-600', 'text-white');
            dmToggle.classList.add('text-gray-300');
            
            doubanMovieTvCurrentSwitch = 'movie';
            doubanCurrentTag = '热门';
            doubanPageStart = 0;

            // 重新加载豆瓣内容
            renderDoubanTags(movieTags);

            // 换一批按钮事件监听
            setupDoubanRefreshBtn();
            
            // 初始加载热门内容
            if (localStorage.getItem('doubanEnabled') === 'true') {
                renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
            }
        }
    });
    
    // 电视剧按钮点击事件
    tvToggle.addEventListener('click', function() {
        if (doubanMovieTvCurrentSwitch !== 'tv') {
            // 更新按钮样式
            tvToggle.classList.add('bg-pink-600', 'text-white');
            tvToggle.classList.remove('text-gray-300');
            
            movieToggle.classList.remove('bg-pink-600', 'text-white');
            movieToggle.classList.add('text-gray-300');
            dmToggle.classList.remove('bg-pink-600', 'text-white');
            dmToggle.classList.add('text-gray-300');
            
            doubanMovieTvCurrentSwitch = 'tv';
            doubanCurrentTag = '热门';
            doubanPageStart = 0;

            // 重新加载豆瓣内容
            renderDoubanTags(tvTags);

            // 换一批按钮事件监听
            setupDoubanRefreshBtn();
            
            // 初始加载热门内容
            if (localStorage.getItem('doubanEnabled') === 'true') {
                renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
            }
        }
    });

    // 动漫按钮点击事件
    dmToggle.addEventListener('click', function() {
        if (doubanMovieTvCurrentSwitch !== 'dongman') {
            // 更新按钮样式
            dmToggle.classList.add('bg-pink-600', 'text-white');
            dmToggle.classList.remove('text-gray-300');
            
            movieToggle.classList.remove('bg-pink-600', 'text-white');
            movieToggle.classList.add('text-gray-300');
            tvToggle.classList.remove('bg-pink-600', 'text-white');
            tvToggle.classList.add('text-gray-300');
            
            doubanMovieTvCurrentSwitch = 'dongman';
            doubanCurrentTag = '热门';
            doubanPageStart = 0;

            // 重新加载豆瓣内容
            renderDoubanTags(dongmanTags);

            // 换一批按钮事件监听
            setupDoubanRefreshBtn();
            
            // 初始加载热门内容
            if (localStorage.getItem('doubanEnabled') === 'true') {
                renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
            }
        }
    });
}

// ... existing code ...

// 渲染豆瓣标签选择器
function renderDoubanTags(tags) {
    const tagContainer = document.getElementById('douban-tags');
    if (!tagContainer) return;

    // 确定当前应该使用的标签列表
    let currentTags;
    if (doubanMovieTvCurrentSwitch === 'movie') {
        currentTags = movieTags;
    } else if (doubanMovieTvCurrentSwitch === 'tv') {
        currentTags = tvTags;
    } else {
        currentTags = dongmanTags;
    }

    // 清空标签容器
    tagContainer.innerHTML = '';

    // 先添加标签管理按钮
    const manageBtn = document.createElement('button');
    manageBtn.className = 'py-1.5 px-3.5 rounded text-sm font-medium transition-all duration-300 bg-[#1a1a1a] text-gray-300 hover:bg-pink-700 hover:text-white border border-[#333] hover:border-white';
    manageBtn.innerHTML = '<span class="flex items-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>管理标签</span>';
    manageBtn.onclick = function () {
        showTagManageModal();
    };
    tagContainer.appendChild(manageBtn);

    // 添加所有标签
    currentTags.forEach(tag => {
        const btn = document.createElement('button');

        // 设置样式
        let btnClass = 'py-1.5 px-3.5 rounded text-sm font-medium transition-all duration-300 border ';

        // 当前选中的标签使用高亮样式
        if (tag === doubanCurrentTag) {
            btnClass += 'bg-pink-600 text-white shadow-md border-white';
        } else {
            btnClass += 'bg-[#1a1a1a] text-gray-300 hover:bg-pink-700 hover:text-white border-[#333] hover:border-white';
        }

        btn.className = btnClass;
        btn.textContent = tag;

        btn.onclick = function () {
            if (doubanCurrentTag !== tag) {
                doubanCurrentTag = tag;
                doubanPageStart = 0;
                renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
                renderDoubanTags();
            }
        };

        tagContainer.appendChild(btn);
    });
}

function fetchDoubanTags() {
    const movieTagsTarget = `https://movie.douban.com/j/search_tags?type=movie`;
    fetchDoubanData(movieTagsTarget)
      .then(data => {
            movieTags = data.tags;
            if (doubanMovieTvCurrentSwitch === 'movie') {
                renderDoubanTags(movieTags);
            }
        })
      .catch(error => {
            console.error("获取豆瓣热门电影标签失败：", error);
        });
    const tvTagsTarget = `https://movie.douban.com/j/search_tags?type=tv`;
    fetchDoubanData(tvTagsTarget)
      .then(data => {
            tvTags = data.tags;
            if (doubanMovieTvCurrentSwitch === 'tv') {
                renderDoubanTags(tvTags);
            }
        })
      .catch(error => {
            console.error("获取豆瓣热门电视剧标签失败：", error);
        });
    // 获取动漫标签
    const dongmanTagsTarget = `https://movie.douban.com/j/search_tags?type=tv&tag=动画`;
    fetchDoubanData(dongmanTagsTarget)
      .then(data => {
            dongmanTags = data.tags;
            if (doubanMovieTvCurrentSwitch === 'dongman') {
                renderDoubanTags(dongmanTags);
            }
        })
      .catch(error => {
            console.error("获取豆瓣热门动漫标签失败：", error);
        });
}

// 渲染热门推荐内容
function renderRecommend(tag, pageLimit, pageStart) {
    const container = document.getElementById("douban-results");
    if (!container) return;

    const loadingOverlayHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div class="flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin inline-block"></div>
                <span class="text-pink-500 ml-4">加载中...</span>
            </div>
        </div>
    `;

    container.classList.add("relative");
    container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', loadingOverlayHTML);

    // 处理动漫类型请求
    const type = doubanMovieTvCurrentSwitch === 'dongman' ? 'tv' : doubanMovieTvCurrentSwitch;
    const target = `https://movie.douban.com/j/search_subjects?type=${type}&tag=${tag}&sort=recommend&page_limit=${pageLimit}&page_start=${pageStart}`;

    // 使用通用请求函数
    fetchDoubanData(target)
      .then(data => {
            container.innerHTML = '';
            renderDoubanCards(data, container);
        })
      .catch(error => {
            console.error("获取豆瓣数据失败：", error);
            container.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <div class="text-red-400">❌ 获取豆瓣数据失败，请稍后重试</div>
                    <div class="text-gray-500 text-sm mt-2">提示：使用VPN可能有助于解决此问题</div>
                </div>
            `;
        });
}

// 显示标签管理模态框
function showTagManageModal() {
    // 当前使用的标签类型和默认标签
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    const isTv = doubanMovieTvCurrentSwitch === 'tv';
    const isDongman = doubanMovieTvCurrentSwitch === 'dongman';
    const currentTags = isMovie ? movieTags : isTv ? tvTags : dongmanTags;
    const defaultTags = isMovie ? defaultMovieTags : isTv ? defaultTvTags : defaultDongmanTags;

    console.log('当前标签:', currentTags);
    console.log('默认标签:', defaultTags);
}

// 重置为默认标签
function resetTagsToDefault() {
    // 确定当前使用的是电影、电视剧还是动漫
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    const isTv = doubanMovieTvCurrentSwitch === 'tv';

    // 重置为默认标签
    if (isMovie) {
        movieTags = [...defaultMovieTags];
    } else if (isTv) {
        tvTags = [...defaultTvTags];
    } else {
        dongmanTags = [...defaultDongmanTags];
    }
    saveUserTags();
    renderDoubanTags();
}

// 初始化页面加载完成事件
document.addEventListener('DOMContentLoaded', function () {
    initDouban();
});