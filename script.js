/**
 * 校园打卡指南 - 交互脚本
 * 功能：
 * 1. 动态渲染打卡点卡片
 * 2. 分类筛选、搜索、排序
 * 3. 详情弹窗展示
 * 4. 点赞功能（localStorage 持久化）
 * 5. 滚动淡入动画（IntersectionObserver）
 * 6. 视差滚动效果
 */

(function () {
  'use strict';

  /* ============================================
     数据定义
     ============================================ */

  const CHECKIN_DATA = [
    {
      id: 'gate',
      title: '校门',
      icon: '🚪',
      category: 'landmark',
      shortDesc: '学校门面，拍照留念首选地。宏伟的校门是每位学子的第一印象，也是毕业照的经典背景，快来打卡记录你的校园时光吧！',
      fullDesc: '校门是学校的标志性建筑，宏伟壮观，是每位学子入学时的第一印象，也是毕业时必拍的经典背景。无论是清晨的阳光还是傍晚的余晖，校门都能呈现出不同的美感。',
      tips: ['最佳时间：早晨7-8点光线柔和', '推荐角度：正对校门仰拍', '穿搭建议：学士服或校服'],
      imageUrl: 'https://picsum.photos/seed/gate/400/300',
      likes: 0,
    },
    {
      id: 'canteen',
      title: '食堂',
      icon: '🍜',
      category: 'food',
      shortDesc: '美食聚集地，舌尖上的校园。从早餐的豆浆油条到夜宵的烧烤小吃，食堂承载了无数校园美食记忆，是干饭人的天堂。',
      fullDesc: '食堂是校园里的美食中心，汇聚了各地风味。早餐的豆浆油条热气腾腾，午餐的盖浇饭色香味俱全，夜宵的烧烤小吃更是令人垂涎。这里不仅是填饱肚子的地方，更是同学们交流感情的社交场所。',
      tips: ['最佳时间：避开12:00-12:30高峰', '推荐窗口：二楼特色档口', '必点美食：红烧肉、麻辣烫'],
      imageUrl: 'https://picsum.photos/seed/canteen/400/300',
      likes: 0,
    },
    {
      id: 'library',
      title: '图书馆',
      icon: '📚',
      category: 'study',
      shortDesc: '知识的海洋，自习圣地。安静明亮的阅览室里，书香弥漫，无论是备考还是阅读，这里都是最佳去处。',
      fullDesc: '图书馆是校园的知识殿堂，藏书丰富，环境优雅。明亮的阅览室里，阳光透过落地窗洒在书桌上，营造出宁静的学习氛围。无论是期末备考还是日常阅读，这里都能让你沉浸其中。',
      tips: ['最佳时间：早晨9点前座位充裕', '推荐楼层：三楼靠窗位置', '注意事项：保持安静，手机静音'],
      imageUrl: 'https://picsum.photos/seed/library/400/300',
      likes: 0,
    },
    {
      id: 'playground',
      title: '操场',
      icon: '🏃',
      category: 'sports',
      shortDesc: '运动健身，挥洒汗水的地方。绿茵场上奔跑的身影、看台上的呐喊助威，操场是青春活力的最佳写照。',
      fullDesc: '操场是校园里最具活力的地方，400米标准跑道环绕着绿茵足球场。清晨有晨跑的身影，傍晚有踢球的少年，夜晚还有散步的情侣。这里见证了无数汗水与欢笑，是释放压力的最佳场所。',
      tips: ['最佳时间：傍晚17:00-19:00', '推荐项目：夜跑、足球、飞盘', '注意事项：运动后及时补水'],
      imageUrl: 'https://picsum.photos/seed/playground/400/300',
      likes: 0,
    },
    {
      id: 'building',
      title: '教学楼',
      icon: '🏫',
      category: 'landmark',
      shortDesc: '求学的主战场，青春记忆。一间间教室里回荡着老师的谆谆教诲，走廊里留下了学子们匆匆的足迹。',
      fullDesc: '教学楼是校园的核心建筑，宽敞明亮的教室里配备了现代化的教学设备。走廊里的名人画像、楼梯转角的光影、教室窗外的绿树，每一处都充满了浓厚的学术氛围和青春气息。',
      tips: ['最佳时间：课间或放学后', '推荐楼层：顶楼天台视野开阔', '穿搭建议：学院风或简约休闲'],
      imageUrl: 'https://picsum.photos/seed/building/400/300',
      likes: 0,
    },
    {
      id: 'corner',
      title: '网红角落',
      icon: '📸',
      category: 'landmark',
      shortDesc: '校园隐藏打卡点，出片圣地。那面爬满藤蔓的老墙、阳光洒落的楼梯转角，随手一拍就是朋友圈大片。',
      fullDesc: '网红角落是校园里最出片的地方，可能是爬满常春藤的老墙，也可能是洒满阳光的楼梯转角，又或者是图书馆前的银杏大道。这些地方虽然不起眼，却总能拍出令人惊艳的照片。',
      tips: ['最佳时间：下午15:00-17:00黄金光线', '推荐道具：书本、咖啡杯、耳机', '后期建议：增加暖色调滤镜'],
      imageUrl: 'https://picsum.photos/seed/corner/400/300',
      likes: 0,
    },
  ];

  // 分类映射表（显示名称）
  const CATEGORY_MAP = {
    landmark: '标志建筑',
    food: '美食',
    study: '学习',
    sports: '运动',
  };

  // localStorage 键名
  const LIKES_KEY = 'campus_checkin_likes';

  /* ============================================
     状态管理
     ============================================ */

  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'default';
  let currentModalId = null;

  /* ============================================
     工具函数
     ============================================ */

  /**
   * 从 localStorage 读取点赞数据
   * @returns {Record<string, number>}
   */
  function loadLikes() {
    try {
      const raw = localStorage.getItem(LIKES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /**
   * 保存点赞数据到 localStorage
   * @param {Record<string, number>} likesMap
   */
  function saveLikes(likesMap) {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likesMap));
    } catch {
      // 存储失败时静默处理，不影响主流程
    }
  }

  /**
   * 获取带有点赞数的完整数据副本
   * @returns {Array}
   */
  function getMergedData() {
    const likesMap = loadLikes();
    return CHECKIN_DATA.map((item) => ({
      ...item,
      likes: likesMap[item.id] ?? item.likes,
    }));
  }

  /**
   * 根据分类和搜索词筛选数据
   * @param {Array} data
   * @param {string} category
   * @param {string} search
   * @returns {Array}
   */
  function filterCards(data, category, search) {
    const term = search.trim().toLowerCase();
    return data.filter((item) => {
      const matchCategory = category === 'all' || item.category === category;
      const matchSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.shortDesc.toLowerCase().includes(term);
      return matchCategory && matchSearch;
    });
  }

  /**
   * 对数据进行排序
   * @param {Array} data
   * @param {string} sortType
   * @returns {Array}
   */
  function sortCards(data, sortType) {
    const list = [...data];
    switch (sortType) {
      case 'name':
        list.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
        break;
      case 'likes':
        list.sort((a, b) => b.likes - a.likes);
        break;
      default:
        // 默认保持原始顺序
        break;
    }
    return list;
  }

  /* ============================================
     DOM 元素缓存
     ============================================ */

  const cardGrid = document.getElementById('cardGrid');
  const noResults = document.getElementById('noResults');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const categoryButtons = document.querySelectorAll('.filter-btn[data-category]');

  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalTipsWrap = document.getElementById('modalTipsWrap');
  const modalTipsList = document.getElementById('modalTipsList');
  const modalLikeBtn = document.getElementById('modalLikeBtn');
  const modalLikeCount = document.getElementById('modalLikeCount');

  /* ============================================
     渲染函数
     ============================================ */

  /**
   * 渲染卡片列表
   * @param {Array} data
   */
  function renderCards(data) {
    if (!cardGrid) return;

    // 清空现有内容
    cardGrid.innerHTML = '';

    if (data.length === 0) {
      noResults.hidden = false;
      return;
    }

    noResults.hidden = true;

    data.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('data-animate', '');
      card.setAttribute('data-id', item.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `查看 ${item.title} 详情`);

      card.innerHTML = `
        <!-- 建议替换为AI生成图片 -->
        <img class="card-image" src="${item.imageUrl}" alt="${item.title}" loading="lazy" />
        <div class="card-body">
          <div class="card-icon" aria-hidden="true">${item.icon}</div>
          <h2 class="card-title">${item.title}</h2>
          <span class="card-category">${CATEGORY_MAP[item.category] || item.category}</span>
          <p class="card-desc">${item.shortDesc}</p>
          <button class="card-like" data-like-id="${item.id}" type="button" aria-label="点赞 ${item.title}">
            <span class="like-icon" aria-hidden="true">&#9829;</span>
            <span class="like-count">${item.likes}</span>
          </button>
        </div>
      `;

      // 卡片点击打开弹窗（排除点赞按钮）
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-like')) return;
        openModal(item.id);
      });

      // 键盘回车打开弹窗
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(item.id);
        }
      });

      // 点赞按钮事件
      const likeBtn = card.querySelector('.card-like');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        likeCard(item.id);
      });

      cardGrid.appendChild(card);
    });

    // 重新绑定滚动动画观察
    bindScrollAnimation();
  }

  /**
   * 综合筛选并重新渲染
   */
  function filterAndRender() {
    const mergedData = getMergedData();
    const filtered = filterCards(mergedData, currentCategory, currentSearch);
    const sorted = sortCards(filtered, currentSort);
    renderCards(sorted);
  }

  /* ============================================
     弹窗功能
     ============================================ */

  /**
   * 打开详情弹窗
   * @param {string} cardId
   */
  function openModal(cardId) {
    const data = getMergedData().find((item) => item.id === cardId);
    if (!data) return;

    currentModalId = cardId;

    modalImage.src = data.imageUrl;
    modalImage.alt = data.title;
    modalTitle.textContent = data.title;
    modalCategory.textContent = CATEGORY_MAP[data.category] || data.category;
    modalDesc.textContent = data.fullDesc;

    // 渲染小贴士
    modalTipsList.innerHTML = '';
    if (data.tips && data.tips.length > 0) {
      data.tips.forEach((tip) => {
        const li = document.createElement('li');
        li.textContent = tip;
        modalTipsList.appendChild(li);
      });
      modalTipsWrap.hidden = false;
    } else {
      modalTipsWrap.hidden = true;
    }

    // 更新点赞状态
    updateModalLikeState(data.likes);

    // 显示弹窗
    modalOverlay.classList.add('is-open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // 聚焦到关闭按钮（无障碍）
    setTimeout(() => modalClose.focus(), 0);
  }

  /**
   * 关闭详情弹窗
   */
  function closeModal() {
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentModalId = null;
  }

  /**
   * 更新弹窗点赞按钮状态
   * @param {number} count
   */
  function updateModalLikeState(count) {
    modalLikeCount.textContent = count;
    // 如果点赞数大于0，显示已点赞样式
    if (count > 0) {
      modalLikeBtn.classList.add('is-liked');
    } else {
      modalLikeBtn.classList.remove('is-liked');
    }
  }

  /* ============================================
     点赞功能
     ============================================ */

  /**
   * 给指定打卡点点赞
   * @param {string} cardId
   */
  function likeCard(cardId) {
    const likesMap = loadLikes();
    const current = likesMap[cardId] || 0;
    likesMap[cardId] = current + 1;
    saveLikes(likesMap);

    // 如果弹窗当前打开的是该卡片，更新弹窗点赞数
    if (currentModalId === cardId) {
      updateModalLikeState(likesMap[cardId]);
    }

    // 重新渲染列表以更新点赞数
    filterAndRender();
  }

  /* ============================================
     事件监听
     ============================================ */

  // 分类按钮点击
  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentCategory = btn.dataset.category;
      filterAndRender();
    });
  });

  // 搜索框输入
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value;
      filterAndRender();
    });
  }

  // 排序下拉框变更
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      filterAndRender();
    });
  }

  // 弹窗关闭按钮
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // 点击遮罩层关闭弹窗
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // 弹窗内点赞按钮
  if (modalLikeBtn) {
    modalLikeBtn.addEventListener('click', () => {
      if (currentModalId) {
        likeCard(currentModalId);
      }
    });
  }

  // ESC 键关闭弹窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ============================================
     滚动淡入动画
     ============================================ */

  let scrollObserver = null;

  /**
   * 绑定 IntersectionObserver 滚动动画
   */
  function bindScrollAnimation() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;

    // 清理旧观察器
    if (scrollObserver) {
      scrollObserver.disconnect();
    }

    if ('IntersectionObserver' in window) {
      scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              scrollObserver.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.1,
        }
      );

      animatedElements.forEach((el) => scrollObserver.observe(el));
    } else {
      animatedElements.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ============================================
     视差滚动效果
     ============================================ */

  const siteHeader = document.getElementById('siteHeader');

  function handleParallax() {
    if (!siteHeader) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = scrollY * 0.3;
    siteHeader.style.setProperty('--parallax-offset', `${offset}px`);
  }

  // 使用 requestAnimationFrame 节流
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ============================================
     初始化
     ============================================ */

  function init() {
    filterAndRender();
  }

  init();
})();
