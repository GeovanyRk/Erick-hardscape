(function () {
  "use strict";

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---------- Splash ---------- */
  function initSplash() {
    const splash = $("[data-splash]");
    if (!splash) return;
    const hide = () => splash.classList.add("is-out");
    if (document.readyState === "complete") setTimeout(hide, 500);
    else window.addEventListener("load", () => setTimeout(hide, 350));
    setTimeout(hide, 3200);
  }

  /* ---------- Nav ---------- */
  function initNav() {
    const nav = $("[data-nav]");
    if (nav) {
      const on = () => { if (scrollY > 60) nav.classList.add("is-scrolled"); else nav.classList.remove("is-scrolled"); };
      on();
      window.addEventListener("scroll", on, { passive: true });
    }
    const burger = $("[data-nav-burger]");
    const mobile = $("[data-nav-mobile]");
    if (burger && mobile) {
      burger.addEventListener("click", () => {
        const open = burger.getAttribute("aria-expanded") === "true";
        burger.setAttribute("aria-expanded", String(!open));
        mobile.setAttribute("aria-hidden", String(open));
      });
      $$("a", mobile).forEach(a => a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        mobile.setAttribute("aria-hidden", "true");
      }));
    }
  }

  /* ---------- Smooth anchors (native scroll) ---------- */
  function initSmoothAnchors() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const navOffset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(el => io.observe(el));

    setTimeout(() => {
      $$("[data-reveal]:not(.is-revealed)").forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  function initRevealMask() {
    const els = $$("[data-reveal-mask]");
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(el => io.observe(el));

    setTimeout(() => {
      $$("[data-reveal-mask]:not(.is-revealed)").forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------- Split text ---------- */
  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    const wrap = text => text.split(/(\s+)/).map(w =>
      /^\s+$/.test(w) ? w : `<span class="split-word" aria-hidden="true">${escHTML(w)}</span>`
    ).join("");
    const html = Array.from(el.childNodes).map(node => {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        return `<${tag}>${wrap(node.textContent)}</${tag}>`;
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return el.querySelectorAll(".split-word");
  }

  function initSplitText() {
    if (!window.gsap) return;
    $$("[data-split]").forEach(el => {
      const parts = splitWords(el);
      if (el.classList.contains("reveal")) el.classList.remove("reveal");
      gsap.set(parts, { y: 20, opacity: 0 });
      const run = () => gsap.to(parts, { y: 0, opacity: 1, duration: 0.9, stagger: 0.03, ease: "expo.out" });
      if (window.ScrollTrigger) {
        gsap.to(parts, {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.03, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      } else {
        run();
      }
    });
  }

  /* ---------- Tilt 3D ---------- */
  function initTilt() {
    if (!fineHover) return;
    $$(".service-card, .featured-figure").forEach(card => {
      const MAX = 6;
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.classList.add("has-tilt");
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ---------- Hero parallax ---------- */
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger || reduced) return;
    const heroBg = $(".hero-bg");
    const heroContent = $(".hero-inner");
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 18, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
    if (heroContent) {
      gsap.to(heroContent, {
        yPercent: -25, opacity: 0.2, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
  }

  /* ---------- Showcase pinned horizontal (services) ---------- */
  function initShowcasePinned() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const sec = $(".showcase");
    const track = $("[data-showcase]");
    if (!sec || !track) return;

    const setup = () => {
      ScrollTrigger.getAll().forEach(s => { if (s.vars.id === "showcase-pin") s.kill(); });
      gsap.set(track, { x: 0 });
      const isDesktop = innerWidth >= 1024;
      sec.classList.toggle("is-pinned", isDesktop);
      if (!isDesktop) return;
      const distance = track.scrollWidth - innerWidth + 32;
      if (distance <= 0) return;

      gsap.to(track, {
        x: () => -distance, ease: "none",
        scrollTrigger: {
          id: "showcase-pin",
          trigger: sec, start: "top top+=72",
          end: () => "+=" + (distance + innerHeight * 0.4),
          pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
    };

    setup();
    let to;
    window.addEventListener("resize", () => {
      clearTimeout(to);
      to = setTimeout(() => { ScrollTrigger.refresh(); setup(); }, 250);
    });
  }

  /* ---------- Count up ---------- */
  function initCountUp() {
    const done = new Set();
    $$("[data-count-to]").forEach(el => {
      const target = parseFloat(el.dataset.countTo);
      const trigger = () => {
        if (done.has(el)) return;
        done.add(el);
        if (window.gsap) {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target, duration: 1.4, ease: "power2.out",
            onUpdate: () => { el.textContent = Math.round(obj.v); },
          });
        } else {
          el.textContent = target;
        }
      };
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { trigger(); io.unobserve(e.target); } });
      }, { threshold: 0.05 });
      io.observe(el);

      setTimeout(() => {
        if (!done.has(el) && el.getBoundingClientRect().top < innerHeight) trigger();
      }, 6000);
    });
  }

  /* ---------- Contact form ---------- */
  function setupContactForm() {
    const form = $("[data-contact-form]");
    const success = $("[data-contact-success]");
    if (!form || !success) return;
    const submitBtn = $("[type=submit]", form);
    const msg = $("[data-contact-success-msg]");
    const errorBox = $("[data-contact-error]", form.closest(".cta-form-wrap") || document);

    function showError(isEs) {
      form.classList.remove("is-sending");
      form.classList.add("is-error");
      submitBtn.disabled = false;
      if (errorBox) {
        errorBox.textContent = isEs
          ? "No pudimos enviar tu solicitud. Intenta de nuevo o llámanos al (336) 306-3941."
          : "We couldn't send your request. Please try again, or call us at (336) 306-3941.";
        errorBox.classList.add("is-visible");
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (form.classList.contains("is-sending")) return;
      if (!form.reportValidity()) return;

      const isEs = document.documentElement.getAttribute("data-lang") === "es";

      form.classList.remove("is-error");
      if (errorBox) errorBox.classList.remove("is-visible");
      form.classList.add("is-sending");
      submitBtn.disabled = true;

      const endpoint = form.getAttribute("action");
      if (!endpoint) { showError(isEs); return; }
      const body = new FormData(form);

      fetch(endpoint, {
        method: "POST",
        body,
        headers: { "Accept": "application/json" },
      })
        .then(res => res.json().catch(() => null).then(json => ({ ok: res.ok, json })))
        .then(({ ok, json }) => {
          // Formspree does not use our old {success:true} shape. Success is the
          // HTTP response itself being OK, with a parseable JSON body and no
          // Formspree-reported errors. Any other outcome (bad status, unparseable
          // body, or an explicit errors[] from Formspree) falls through to the
          // existing error state — never a false success.
          const hasFormspreeErrors =
            json &&
            Array.isArray(json.errors) &&
            json.errors.length > 0;

          if (!ok || hasFormspreeErrors) {
            showError(isEs);
            return;
          }
          const firstName = (form.elements.name.value || "").trim().split(/\s+/)[0] || (isEs ? "Hola" : "Hi");
          if (msg) {
            msg.textContent = isEs
              ? `${firstName}, tu solicitud fue enviada correctamente. Te contactaremos pronto para coordinar la visita.`
              : `${firstName}, your request has been submitted. We'll be in touch shortly to schedule a visit.`;
          }
          form.classList.remove("is-sending");
          form.classList.add("is-sent");
          success.setAttribute("aria-hidden", "false");
          success.classList.add("is-visible");
        })
        .catch(() => showError(isEs));
    });
  }

  /* ---------- Language toggle (EN default, ES secondary) ---------- */
  function cacheI18nBaseline() {
    $$("[data-es]").forEach(el => {
      if (!el.hasAttribute("data-en-cache")) el.setAttribute("data-en-cache", el.innerHTML);
    });
  }

  function initLangToggle() {
    const STORAGE_KEY = "msw-lang";
    const nodes = $$("[data-es]");
    if (!nodes.length) return;

    const titleEn = document.title;
    const titleEs = document.documentElement.getAttribute("data-title-es") || titleEn;
    const metaDesc = $('meta[name="description"]');
    const descEn = metaDesc ? metaDesc.getAttribute("content") : null;
    const descEs = metaDesc ? metaDesc.getAttribute("data-es") : null;

    function refreshSplit(el) {
      if (!window.gsap || !el.hasAttribute("data-split")) return;
      const parts = splitWords(el);
      gsap.set(parts, { y: 0, opacity: 1 });
    }

    function apply(lang, persist) {
      nodes.forEach(el => {
        const next = lang === "es" ? el.getAttribute("data-es") : el.getAttribute("data-en-cache");
        if (next != null) el.innerHTML = next;
        refreshSplit(el);
      });
      document.documentElement.setAttribute("lang", lang === "es" ? "es" : "en");
      document.documentElement.setAttribute("data-lang", lang);
      if (metaDesc) metaDesc.setAttribute("content", lang === "es" && descEs ? descEs : descEn);
      document.title = lang === "es" ? titleEs : titleEn;
      $$("[data-lang-btn]").forEach(btn => {
        const active = btn.getAttribute("data-lang-btn") === lang;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }
    }

    $$("[data-lang-btn]").forEach(btn => {
      btn.addEventListener("click", () => apply(btn.getAttribute("data-lang-btn"), true));
    });

    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === "es") apply("es", false);
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const el = $("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(cacheI18nBaseline, "cacheI18nBaseline");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initRevealMask, "initRevealMask");
    safe(initTilt, "initTilt");
    safe(setupContactForm, "setupContactForm");
    safe(initYear, "initYear");

    if (window.gsap) {
      if (window.ScrollTrigger) {
        try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
      }
      safe(initSplitText, "initSplitText");
      safe(initHeroParallax, "initHeroParallax");
      safe(initShowcasePinned, "initShowcasePinned");
      safe(initCountUp, "initCountUp");
    } else {
      safe(initCountUp, "initCountUp");
    }

    safe(initLangToggle, "initLangToggle");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
