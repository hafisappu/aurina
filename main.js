/* ════════════════════════════════════
   AURINA JEWELRY – MAIN JS
   ════════════════════════════════════ */
(() => {
  'use strict';

  /* ── ANNOUNCEMENT BAR ──────────────── */
  const announceBar   = document.getElementById('announce');
  const announceClose = document.getElementById('announce-close');
  const navbar        = document.getElementById('navbar');

  if (announceClose) {
    announceClose.addEventListener('click', () => {
      announceBar.style.display = 'none';
      document.documentElement.style.setProperty('--announce-h', '0px');
    });
  }

  /* ── MOBILE MENU ───────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose= document.getElementById('mobile-close');

  function openMobile() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobile);
  mobileClose?.addEventListener('click', closeMobile);

  // Close on backdrop click
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobile();
  });

  // Close when a link is clicked
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobile);
  });

  /* ── SEARCH OVERLAY ─────────────────── */
  const searchBtn     = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose   = document.getElementById('search-close');
  const searchInput   = document.getElementById('search-input');

  searchBtn?.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput?.focus(), 100);
  });

  searchClose?.addEventListener('click', () => searchOverlay.classList.remove('open'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay?.classList.remove('open');
      closeCart();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchOverlay.classList.add('open');
      setTimeout(() => searchInput?.focus(), 100);
    }
  });

  /* ── CART ─────────────────────────── */
  const cartBtn         = document.getElementById('cart-btn');
  const cartDrawer      = document.getElementById('cart-drawer');
  const cartOverlay     = document.getElementById('cart-overlay');
  const cartDrawerClose = document.getElementById('cart-drawer-close');
  const cartCount       = document.getElementById('cart-count');
  const cartBody        = document.getElementById('cart-body');
  const cartFooter      = document.getElementById('cart-footer');
  const cartTotalPrice  = document.getElementById('cart-total-price');

  let cart = [];

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.closeCart = function() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartBtn?.addEventListener('click', openCart);
  cartDrawerClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  function renderCart() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p>Your cart is empty</p>
          <a href="#products" class="btn-primary" onclick="closeCart()">Start Shopping</a>
        </div>`;
      cartFooter?.classList.add('hidden');
    } else {
      cartBody.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" />
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">€${item.price.toFixed(2).replace('.', ',')}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${i})">Remove</button>
          </div>
        </div>`).join('');
      cartFooter?.classList.remove('hidden');
      if (cartTotalPrice) cartTotalPrice.textContent = `€${total.toFixed(2).replace('.', ',')}`;
    }

    const count = cart.length;
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.classList.toggle('visible', count > 0);
    }
  }

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    renderCart();
  };

  function addToCart(name, price, imgSrc) {
    cart.push({ name, price: parseFloat(price), img: imgSrc });
    renderCart();
    openCart();
  }

  // Quick add buttons
  document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card   = btn.closest('.product-card');
      const img    = card?.querySelector('.product-img')?.src || '';
      const name   = btn.dataset.name;
      const price  = btn.dataset.price;
      addToCart(name, price, img);
    });
  });

  /* ── STICKY NAV SHADOW ──────────────── */
  const handleScroll = () => {
    navbar.classList.toggle('shadow', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── SCROLL REVEAL ───────────────────── */
  const revealEls = document.querySelectorAll([
    '.product-card',
    '.tile',
    '.why-list li',
    '.footer-col',
    '.footer-brand',
    '.signup-inner > *',
  ].join(','));

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 60);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ── EMAIL SIGNUP ────────────────────── */
  window.handleSignup = function(e) {
    e.preventDefault();
    const btn     = e.target.querySelector('button[type=submit]');
    const success = document.getElementById('signup-success');
    btn.textContent = '…';
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.add('hidden');
      success?.classList.remove('hidden');
      document.getElementById('signup-email').value = '';
    }, 1000);
  };

  /* ── SMOOTH SCROLL ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── PRODUCT SWATCH INTERACTION ───────── */
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatch.closest('.product-swatches')?.querySelectorAll('.swatch')
        .forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  });

  /* ── INIT ────────────────────────────── */
  renderCart();

})();
