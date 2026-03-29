const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

const ensureContactFab = () => {
  let contactFab = document.querySelector(".contact-fab");
  if (contactFab) return contactFab;

  const footer = document.querySelector(".footer");
  if (!footer) return null;

  contactFab = document.createElement("div");
  contactFab.className = "contact-fab";
  contactFab.innerHTML = `
    <form class="callback-form" data-callback-form>
      <div class="field"><label for="cb-name">Ваше ім'я</label><input id="cb-name" type="text" placeholder="Як до вас звертатись"></div>
      <div class="field"><label for="cb-phone">Телефон</label><input id="cb-phone" type="tel" placeholder="+380"></div>
      <a class="btn btn-primary" href="tel:+380678003050">Замовити дзвінок</a>
    </form>
    <div class="fab-panel" data-fab-panel>
      <button class="fab-pill" type="button" data-callback-toggle>
        <span class="icon cb" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.3.57 3.53.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1c0 1.23.2 2.42.57 3.53a1 1 0 0 1-.24 1.01z" fill="currentColor"/>
          </svg>
        </span>
        Зворотній дзвінок
      </button>
      <a class="fab-pill" href="https://t.me/dsprints">
        <span class="icon tg" aria-hidden="true"><img src="https://cdn.simpleicons.org/telegram/FFFFFF" alt=""></span>
        Telegram
      </a>
      <a class="fab-pill" href="viber://chat?number=%2B380678003050">
        <span class="icon vb" aria-hidden="true"><img src="https://cdn.simpleicons.org/viber/FFFFFF" alt=""></span>
        Viber
      </a>
    </div>
    <button class="fab-trigger" type="button" data-fab-toggle aria-label="Повідомлення">
      <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9l-4.2 3.5A.5.5 0 0 1 4 19.1V16.5A2.5 2.5 0 0 1 1.5 14v-8A2.5 2.5 0 0 1 4 5.5Z" fill="currentColor"/>
      </svg>
    </button>
  `;
  footer.before(contactFab);
  return contactFab;
};

const cleanupDuplicateNavLinks = () => {
  document.querySelectorAll(".nav-links, .nav-menu").forEach((nav) => {
    const materialLinks = [...nav.querySelectorAll('a[href="materials.html"]')];
    if (materialLinks.length < 2) return;
    materialLinks.slice(1).forEach((link) => link.remove());
  });
};

cleanupDuplicateNavLinks();
ensureContactFab();

const fabToggle = document.querySelector("[data-fab-toggle]");
const fabPanel = document.querySelector("[data-fab-panel]");
const callbackToggle = document.querySelector("[data-callback-toggle]");
const callbackForm = document.querySelector("[data-callback-form]");

if (navToggle && navMenu) {
  const setNavOpen = (isOpen) => {
    navMenu.classList.toggle("open", isOpen);
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  };

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.addEventListener("click", () => setNavOpen(!navMenu.classList.contains("open")));
  navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNavOpen(false)));
  document.addEventListener("click", (event) => {
    if (!navMenu.classList.contains("open")) return;
    if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
    setNavOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) setNavOpen(false);
  });
}
if (fabToggle && fabPanel) fabToggle.addEventListener("click", () => fabPanel.classList.toggle("open"));
if (callbackToggle && callbackForm) callbackToggle.addEventListener("click", () => callbackForm.classList.toggle("open"));

const calculator = document.querySelector("[data-calculator]");
if (calculator) {
  const pricingData = window.PRINT_CALC_DATA || {};
  const materialLabel = calculator.querySelector("[data-material-label]");
  const totalNode = calculator.querySelector("[data-total]");
  const unitNode = calculator.querySelector("[data-unit]");
  const areaNode = calculator.querySelector("[data-area]");
  const summaryNode = calculator.querySelector("[data-summary]");
  const widthNode = calculator.querySelector("#customWidth");
  const heightNode = calculator.querySelector("#customHeight");
  const quantityNode = calculator.querySelector("#quantity");
  const kindCountNode = calculator.querySelector("#kindCount");
  const presetButtons = calculator.querySelectorAll("[data-size]");
  const stepButtons = calculator.querySelectorAll("[data-step-target]");
  const finishPanel = calculator.querySelector("[data-finish-panel]");
  const materialPanel = calculator.querySelector("[data-material-panel]");
  const materialButtons = calculator.querySelectorAll('[data-option-group="material"] .option-pill');

  const materials = {
    upmMatte: { label: "UPM біла матова без просічки", factor: 1, category: "whiteFilm" },
    ritramaClear: { label: "Ritrama прозора глянець", factor: 1.02, category: "clearFilm" },
    ritramaWhite: { label: "Ritrama біла глянець", factor: 1.01, category: "whiteFilm" },
    paperSlits: { label: "Самоклеючий папір з надсічками UPM Raflatac", factor: 1, category: "paper" },
    woodstock: { label: "Woodstock Betulla кремовий", factor: 1.02, category: "designer" },
    waterproof: { label: "Waterproof White вологостійкий", factor: 1.03, category: "whiteFilm" },
    kraft: { label: "UPM бурий крафт смугастий", factor: 1.01, category: "designer" },
    tintoretto: { label: "Tintoretto Angora світло-сірий", factor: 1.03, category: "designer" },
    sirio: { label: "Sirio Pearl Ice White", factor: 1.05, category: "designer" },
    silver: { label: "Lam Foil Matt Silver", factor: 1.04, category: "designer" },
    embossed: { label: "Embossed Coated Skin", factor: 1.03, category: "designer" },
    snow: { label: "Constellation Snow Vergata", factor: 1.04, category: "designer" },
    jade: { label: "Constellation Jade Raster", factor: 1.05, category: "designer" },
    antiquaWhite: { label: "Antiqua White верже", factor: 1.03, category: "designer" },
    antiquaIvory: { label: "Antiqua Ivory верже", factor: 1.03, category: "designer" },
    acquerello: { label: "Acquerello Avorio мікровельвет", factor: 1.04, category: "designer" }
  };

  const printModes = {
    blank: { label: "Без друку", base: 2818 },
    bw1: { label: "Чорно-білий односторонній", base: 3033 },
    color1: { label: "Повноколірний односторонній", base: 3335 }
  };

  const cutModes = {
    trim: { label: "Порізка в формат", adjust: 0 },
    pieceTrim: { label: "Порізка поштучно", adjust: 60 },
    digitalContour: { label: "Фігурна порізка (по контуру)", adjust: 185 }
  };

  const finishModes = {
    none: { label: "Без покриття", adjust: 0 },
    glossLam: { label: "Одностороння глянцева ламінація", adjust: 110 },
    matteLam: { label: "Одностороння матова ламінація", adjust: 130 },
    softTouch: { label: "Одностороння soft touch", adjust: 160 }
  };

  const sheetProfiles = pricingData.sheetProfiles || {};
  const materialPricing = pricingData.materials || {};
  const printPricing = pricingData.printModes || {};
  const cutPricing = pricingData.cutModes || {};
  const finishPricing = pricingData.finishModes || {};

  const selected = { materialCategory: "paper", material: "paperSlits", print: "color1", cut: "pieceTrim", finish: "none" };
  const fallbackValues = { print: "blank", finish: "none" };

  const syncMaterialCategory = () => {
    if (materialPanel) materialPanel.hidden = !selected.materialCategory;
    calculator.querySelectorAll('[data-option-group="materialCategory"] .option-pill').forEach((button) => {
      button.classList.toggle("active", button.dataset.value === selected.materialCategory);
    });
    materialButtons.forEach((button) => {
      const visible = !!selected.materialCategory && button.dataset.materialCategory === selected.materialCategory;
      button.hidden = !visible;
      button.classList.toggle("active", visible && !!selected.material && button.dataset.value === selected.material);
    });
  };

  calculator.querySelectorAll("[data-option-group]").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest(".option-pill");
      if (!button) return;
      const groupName = group.dataset.optionGroup;
      if (groupName === "materialCategory") {
        const isSame = selected.materialCategory === button.dataset.value;
        group.querySelectorAll(".option-pill").forEach((item) => item.classList.remove("active"));
        if (isSame) {
          selected.materialCategory = "";
          selected.material = "";
          syncMaterialCategory();
          calculate();
          return;
        }
        button.classList.add("active");
        selected.materialCategory = button.dataset.value;
        selected.material = "";
        syncMaterialCategory();
        if (materialPanel) {
          requestAnimationFrame(() => {
            materialPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
          });
        }
        calculate();
        return;
      }
      if (groupName === "material") {
        const isSame = selected.material === button.dataset.value;
        group.querySelectorAll(".option-pill").forEach((item) => item.classList.remove("active"));
        if (isSame) {
          selected.material = "";
          calculate();
          return;
        }
        button.classList.add("active");
        selected.material = button.dataset.value;
        calculate();
        return;
      }
      const isSame = selected[groupName] === button.dataset.value;
      group.querySelectorAll(".option-pill").forEach((item) => item.classList.remove("active"));
      if (isSame && fallbackValues[groupName]) {
        selected[groupName] = fallbackValues[groupName];
        const fallbackButton = group.querySelector(`[data-value="${fallbackValues[groupName]}"]`);
        if (fallbackButton) fallbackButton.classList.add("active");
      } else {
        button.classList.add("active");
        selected[groupName] = button.dataset.value;
      }
      calculate();
    });
  });

  syncMaterialCategory();

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const [w, h] = button.dataset.size.split("x").map(Number);
      widthNode.value = w;
      heightNode.value = h;
      calculate();
    });
  });

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = calculator.querySelector(`#${button.dataset.stepTarget}`);
      const step = Number(button.dataset.step);
      const min = Number(target.min || 0);
      const max = Number(target.max || Number.MAX_SAFE_INTEGER);
      const currentValue = target.value === "" ? (step > 0 ? min : min) : Number(target.value);
      target.value = Math.min(Math.max(currentValue + step, min), max);
      calculate();
    });
  });

  const roundMoney = (value) => `${Math.round(value).toLocaleString("uk-UA")} грн`;
  const formatUnit = (value) => `${value.toFixed(2).replace(".", ",")} грн/шт`;
  const getInputValue = (node) => {
    if (node.value === "") return null;
    const raw = Number(node.value);
    return Number.isFinite(raw) ? raw : null;
  };
  const clampInputValue = (node, { writeBack = true } = {}) => {
    const parsedValue = getInputValue(node);
    if (parsedValue === null) return null;
    const min = Number(node.min || 0);
    const max = Number(node.max || Number.MAX_SAFE_INTEGER);
    const safeValue = Math.min(Math.max(parsedValue, min), max);
    if (writeBack) node.value = safeValue;
    return safeValue;
  };
  const getFitCount = (sheetWidth, sheetHeight, itemWidth, itemHeight) => {
    if (!itemWidth || !itemHeight) return 0;
    const normal = Math.floor(sheetWidth / itemWidth) * Math.floor(sheetHeight / itemHeight);
    const rotated = Math.floor(sheetWidth / itemHeight) * Math.floor(sheetHeight / itemWidth);
    return Math.max(normal, rotated);
  };
  const getVolumeRate = (config, sheetCount) => {
    if (!config) return 0;
    const minSheets = config.minSheets || 1;
    const maxSheets = config.maxSheets || 500;
    const maxPerSheet = config.maxPerSheet || 0;
    const minPerSheet = config.minPerSheet || 0;
    if (sheetCount <= minSheets) return maxPerSheet;
    if (sheetCount >= maxSheets) return minPerSheet;
    const progress = (sheetCount - minSheets) / Math.max(maxSheets - minSheets, 1);
    return maxPerSheet - (maxPerSheet - minPerSheet) * progress;
  };
  const getVolumeCharge = (config, sheetCount) => {
    if (!config || !sheetCount) return 0;
    if (Array.isArray(config.curve) && config.curve.length) {
      const points = [...config.curve].sort((a, b) => a.sheets - b.sheets);
      if (sheetCount <= points[0].sheets) return points[0].total;
      for (let i = 1; i < points.length; i += 1) {
        const prev = points[i - 1];
        const next = points[i];
        if (sheetCount <= next.sheets) {
          const progress = (sheetCount - prev.sheets) / Math.max(next.sheets - prev.sheets, 1);
          return prev.total + (next.total - prev.total) * progress;
        }
      }
      const last = points[points.length - 1];
      const prev = points[points.length - 2] || last;
      const tailRate = (last.total - prev.total) / Math.max(last.sheets - prev.sheets, 1);
      return last.total + (sheetCount - last.sheets) * tailRate;
    }
    const rate = getVolumeRate(config, sheetCount);
    const setupFee = config.setupFee || 0;
    const minCharge = config.minCharge || 0;
    return Math.max(setupFee + rate * sheetCount, minCharge);
  };

  const calculate = () => {
    const width = clampInputValue(widthNode, { writeBack: false });
    const height = clampInputValue(heightNode, { writeBack: false });
    const quantity = clampInputValue(quantityNode, { writeBack: false });
    const kindCount = clampInputValue(kindCountNode, { writeBack: false });

    const material = selected.material ? materials[selected.material] : null;
    const print = printModes[selected.print];
    const cut = cutModes[selected.cut] || cutModes.trim;
    const finish = finishModes[selected.finish] || finishModes.none;

    areaNode.textContent = width && height ? `${width}×${height} мм` : "—";

    if (!material) {
      totalNode.textContent = "Оберіть матеріал для друку";
      unitNode.textContent = "—";
      materialLabel.textContent = "не вибрано";
      summaryNode.innerHTML = [
        "Матеріал: не вибрано",
        `Друк: ${print.label}`,
        `Порізка: ${cut.label}`,
          `Покриття: ${finish.label}`,
          `Тираж: ${quantity.toLocaleString("uk-UA")} шт`,
          `Різних видів: ${kindCount}`
      ].map((line) => `<div>${line}</div>`).join("");
      return;
    }

    if (!width || !height || !quantity || !kindCount) {
      totalNode.textContent = "Заповніть розміри, тираж і види";
      unitNode.textContent = "—";
      materialLabel.textContent = material.label;
      summaryNode.innerHTML = [
        `Матеріал: ${material.label}`,
        `Друк: ${print.label}`,
        `Порізка: ${cut.label}`,
        `Покриття: ${finish.label}`,
        `Тираж: ${quantity ? `${quantity.toLocaleString("uk-UA")} шт` : "не вказано"}`,
        `Різних видів: ${kindCount || "не вказано"}`,
        `Розмір: ${width && height ? `${width}×${height} мм` : "не вказано"}`
      ].map((line) => `<div>${line}</div>`).join("");
      return;
    }

    const pricingMaterial = materialPricing[selected.material] || {};
    const profile = sheetProfiles[pricingMaterial.profile] || null;
    if (!profile) {
      totalNode.textContent = "Немає даних по матеріалу";
      unitNode.textContent = "—";
      materialLabel.textContent = material.label;
      summaryNode.innerHTML = "<div>Для цього матеріалу ще не задані параметри листа.</div>";
      return;
    }

    const technicalWidth = width + profile.cutMargin * 2;
    const technicalHeight = height + profile.cutMargin * 2;
    const itemsPerSheet = getFitCount(profile.printWidth, profile.printHeight, technicalWidth, technicalHeight);
    const qtyPerKind = Math.ceil(quantity / kindCount);
    const sheetsPerKind = itemsPerSheet > 0 ? Math.ceil(qtyPerKind / itemsPerSheet) : 0;
    const totalSheets = sheetsPerKind * kindCount;
    const sheetCost = pricingMaterial.sheetCost || 0;
    const printConfig = printPricing[selected.print] || {};
    const cutConfig = cutPricing[selected.cut] || cutPricing.trim || {};
    const finishConfig = finishPricing[selected.finish] || {};
    const printCharge = getVolumeCharge(printConfig, totalSheets);
    const cutCharge = getVolumeCharge(cutConfig, totalSheets);
    const finishCharge = getVolumeCharge(finishConfig, totalSheets);
    const materialCharge = totalSheets * sheetCost;
    const total = materialCharge + printCharge + cutCharge + finishCharge;

    totalNode.textContent = roundMoney(total);
    unitNode.textContent = formatUnit(total / quantity);
    materialLabel.textContent = material.label;
    summaryNode.innerHTML = [
      `Матеріал: ${material.label}`,
      `Профіль листа: ${profile.label} ${profile.stockWidth}×${profile.stockHeight} мм`,
      `Область друку: ${profile.printWidth}×${profile.printHeight} мм`,
      `Технічний розмір стікера: ${technicalWidth}×${technicalHeight} мм`,
      `На лист лягає: ${itemsPerSheet} шт`,
      `Листів на 1 вид: ${sheetsPerKind}`,
      `Всього листів: ${totalSheets}`,
      `Ціна листа: ${sheetCost.toFixed(2).replace(".", ",")} грн`,
      `Матеріал разом: ${roundMoney(materialCharge)}`,
      `Друк разом: ${roundMoney(printCharge)}`,
      `Порізка разом: ${roundMoney(cutCharge)}`,
      `Покриття разом: ${roundMoney(finishCharge)}`,
      `Друк: ${print.label}`,
      `Порізка: ${cut.label}`,
      `Покриття: ${finish.label}`,
      `Тираж: ${quantity.toLocaleString("uk-UA")} шт`,
      `Різних видів: ${kindCount}`
    ].map((line) => `<div>${line}</div>`).join("");
  };

  [widthNode, heightNode, quantityNode, kindCountNode].forEach((item) => {
    item.addEventListener("input", calculate);
    item.addEventListener("change", () => {
      clampInputValue(item);
      calculate();
    });
  });

  calculate();
}

const filters = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-gallery-item]");
if (filters.length && galleryItems.length) {
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const current = button.dataset.filter;
      galleryItems.forEach((card) => { card.hidden = current !== "all" && card.dataset.category !== current; });
    });
  });
}

const materialFilterButtons = document.querySelectorAll("[data-material-filter]");
const materialCards = document.querySelectorAll("[data-material-card]");
if (materialFilterButtons.length && materialCards.length) {
  const filterRow = document.querySelector("[data-material-filters]");
  const materialListHint = (() => {
    if (!filterRow) return null;
    const hint = document.createElement("div");
    hint.className = "material-hint";
    hint.hidden = true;
    hint.textContent = "Нижче відкрився список матеріалів.";
    filterRow.after(hint);
    return hint;
  })();

  const applyMaterialFilter = (filter) => {
    materialFilterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.materialFilter === filter);
    });

    materialCards.forEach((card) => {
      card.hidden = card.dataset.materialCard !== filter;
    });

    if (materialListHint) materialListHint.hidden = false;
  };

  const defaultMaterialFilter =
    Array.from(materialFilterButtons).find((button) => button.classList.contains("active")) ||
    materialFilterButtons[0];

  if (defaultMaterialFilter) {
    applyMaterialFilter(defaultMaterialFilter.dataset.materialFilter);
  }

  materialFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyMaterialFilter(button.dataset.materialFilter);
      const firstVisibleCard = [...materialCards].find((card) => !card.hidden);
      if (firstVisibleCard) {
        requestAnimationFrame(() => {
          firstVisibleCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    });
  });
}

const lightbox = document.querySelector("[data-lightbox]");
const lightboxPreview = document.querySelector("[data-lightbox-preview]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxButtons = document.querySelectorAll("[data-lightbox-image]");

if (lightbox && lightboxPreview && lightboxButtons.length) {
  const openLightbox = (button) => {
    lightboxPreview.src = button.dataset.lightboxImage;
    lightboxPreview.alt = button.dataset.lightboxAlt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxPreview.src = "";
    lightboxPreview.alt = "";
    document.body.style.overflow = "";
  };

  lightboxButtons.forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

const initRevealAnimations = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealGroups = [
    [".hero-chip", "reveal reveal-scale"],
    [".hero-title", "reveal reveal-up"],
    [".hero-sub", "reveal reveal-up"],
    [".hero-actions > *", "reveal reveal-up"],
    [".hero-stats .hero-stat", "reveal reveal-up"],
    [".big-card", "reveal reveal-up"],
    [".card", "reveal reveal-up"],
    [".use-case-card", "reveal reveal-up"],
    [".feature", "reveal reveal-scale"],
    [".mosaic-card", "reveal reveal-scale"],
    [".catalog-card", "reveal reveal-up"],
    [".materials-card", "reveal reveal-up"],
    [".footer-grid > *", "reveal reveal-up"]
  ];

  const nodes = [];
  revealGroups.forEach(([selector, classes]) => {
    document.querySelectorAll(selector).forEach((node, index) => {
      if (node.dataset.revealReady === "true") return;
      classes.split(" ").forEach((className) => node.classList.add(className));
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        node.style.setProperty("--reveal-delay", `${Math.min(index * (isMobile ? 8 : 70), isMobile ? 32 : 420)}ms`);
      node.dataset.revealReady = "true";
      nodes.push(node);
    });
  });

  if (!nodes.length) return;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
      {
        threshold: window.matchMedia("(max-width: 767px)").matches ? 0.01 : 0.14,
        rootMargin: window.matchMedia("(max-width: 767px)").matches ? "0px 0px -12% 0px" : "0px 0px -8% 0px"
      }
  );

  nodes.forEach((node) => observer.observe(node));
};

initRevealAnimations();

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
});
