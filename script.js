document.addEventListener("DOMContentLoaded", () => {
  // 1. Año actual en footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Barra de progreso de lectura + sombra en header
  const scrollProgress = document.getElementById("scrollProgress");
  const siteHeader = document.getElementById("siteHeader");

  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${pct}%`;
    }
    if (siteHeader) {
      siteHeader.classList.toggle("scrolled", scrollTop > 16);
    }
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // 3. Menú hamburguesa móvil
  const burgerBtn = document.getElementById("burgerBtn");
  const navDrawer = document.getElementById("navDrawer");

  if (burgerBtn && navDrawer) {
    burgerBtn.addEventListener("click", () => {
      const isOpen = navDrawer.classList.toggle("open");
      burgerBtn.classList.toggle("open", isOpen);
      burgerBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navDrawer.classList.remove("open");
        burgerBtn.classList.remove("open");
        burgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 4. Efecto 3D sutil en tarjeta de presentación
  const tiltCard = document.getElementById("tiltCard");
  if (tiltCard && window.matchMedia("(pointer: fine)").matches) {
    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = x * 12;
      const rotateX = -y * 12;
      tiltCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }

  // 5. IntersectionObserver para animaciones de entrada (scroll reveal)
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach((el, idx) => {
      el.style.transitionDelay = `${Math.min(idx % 3, 2) * 70}ms`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // 6. Filtro de galería por categoría
  const filterPills = document.querySelectorAll(".filter-pill");
  const photoCards = document.querySelectorAll(".photo-card");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const selectedFilter = pill.dataset.filter;

      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      photoCards.forEach((card) => {
        const matches = selectedFilter === "all" || card.dataset.category === selectedFilter;
        card.classList.toggle("is-hidden", !matches);
        if (matches) {
          card.classList.add("visible");
        }
      });
    });
  });

  // 7. Lightbox para ampliar fotos al hacer clic
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".photo-frame").forEach((frame) => {
    frame.addEventListener("click", () => {
      const img = frame.querySelector("img");
      const figcaption = frame.closest(".photo-card")?.querySelector("figcaption");
      if (!img || !lightbox || !lightboxImg) return;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption && figcaption) {
        const title = figcaption.querySelector("strong")?.textContent || "";
        const desc = figcaption.querySelector("span")?.textContent || "";
        lightboxCaption.textContent = desc ? `${title} — ${desc}` : title;
      }
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });

  // 8. Acordeón de preguntas frecuentes
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
    });
  });
});
