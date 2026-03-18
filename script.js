/* ═══════════════════════════════════════════════════
   BYPAB — script.js
   ─────────────────────────────────────────────────
   EMAILJS SETUP (3 steps, ~5 min):
   1. Go to https://emailjs.com → free account
   2. Add "Gmail" service → set Service ID: service_bypab
   3. Create Email Template with these variables:
      {{from_name}}, {{from_email}}, {{phone}},
      {{structure}}, {{service}}, {{message}}
      Set Template ID: template_bypab
      In "To email": pablochauvin1@gmail.com
   4. Copy your Public Key and paste below
═══════════════════════════════════════════════════ */

const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace
const EMAILJS_SERVICE_ID  = 'service_bypab';
const EMAILJS_TEMPLATE_ID = 'template_bypab';

// ── INIT EMAILJS ──────────────────────────────────
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── DOM READY ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initMobileMenu();
  initReveal();
  initPortfolioFilter();
  initPortfolioModal();
  initTestimonials();
  initCookie();
  initForm();
  initEscKey();
});

/* ════════════════════════════════════
   CURSOR
════════════════════════════════════ */
function initCursor() {
  const cd = document.getElementById('cd');
  const cr = document.getElementById('cr');
  if (!cd || !cr) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cd.style.left = mx + 'px';
    cd.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    cr.style.left = rx + 'px';
    cr.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const hoverTargets = 'a,button,.p-card,.service-card,.t-card,.pricing-card,.value-card,.contact-method,.filter-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => { cd.classList.add('h'); cr.classList.add('h'); });
    el.addEventListener('mouseleave', () => { cd.classList.remove('h'); cr.classList.remove('h'); });
  });
}

/* ════════════════════════════════════
   NAV — scroll class + active link
════════════════════════════════════ */
function initNav() {
  const nav    = document.getElementById('main-nav');
  const links  = document.querySelectorAll('.nav-links a');
  const sects  = document.querySelectorAll('section[id]');
  let   ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);

      let current = '';
      sects.forEach(s => {
        if (window.scrollY >= s.offsetTop - 110) current = s.id;
      });
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
      ticking = false;
    });
    ticking = true;
  });
}

/* ════════════════════════════════════
   MOBILE MENU
════════════════════════════════════ */
function initMobileMenu() {
  const menu  = document.getElementById('mob-menu');
  const open  = document.getElementById('burger-btn');
  const close = document.getElementById('mob-close');
  if (!menu || !open || !close) return;

  open.addEventListener('click',  () => menu.classList.add('open'));
  close.addEventListener('click', () => menu.classList.remove('open'));
}

window.closeMob = function () {
  const menu = document.getElementById('mob-menu');
  if (menu) menu.classList.remove('open');
};

/* ════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: .06, rootMargin: '0px 0px -28px 0px' });

  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

/* ════════════════════════════════════
   PORTFOLIO FILTER
════════════════════════════════════ */
function initPortfolioFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.p-card').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.opacity        = show ? '1' : '.15';
        card.style.pointerEvents  = show ? ''  : 'none';
      });
    });
  });
}

/* ════════════════════════════════════
   PORTFOLIO MODAL
════════════════════════════════════ */
function initPortfolioModal() {
  document.querySelectorAll('.p-card').forEach(card => {
    card.addEventListener('click', () => {
      const { title, client, date, type, desc, img } = card.dataset;
      const tags = card.dataset.tags.split(',');

      document.getElementById('pmod-img').innerHTML =
        `<img src="${img}" alt="${title}" style="width:100%;height:100%;object-fit:cover"/>
         <div class="p-modal-img-overlay"></div>`;

      document.getElementById('pmod-meta').innerHTML =
        `<div class="meta-field"><span class="meta-label">Client</span><span class="meta-val">${client}</span></div>
         <div class="meta-field"><span class="meta-label">Date</span><span class="meta-val">${date}</span></div>
         <div class="meta-field"><span class="meta-label">Prestation</span><span class="meta-val">${type}</span></div>`;

      document.getElementById('pmod-title').textContent = title;
      document.getElementById('pmod-desc').textContent  = desc;
      document.getElementById('pmod-tags').innerHTML    = tags.map(t => `<span class="p-tag">${t.trim()}</span>`).join('');

      document.getElementById('p-modal-bg').classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
}

window.closePModal = function (e) {
  if (e.target === document.getElementById('p-modal-bg')) closePModalDirect();
};
window.closePModalDirect = function () {
  document.getElementById('p-modal-bg').classList.remove('open');
  document.body.style.overflow = '';
};

/* ════════════════════════════════════
   CV MODAL
════════════════════════════════════ */
window.openCVModal = function () {
  document.getElementById('cv-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeCVModal = function (e) {
  if (e.target === document.getElementById('cv-overlay')) closeCVModalDirect();
};
window.closeCVModalDirect = function () {
  document.getElementById('cv-overlay').classList.remove('open');
  document.body.style.overflow = '';
};

/* ════════════════════════════════════
   TESTIMONIALS
   Modern grid with page dots — no carousel shift,
   shows 3 per "page", dots navigate between groups
════════════════════════════════════ */
function initTestimonials() {
  const grid    = document.getElementById('t-grid');
  const dotsEl  = document.getElementById('t-nav');
  if (!grid || !dotsEl) return;

  const cards   = Array.from(grid.querySelectorAll('.t-card'));
  const perPage = () => window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
  let   cur     = 0;

  function pages() { return Math.ceil(cards.length / perPage()); }

  function render() {
    const pp = perPage();
    const p  = pages();
    // Show only cards for current page
    cards.forEach((c, i) => {
      const page = Math.floor(i / pp);
      c.style.display = page === cur ? '' : 'none';
    });
    // Rebuild dots
    dotsEl.innerHTML = '';
    for (let i = 0; i < p; i++) {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === cur ? ' active' : '');
      d.setAttribute('aria-label', `Page ${i + 1}`);
      d.addEventListener('click', () => { cur = i; render(); });
      dotsEl.appendChild(d);
    }
  }

  render();
  window.addEventListener('resize', () => { cur = 0; render(); });
}

/* ════════════════════════════════════
   COOKIE
════════════════════════════════════ */
function initCookie() {
  if (!localStorage.getItem('bypab-consent')) {
    setTimeout(() => {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.classList.remove('hidden');
    }, 1400);
  }
}

window.cookieAccept = function () {
  localStorage.setItem('bypab-consent', 'accepted');
  document.getElementById('cookie-banner').classList.add('hidden');
};
window.cookieDecline = function () {
  localStorage.setItem('bypab-consent', 'declined');
  document.getElementById('cookie-banner').classList.add('hidden');
};

/* ════════════════════════════════════
   LEGAL MODALS
════════════════════════════════════ */
window.openLegal = function (page) {
  document.getElementById('legal-' + page).classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeLegal = function (page) {
  document.getElementById('legal-' + page).classList.remove('open');
  document.body.style.overflow = '';
};

document.querySelectorAll('.legal-overlay').forEach(ov => {
  ov.addEventListener('click', e => {
    if (e.target === ov) window.closeLegal(ov.id.replace('legal-', ''));
  });
});

/* ════════════════════════════════════
   CONTACT FORM — EmailJS
════════════════════════════════════ */
function initForm() {
  const form    = document.getElementById('contact-form');
  const btnEl   = document.getElementById('f-submit');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const msg   = document.getElementById('f-msg').value.trim();
    const rgpd  = document.getElementById('f-rgpd').checked;

    if (!name || !email || !msg) {
      alert('Merci de remplir les champs obligatoires (*).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Adresse email invalide.');
      return;
    }
    if (!rgpd) {
      alert("Merci d'accepter la politique de confidentialité.");
      return;
    }

    btnEl.textContent = 'Envoi…';
    btnEl.classList.add('btn-loading');
    success.classList.remove('visible');
    error.classList.remove('visible');

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name : name,
        from_email: email,
        phone     : document.getElementById('f-phone').value   || 'Non renseigné',
        structure : document.getElementById('f-type').value    || 'Non renseigné',
        service   : document.getElementById('f-service').value || 'Non renseigné',
        message   : msg,
      });
      success.classList.add('visible');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      error.classList.add('visible');
    }

    btnEl.textContent = 'Envoyer le message';
    btnEl.classList.remove('btn-loading');
  });
}

/* ════════════════════════════════════
   ESCAPE KEY
════════════════════════════════════ */
function initEscKey() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    window.closePModalDirect?.();
    window.closeCVModalDirect?.();
    ['mentions', 'confidentialite'].forEach(p => {
      const el = document.getElementById('legal-' + p);
      if (el?.classList.contains('open')) window.closeLegal(p);
    });
  });
}
