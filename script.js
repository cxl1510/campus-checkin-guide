/**
 * 校园打卡指南 - 交互脚本
 * 功能：
 * 1. IntersectionObserver 实现滚动进入视口时的淡入动画
 * 2. 卡片悬停交互增强（可选，CSS 已覆盖主要效果）
 */

(function () {
  'use strict';

  // ---------- 滚动淡入动画 ----------
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length === 0) return;

  // 优先使用 IntersectionObserver（性能更好）
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // 动画触发后取消观察，避免重复
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // 降级：直接显示（兼容旧浏览器）
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- 卡片悬停增强（可选） ----------
  // 为卡片添加轻微的点击反馈（移动端触摸体验优化）
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    card.addEventListener('touchstart', function () {
      this.style.transform = 'translateY(-6px) scale(1.02)';
      this.style.boxShadow =
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
    });

    card.addEventListener('touchend', function () {
      // 清除内联样式，让 CSS 重新接管
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
})();
