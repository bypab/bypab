/* ═══════════════════════════════════════════════════════
   BYPAB — script.js

   FORMULAIRE — Formspree (aucune config serveur nécessaire)
   ─────────────────────────────────────────────────────────
   Pour activer le formulaire :
   1. Va sur https://formspree.io et crée un compte gratuit
   2. Clique "New Form" → entre ton email pablochauvin1@gmail.com
   3. Copie l'ID du formulaire (ex: xpwrqodj)
   4. Remplace FORMSPREE_ID ci-dessous par cet ID
   5. Déploie — c'est tout. Les messages arrivent dans ta boîte.
═══════════════════════════════════════════════════════ */

const FORMSPREE_ID = 'mreyjprr';

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

/* ════════════════════════════
   CURSOR
════════════════════════════ */
function initCursor() {
  const cd = document.getElementById('cd');
  const cr = document.getElementById('cr');
  if (!cd || !cr) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cd.style.left = mx + 'px'; cd.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * .1; ry += (my - ry) * .1;
    cr.style.left = rx + 'px'; cr.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.p-card,.service-card,.t-card,.pricing-card,.value-card,.contact-method,.filter-btn,.t-arrow-btn')
    .forEach(el => {
      el.addEventListener('mouseenter', () => { cd.classList.add('h'); cr.classList.add('h'); });
      el.addEventListener('mouseleave', () => { cd.classList.remove('h'); cr.classList.remove('h'); });
    });
}

/* ════════════════════════════
   NAV
════════════════════════════ */
function initNav() {
  const nav   = document.getElementById('main-nav');
  const links = document.querySelectorAll('.nav-links a');
  const sects = document.querySelectorAll('section[id]');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      let cur = '';
      sects.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
      ticking = false;
    });
    ticking = true;
  });
}

/* ════════════════════════════
   MOBILE MENU
════════════════════════════ */
function initMobileMenu() {
  const menu  = document.getElementById('mob-menu');
  const open  = document.getElementById('burger-btn');
  const close = document.getElementById('mob-close');
  if (!menu || !open || !close) return;
  open.addEventListener('click',  () => menu.classList.add('open'));
  close.addEventListener('click', () => menu.classList.remove('open'));
}
window.closeMob = () => { document.getElementById('mob-menu')?.classList.remove('open'); };

/* ════════════════════════════
   SCROLL REVEAL
════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: .06, rootMargin: '0px 0px -28px 0px' });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

/* ════════════════════════════
   PORTFOLIO FILTER
════════════════════════════ */
function initPortfolioFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.p-card').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.opacity       = show ? '1' : '.15';
        card.style.pointerEvents = show ? ''  : 'none';
      });
    });
  });
}

/* ════════════════════════════
   PORTFOLIO MODAL
════════════════════════════ */
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
window.closePModal = e => { if (e.target === document.getElementById('p-modal-bg')) closePModalDirect(); };
window.closePModalDirect = () => { document.getElementById('p-modal-bg').classList.remove('open'); document.body.style.overflow = ''; };

/* ════════════════════════════
   CV MODAL
════════════════════════════ */
window.openCVModal       = () => { document.getElementById('cv-overlay').classList.add('open'); document.body.style.overflow = 'hidden'; };
window.closeCVModal      = e  => { if (e.target === document.getElementById('cv-overlay')) closeCVModalDirect(); };
window.closeCVModalDirect = () => { document.getElementById('cv-overlay').classList.remove('open'); document.body.style.overflow = ''; };

/* ════════════════════════════
   TESTIMONIALS — smooth slider
   Cards slide 1 at a time,
   responsive per-page count
════════════════════════════ */
function initTestimonials() {
  const track   = document.getElementById('t-track');
  const pipsEl  = document.getElementById('t-pips');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  if (!track || !pipsEl || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll('.t-card'));
  let   cur   = 0;
  let   auto;

  function perPage() {
    return window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
  }
  function totalSlides() { return Math.max(1, cards.length - perPage() + 1); }

  function go(idx) {
    const pp = perPage();
    const ts = totalSlides();
    cur = ((idx % ts) + ts) % ts;

    // Translate: move by card width + gap per step
    const cardW  = cards[0].offsetWidth;
    const gapPx  = 19.2; // 1.2rem at default
    track.style.transform = `translateX(-${cur * (cardW + gapPx)}px)`;

    // Update pips
    pipsEl.querySelectorAll('.t-pip').forEach((p, i) => p.classList.toggle('active', i === cur));
  }

  function buildPips() {
    const ts = totalSlides();
    pipsEl.innerHTML = '';
    for (let i = 0; i < ts; i++) {
      const p = document.createElement('button');
      p.className = 't-pip' + (i === cur ? ' active' : '');
      p.setAttribute('aria-label', `Avis ${i + 1}`);
      p.addEventListener('click', () => { go(i); resetAuto(); });
      pipsEl.appendChild(p);
    }
  }

  function resetAuto() {
    clearInterval(auto);
    auto = setInterval(() => go(cur + 1), 5000);
  }

  prevBtn.addEventListener('click', () => { go(cur - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { go(cur + 1); resetAuto(); });

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(auto));
  track.addEventListener('mouseleave', resetAuto);

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { go(dx < 0 ? cur + 1 : cur - 1); resetAuto(); }
  });

  window.addEventListener('resize', () => { cur = 0; buildPips(); go(0); });

  buildPips();
  resetAuto();
}

/* ════════════════════════════
   COOKIE
════════════════════════════ */
function initCookie() {
  if (!localStorage.getItem('bypab-consent')) {
    setTimeout(() => document.getElementById('cookie-banner')?.classList.remove('hidden'), 1400);
  }
}
window.cookieAccept  = () => { localStorage.setItem('bypab-consent', 'accepted');  document.getElementById('cookie-banner').classList.add('hidden'); };
window.cookieDecline = () => { localStorage.setItem('bypab-consent', 'declined'); document.getElementById('cookie-banner').classList.add('hidden'); };

/* ════════════════════════════
   LEGAL MODALS
════════════════════════════ */
window.openLegal  = p => { document.getElementById('legal-' + p).classList.add('open');    document.body.style.overflow = 'hidden'; };
window.closeLegal = p => { document.getElementById('legal-' + p).classList.remove('open'); document.body.style.overflow = ''; };
document.querySelectorAll('.legal-overlay').forEach(ov =>
  ov.addEventListener('click', e => { if (e.target === ov) window.closeLegal(ov.id.replace('legal-', '')); })
);

/* ════════════════════════════
   CONTACT FORM — Formspree
   Sends POST to Formspree API
   → forwards to pablochauvin1@gmail.com
   Email address is NEVER in the HTML
════════════════════════════ */
function initForm() {
  const form    = document.getElementById('contact-form');
  const btnEl   = document.getElementById('f-submit');
  const success = document.getElementById('form-success');
  const errEl   = document.getElementById('form-error');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const msg   = document.getElementById('f-msg').value.trim();
    const rgpd  = document.getElementById('f-rgpd').checked;

    if (!name || !email || !msg) { alert('Merci de remplir les champs obligatoires (*).'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Adresse email invalide.'); return; }
    if (!rgpd) { alert("Merci d'accepter la politique de confidentialité."); return; }

    btnEl.textContent = 'Envoi…';
    btnEl.classList.add('loading');
    success.classList.remove('visible');
    errEl.classList.remove('visible');

    // Build form data with all fields
    const body = new FormData();
    body.append('name',      name);
    body.append('email',     email);
    body.append('phone',     document.getElementById('f-phone').value   || 'Non renseigné');
    body.append('structure', document.getElementById('f-type').value    || 'Non renseigné');
    body.append('service',   document.getElementById('f-service').value || 'Non renseigné');
    body.append('message',   msg);
    // Honeypot anti-spam
    body.append('_gotcha', '');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        body,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        success.classList.add('visible');
        form.reset();
      } else {
        const data = await res.json();
        console.error('Formspree error:', data);
        errEl.classList.add('visible');
      }
    } catch (err) {
      console.error('Network error:', err);
      errEl.classList.add('visible');
    }

    btnEl.textContent = 'Envoyer le message';
    btnEl.classList.remove('loading');
  });
}

/* ════════════════════════════
   ESCAPE KEY
════════════════════════════ */
function initEscKey() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    window.closePModalDirect?.();
    window.closeCVModalDirect?.();
    ['mentions', 'confidentialite'].forEach(p => {
      if (document.getElementById('legal-' + p)?.classList.contains('open')) window.closeLegal(p);
    });
  });
}
