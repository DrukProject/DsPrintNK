const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const root = document.documentElement;
const THEME_STORAGE_KEY = "dsprintTheme";
const systemThemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

const getStoredTheme = () => {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
  return systemThemeQuery?.matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const labelNode = button.querySelector("[data-theme-label]");
    button.dataset.nextTheme = nextTheme;
    button.setAttribute("aria-label", theme === "dark" ? "Увімкнути світлу тему" : "Увімкнути темну тему");
    if (labelNode) labelNode.textContent = theme === "dark" ? "Світла" : "Темна";
  });
};

const persistTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
};

const createThemeToggle = () => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle";
  button.dataset.themeToggle = "true";
  button.innerHTML = `
    <span class="theme-toggle-icon" aria-hidden="true"></span>
    <span class="theme-toggle-label" data-theme-label>Тема</span>
  `;
  button.addEventListener("click", () => {
    const nextTheme = button.dataset.nextTheme || "dark";
    persistTheme(nextTheme);
    applyTheme(nextTheme);
  });
  return button;
};

const telegramFooterIconSrc = "https://cdn.simpleicons.org/telegram/229ED9";
const viberFooterIconSrc = "https://cdn.simpleicons.org/viber/7360F2";
const telegramWhiteIconSrc = "assets/icon-telegram-white.svg";
const viberWhiteIconSrc = "assets/icon-viber-white.svg";

const getFooterSocialMarkup = () => `
  <div class="footer-social">
    <a class="social-pill" href="https://t.me/dsprints" aria-label="Telegram">
      <img src="${telegramFooterIconSrc}" alt="Telegram">
    </a>
    <a class="social-pill" href="viber://chat?number=%2B380678003050" aria-label="Viber">
      <img src="${viberFooterIconSrc}" alt="Viber">
    </a>
  </div>
`;

const injectThemeToggles = () => {
  document.querySelectorAll(".nav-links, .nav-menu").forEach((nav) => {
    if (!nav || nav.querySelector("[data-theme-toggle]")) return;
    nav.append(createThemeToggle());
  });
};

const ensureFooterSocial = () => {
  const footerLead = document.querySelector(".footer .footer-grid > div:first-child");
  if (!footerLead) return null;

  const existingSocial = footerLead.querySelector(".footer-social");
  if (existingSocial) {
    existingSocial.outerHTML = getFooterSocialMarkup();
    return footerLead.querySelector(".footer-social");
  }

  footerLead.insertAdjacentHTML("beforeend", getFooterSocialMarkup());
  return footerLead.querySelector(".footer-social");
};

injectThemeToggles();
applyTheme(getPreferredTheme());
ensureFooterSocial();

if (systemThemeQuery) {
  systemThemeQuery.addEventListener("change", () => {
    if (getStoredTheme()) return;
    applyTheme(getPreferredTheme());
  });
}

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
        Зворотний дзвінок
      </button>
      <a class="fab-pill" href="https://t.me/dsprints">
        <span class="icon tg" aria-hidden="true"><img src="${telegramWhiteIconSrc}" alt=""></span>
        Telegram
      </a>
      <a class="fab-pill" href="viber://chat?number=%2B380678003050">
        <span class="icon vb" aria-hidden="true"><img src="${viberWhiteIconSrc}" alt=""></span>
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

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

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
if (calculator && window.StickerSheetCalculator) {
  const pricingData = window.PRINT_CALC_DATA || {};
  const calculatorEngine = window.StickerSheetCalculator;
  const materialLabel = calculator.querySelector("[data-material-label]");
  const totalNode = calculator.querySelector("[data-total]");
  const unitNode = calculator.querySelector("[data-unit]");
  const areaNode = calculator.querySelector("[data-area]");
  const kindCountSummaryNode = calculator.querySelector("[data-kind-count]");
  const summaryNode = calculator.querySelector("[data-summary]");
  const selectionSummaryNode = calculator.querySelector("[data-selection-summary]");
  const resultCard = calculator.querySelector("[data-result-card]");
  const widthNode = calculator.querySelector("#customWidth");
  const heightNode = calculator.querySelector("#customHeight");
  const quantityNode = calculator.querySelector("#quantity");
  const kindCountNode = calculator.querySelector("#kindCount");
  const presetButtons = calculator.querySelectorAll("[data-size]");
  const stepButtons = calculator.querySelectorAll("[data-step-target]");
  const materialPanel = calculator.querySelector("[data-material-panel]");
  const materialButtons = calculator.querySelectorAll('[data-option-group="material"] .option-pill');

  const materials = {
    upmMatte: { label: "UPM біла матова без просічки", category: "whiteFilm" },
    ritramaClear: { label: "Ritrama прозора глянець", category: "clearFilm" },
    ritramaWhite: { label: "Ritrama біла глянець", category: "whiteFilm" },
    paperSlits: { label: "Самоклеючий папір з надсічками UPM Raflatac", category: "paper" },
    woodstock: { label: "Woodstock Betulla кремовий", category: "designer" },
    waterproof: { label: "Waterproof White вологостійкий", category: "whiteFilm" },
    kraft: { label: "UPM бурий крафт смугастий", category: "designer" },
    tintoretto: { label: "Tintoretto Angora світло сірий", category: "designer" },
    sirio: { label: "Sirio Pearl Ice White", category: "designer" },
    silver: { label: "Lam Foil Matt Silver", category: "designer" },
    embossed: { label: "Embossed Coated Skin", category: "designer" },
    snow: { label: "Constellation Snow Vergata", category: "designer" },
    jade: { label: "Constellation Jade Raster", category: "designer" },
    antiquaWhite: { label: "Antiqua White", category: "designer" },
    antiquaIvory: { label: "Antiqua Ivory", category: "designer" },
    acquerello: { label: "Acquerello Avorio", category: "designer" }
  };

  const printModes = pricingData.printModes || {};
  const cutModes = pricingData.cutModes || {};
  const finishModes = pricingData.finishModes || {};
  const selected = { materialCategory: "paper", material: "paperSlits", print: "color1", cut: "pieceTrim", finish: "none" };
  const fallbackValues = { print: "blank", finish: "none" };
  const finishButtons = calculator.querySelectorAll('[data-option-group="finish"] .option-pill');

  const roundMoney = (value) => `${Math.round(value).toLocaleString("uk-UA")} грн`;
  const formatMoney = (value) => `${value.toFixed(2).replace(".", ",")} грн`;
  const formatUnit = (value) => `${value.toFixed(2).replace(".", ",")} грн/шт`;
  const formatSize = (width, height) => `${width}×${height} мм`;

  const setResultTone = (tone) => {
    if (!resultCard) return;
    resultCard.dataset.tone = tone || "default";
  };

  const saveOrderDraft = (draft) => {
    try {
      window.sessionStorage.setItem("dsprintOrderDraft", JSON.stringify(draft));
    } catch {}
  };

  const sanitizeDigits = (value) => String(value || "").replace(/\D+/g, "");
  const bindDigitsOnlyInput = (node) => {
    if (!node) return;

    node.addEventListener("beforeinput", (event) => {
      if (!event.data) return;
      if (/^\d+$/.test(event.data)) return;
      event.preventDefault();
    });

    node.addEventListener("input", () => {
      const sanitized = sanitizeDigits(node.value);
      if (node.value !== sanitized) node.value = sanitized;
    });
  };

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

  const setSelectionSummary = (parts) => {
    if (!selectionSummaryNode) return;
    if (!parts.length) {
      selectionSummaryNode.innerHTML = '<span class="calc-selection-empty">Оберіть параметри, і тут з\'явиться короткий підсумок.</span>';
      return;
    }
    selectionSummaryNode.innerHTML = parts.map((part) => `<span class="calc-selection-pill">${escapeHtml(part)}</span>`).join("");
  };

  const setSummaryLines = (lines) => {
    if (!summaryNode) return;
    summaryNode.innerHTML = lines.map((line) => `<div>${escapeHtml(line)}</div>`).join("");
  };

  const syncMaterialCategory = () => {
    if (materialPanel) materialPanel.hidden = !selected.materialCategory;
    calculator.querySelectorAll('[data-option-group="materialCategory"] .option-pill').forEach((button) => {
      button.classList.toggle("active", button.dataset.value === selected.materialCategory);
    });
    materialButtons.forEach((button) => {
      const visible = !!selected.materialCategory && button.dataset.materialCategory === selected.materialCategory;
      button.hidden = !visible;
      button.classList.toggle("active", visible && button.dataset.value === selected.material);
    });
  };

  const getLabels = () => ({
    material: selected.material ? materials[selected.material] : null,
    print: printModes[selected.print] || { label: "" },
    cut: cutModes[selected.cut] || { label: "" },
    finish: finishModes[selected.finish] || { label: "" }
  });

  const syncFinishAvailability = () => {
    const materialConfig = pricingData.materials?.[selected.material] || null;
    const allowedFinishes = Array.isArray(materialConfig?.allowedFinishes) && materialConfig.allowedFinishes.length
      ? new Set(materialConfig.allowedFinishes)
      : null;

    finishButtons.forEach((button) => {
      const isAllowed = !allowedFinishes || allowedFinishes.has(button.dataset.value);
      button.hidden = !isAllowed;
      button.disabled = !isAllowed;
      button.classList.toggle("active", isAllowed && button.dataset.value === selected.finish);
    });

    if (allowedFinishes && !allowedFinishes.has(selected.finish)) {
      selected.finish = "none";
      const fallbackButton = calculator.querySelector('[data-option-group="finish"] [data-value="none"]');
      if (fallbackButton && !fallbackButton.hidden) fallbackButton.classList.add("active");
    }
  };

  const buildSummaryParts = ({ width, height, quantity, kindCount, labels, approximate }) => {
    const parts = [];
    const totalQuantity = quantity && kindCount ? quantity * kindCount : quantity;
    if (width && height) parts.push(`${width}×${height} мм`);
    if (totalQuantity) parts.push(`${totalQuantity.toLocaleString("uk-UA")} шт`);
    if (kindCount) parts.push(`${kindCount} вид.`);
    if (labels.material) parts.push(labels.material.label);
    if (labels.print?.label) parts.push(labels.print.label);
    if (labels.cut?.label) parts.push(labels.cut.label);
    if (labels.finish?.label) parts.push(labels.finish.label);
    if (approximate) parts.push("орієнтовно");
    return parts;
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
          syncFinishAvailability();
          calculate();
          return;
        }
        button.classList.add("active");
        selected.material = button.dataset.value;
        syncFinishAvailability();
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
  syncFinishAvailability();

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
      const currentValue = target.value === "" ? min : Number(target.value);
      target.value = Math.min(Math.max(currentValue + step, min), max);
      calculate();
    });
  });

  [widthNode, heightNode, quantityNode, kindCountNode].forEach(bindDigitsOnlyInput);

  const calculate = () => {
    syncFinishAvailability();
    const width = getInputValue(widthNode);
    const height = getInputValue(heightNode);
    const quantity = clampInputValue(quantityNode, { writeBack: false });
    const kindCount = clampInputValue(kindCountNode, { writeBack: false });
    const totalQuantity = quantity && kindCount ? quantity * kindCount : quantity;
    const labels = getLabels();

    areaNode.textContent = width && height ? `${width}×${height} мм` : "—";
    if (kindCountSummaryNode) {
      kindCountSummaryNode.textContent = kindCount ? `${kindCount} вид.` : "—";
    }

    const baseDraft = {
      material: labels.material ? labels.material.label : "",
      materialKey: selected.material,
      materialCategory: selected.materialCategory,
      size: width && height ? `${width}×${height} мм` : "",
      width: width || "",
      height: height || "",
      quantity: quantity || "",
      kindCount: kindCount || "",
      print: labels.print.label,
      printKey: selected.print,
      cut: labels.cut.label,
      cutKey: selected.cut,
      finish: labels.finish.label,
      finishKey: selected.finish,
      total: "",
      unit: ""
    };

    if (!labels.material) {
      setResultTone("default");
      setSelectionSummary(buildSummaryParts({ width, height, quantity, kindCount, labels, approximate: false }));
      saveOrderDraft(baseDraft);
      totalNode.textContent = "Оберіть матеріал для друку";
      unitNode.textContent = "—";
      materialLabel.textContent = "не вибрано";
      setSummaryLines([
        "Матеріал: не вибрано",
        labels.print.label ? `Друк: ${labels.print.label}` : "",
        labels.cut.label ? `Порізка: ${labels.cut.label}` : "",
        labels.finish.label ? `Покриття: ${labels.finish.label}` : ""
      ].filter(Boolean));
      return;
    }

    materialLabel.textContent = labels.material.label;

    if (!width || !height || !quantity || !kindCount) {
      setResultTone("default");
      setSelectionSummary(buildSummaryParts({ width, height, quantity, kindCount, labels, approximate: false }));
      saveOrderDraft(baseDraft);
      totalNode.textContent = "Заповніть розміри, тираж і види";
      unitNode.textContent = "—";
      setSummaryLines([
        `Матеріал: ${labels.material.label}`,
        labels.print.label ? `Друк: ${labels.print.label}` : "",
        labels.cut.label ? `Порізка: ${labels.cut.label}` : "",
        labels.finish.label ? `Покриття: ${labels.finish.label}` : "",
        totalQuantity ? `Загальний тираж: ${totalQuantity.toLocaleString("uk-UA")} шт` : "Загальний тираж: не вказано",
        quantity ? `На 1 вид: ${quantity.toLocaleString("uk-UA")} шт` : "На 1 вид: не вказано",
        kindCount ? `Різних видів: ${kindCount}` : "Різних видів: не вказано",
        width && height ? `Розмір: ${width}×${height} мм` : "Розмір: не вказано"
      ].filter(Boolean));
      return;
    }

    const result = calculatorEngine.calculate({
      width,
      height,
      quantity,
      kindCount,
      materialKey: selected.material,
      printKey: selected.print,
      cutKey: selected.cut,
      finishKey: selected.finish
    }, pricingData);

    setSelectionSummary(buildSummaryParts({
      width,
      height,
      quantity,
      kindCount,
      labels,
      approximate: !!result.materialStatus?.isApproximate
    }));

    if (!result.ok) {
      setResultTone("warning");
      saveOrderDraft({ ...baseDraft, material: labels.material.label });
      const isContourTooLarge = result.code === "contour-too-large" && width && height;
      totalNode.textContent = isContourTooLarge
        ? `Фігурна порізка недоступна для формату ${formatSize(width, height)}`
        : result.message;
      unitNode.textContent = "—";
      setSummaryLines([
        `Матеріал: ${labels.material.label}`,
        isContourTooLarge
          ? `Для самоклеючого паперу з надсічками формат ${formatSize(width, height)} не вміщується в робочу область листа зі стандартними полями 2 мм.`
          : result.message
      ]);
      return;
    }

    setResultTone("default");
    const totalText = result.materialStatus.isApproximate ? `≈ ${roundMoney(result.total)}` : roundMoney(result.total);
    const safeUnitBase = Math.max(1, totalQuantity || quantity || 1);
    const unitText = result.materialStatus.isApproximate ? `≈ ${formatUnit(result.total / safeUnitBase)}` : formatUnit(result.total / safeUnitBase);
    const noteLine = result.materialStatus.note || "";
    const printTier = result.printCharge.tier;
    const printTierLabel = printTier
      ? (printTier.maxSheets === Infinity ? `${printTier.minSheets || 101}+` : `${printTier.minSheets || 1}-${printTier.maxSheets}`)
      : "";

    totalNode.textContent = totalText;
    unitNode.textContent = unitText;
    setSummaryLines([
      `Матеріал: ${labels.material.label}`,
      `Профіль листа: ${result.profile.label} ${result.profile.stockWidth}×${result.profile.stockHeight} мм`,
      `Робоча область: ${result.profile.printWidth}×${result.profile.printHeight} мм`,
      `Технічний розмір стікера: ${result.itemWidth}×${result.itemHeight} мм`,
      totalQuantity ? `Загальний тираж: ${totalQuantity.toLocaleString("uk-UA")} шт` : "",
      quantity ? `На 1 вид: ${quantity.toLocaleString("uk-UA")} шт` : "",
      kindCount ? `Різних видів: ${kindCount}` : "",
      `На лист вміщується: ${result.itemsPerSheet} шт`,
      `Всього листів: ${result.sheets.totalSheets}`,
      `Матеріал за лист: ${formatMoney(result.materialCharge.baseMaterialPerSheet)}`,
      `Друк за лист: ${formatMoney(result.printCharge.ratePerSheet)}`,
      result.cutCharge.contourLengthPerItemMm
        ? `Плотерний різ на 1 виріб: ${Math.round(result.cutCharge.contourLengthPerItemMm)} мм`
        : "",
      result.cutCharge.contourLengthTotalMm
        ? `Загальна довжина різу: ${(result.cutCharge.contourLengthTotalMm / 1000).toFixed(2).replace(".", ",")} м`
        : "",
      result.cutCharge.contourMarginMm
        ? `Стандартні поля під обріз: ${result.cutCharge.contourMarginMm} мм`
        : "",
      printTierLabel ? `Сходинка друку: ${printTierLabel} листів` : "",
      noteLine ? `Примітка: ${noteLine}` : ""
    ].filter(Boolean));
    saveOrderDraft({
      ...baseDraft,
      material: labels.material.label,
      total: totalText,
      unit: unitText,
      totalQuantity: totalQuantity || "",
      itemsPerSheet: result.itemsPerSheet,
      sheetsPerKind: result.sheets.sheetsPerKind,
      totalSheets: result.sheets.totalSheets,
      pricingNote: noteLine
    });
  };

  [widthNode, heightNode, quantityNode, kindCountNode].forEach((item) => {
    item.addEventListener("input", calculate);
    item.addEventListener("change", () => {
      if (item === quantityNode || item === kindCountNode) {
        clampInputValue(item);
      }
      calculate();
    });
  });

  calculate();
}

const orderFormPage = document.querySelector("[data-order-form]");
if (orderFormPage) {
  let draft = {};
  try {
    draft = JSON.parse(window.sessionStorage.getItem("dsprintOrderDraft") || "{}");
  } catch {
    draft = {};
  }

  const phoneInput = orderFormPage.querySelector("#order-phone");
  const firstNameInput = orderFormPage.querySelector("#order-first-name");
  const lastNameInput = orderFormPage.querySelector("#order-last-name");
  const emailInput = orderFormPage.querySelector("#order-email");
  const commentInput = orderFormPage.querySelector("#order-comment");
  const designerNoteInput = orderFormPage.querySelector("#designer-note");
  const layoutLinkInput = orderFormPage.querySelector("#layout-link");
  const layoutFileInput = orderFormPage.querySelector("#layout-file");
  const deliveryCityInput = orderFormPage.querySelector("#delivery-city");
  const deliveryAddressInput = orderFormPage.querySelector("#delivery-address");
  const deliveryInputs = orderFormPage.querySelectorAll('input[name="delivery"]');
  const layoutInputs = orderFormPage.querySelectorAll('input[name="layout-state"]');
  const layoutLinkField = orderFormPage.querySelector("[data-layout-link-field]");
  const layoutUploadField = orderFormPage.querySelector("[data-layout-upload-field]");
  const designerField = orderFormPage.querySelector("[data-designer-field]");
  const deliveryCityField = orderFormPage.querySelector("[data-delivery-city-field]");
  const deliveryAddressField = orderFormPage.querySelector("[data-delivery-address-field]");
  const summaryBox = orderFormPage.querySelector("[data-order-summary]");
  const totalBox = orderFormPage.querySelector("[data-order-total]");

  const updateLayoutState = () => {
    const selectedLayout = orderFormPage.querySelector('input[name="layout-state"]:checked')?.value;
    if (layoutLinkField) layoutLinkField.hidden = selectedLayout !== "link";
    if (layoutUploadField) layoutUploadField.hidden = selectedLayout !== "upload";
    if (designerField) designerField.hidden = selectedLayout !== "designer";
  };

  const updateDeliveryState = () => {
    const selectedDelivery = orderFormPage.querySelector('input[name="delivery"]:checked')?.value;
    if (deliveryCityField) deliveryCityField.hidden = !["nova-poshta-branch", "nova-poshta-courier"].includes(selectedDelivery);
    if (deliveryAddressField) deliveryAddressField.hidden = !["lviv-courier", "nova-poshta-branch", "nova-poshta-courier"].includes(selectedDelivery);
  };

  const renderOrderSummary = () => {
    if (!summaryBox || !totalBox) return;
    const lines = [
      draft.material ? `Матеріал: ${draft.material}` : "Матеріал: уточнюється",
      draft.size ? `Розмір: ${draft.size}` : "Розмір: уточнюється",
      draft.totalQuantity
        ? `Загальний тираж: ${Number(draft.totalQuantity).toLocaleString("uk-UA")} шт`
        : draft.quantity
          ? `Загальний тираж: ${Number(draft.quantity).toLocaleString("uk-UA")} шт`
          : "Загальний тираж: уточнюється",
      draft.quantity ? `На 1 вид: ${Number(draft.quantity).toLocaleString("uk-UA")} шт` : "На 1 вид: уточнюється",
      draft.kindCount ? `Різних видів: ${draft.kindCount}` : "Різних видів: 1",
      draft.print ? `Друк: ${draft.print}` : null,
      draft.cut ? `Порізка: ${draft.cut}` : null,
      draft.finish ? `Покриття: ${draft.finish}` : null,
      draft.pricingNote ? `Примітка: ${draft.pricingNote}` : null
    ].filter(Boolean);
    summaryBox.innerHTML = lines.map((line) => `<div>${escapeHtml(line)}</div>`).join("");
    totalBox.textContent = draft.total || "Ціну уточнимо після перевірки";
  };

  renderOrderSummary();
  updateLayoutState();
  updateDeliveryState();

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      const raw = String(phoneInput.value || "");
      const sanitized = raw
        .replace(/[^\d+]/g, "")
        .replace(/\+(?=.+\+)/g, "")
        .replace(/(?!^)\+/g, "");
      if (phoneInput.value !== sanitized) phoneInput.value = sanitized;
    });
  }

  orderFormPage.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const selectedDelivery =
      orderFormPage.querySelector('input[name="delivery"]:checked')?.nextElementSibling?.textContent?.trim() || "Уточню";
    const selectedLayout = orderFormPage.querySelector('input[name="layout-state"]:checked')?.value || "designer";
    const layoutLabelMap = {
      designer: "Файлу немає, потрібна допомога дизайнера",
      link: "Додасть посилання на файл",
      upload: "Додає файли"
    };
    const uploadedFiles = layoutFileInput?.files?.length
      ? Array.from(layoutFileInput.files).map((file) => file.name).join(", ")
      : "";

    const message = [
      "Добрий день! Хочу оформити замовлення.",
      firstNameInput?.value ? `Ім'я: ${firstNameInput.value}` : null,
      lastNameInput?.value ? `Прізвище: ${lastNameInput.value}` : null,
      phoneInput?.value ? `Телефон: ${phoneInput.value}` : null,
      emailInput?.value ? `Email: ${emailInput.value}` : null,
      "",
      draft.material ? `Матеріал: ${draft.material}` : null,
      draft.size ? `Розмір: ${draft.size}` : null,
      draft.totalQuantity
        ? `Загальний тираж: ${Number(draft.totalQuantity).toLocaleString("uk-UA")} шт`
        : draft.quantity
          ? `Загальний тираж: ${Number(draft.quantity).toLocaleString("uk-UA")} шт`
          : null,
      draft.quantity ? `На 1 вид: ${Number(draft.quantity).toLocaleString("uk-UA")} шт` : null,
      draft.kindCount ? `Різних видів: ${draft.kindCount}` : null,
      draft.print ? `Друк: ${draft.print}` : null,
      draft.cut ? `Порізка: ${draft.cut}` : null,
      draft.finish ? `Покриття: ${draft.finish}` : null,
      draft.total ? `Орієнтовна ціна: ${draft.total}` : null,
      draft.pricingNote ? `Примітка: ${draft.pricingNote}` : null,
      "",
      `Макет: ${layoutLabelMap[selectedLayout] || "Уточню"}`,
      selectedLayout === "designer" && designerNoteInput?.value ? `Завдання дизайнеру: ${designerNoteInput.value}` : null,
      selectedLayout === "link" && layoutLinkInput?.value ? `Посилання на макет: ${layoutLinkInput.value}` : null,
      selectedLayout === "upload" && uploadedFiles ? `Файли: ${uploadedFiles}` : null,
      selectedDelivery ? `Доставка: ${selectedDelivery}` : null,
      deliveryCityInput?.value ? `Місто: ${deliveryCityInput.value}` : null,
      deliveryAddressInput?.value ? `Адреса / відділення: ${deliveryAddressInput.value}` : null,
      commentInput?.value ? `Коментар: ${commentInput.value}` : null
    ].filter(Boolean).join("\n");

    window.location.href = `https://t.me/dsprints?text=${encodeURIComponent(message)}`;
  }, true);

  layoutInputs.forEach((input) => input.addEventListener("change", updateLayoutState));
  deliveryInputs.forEach((input) => input.addEventListener("change", updateDeliveryState));

  orderFormPage.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedDelivery = orderFormPage.querySelector('input[name="delivery"]:checked')?.nextElementSibling?.textContent?.trim() || "Уточню";
    const selectedLayout = orderFormPage.querySelector('input[name="layout-state"]:checked')?.value || "designer";
    const layoutLabelMap = {
      designer: "Файлу немає, потрібна допомога дизайнера",
      link: "Додасть посилання на файл",
      upload: "Додає файли"
    };

    const message = [
      "Добрий день! Хочу оформити замовлення.",
      firstNameInput?.value ? `Ім'я: ${firstNameInput.value}` : null,
      lastNameInput?.value ? `Прізвище: ${lastNameInput.value}` : null,
      phoneInput?.value ? `Телефон: ${phoneInput.value}` : null,
      emailInput?.value ? `Email: ${emailInput.value}` : null,
      "",
      draft.material ? `Матеріал: ${draft.material}` : null,
      draft.size ? `Розмір: ${draft.size}` : null,
      draft.totalQuantity
        ? `Загальний тираж: ${Number(draft.totalQuantity).toLocaleString("uk-UA")} шт`
        : draft.quantity
          ? `Загальний тираж: ${Number(draft.quantity).toLocaleString("uk-UA")} шт`
          : null,
      draft.quantity ? `На 1 вид: ${Number(draft.quantity).toLocaleString("uk-UA")} шт` : null,
      draft.kindCount ? `Різних видів: ${draft.kindCount}` : null,
      draft.print ? `Друк: ${draft.print}` : null,
      draft.cut ? `Порізка: ${draft.cut}` : null,
      draft.finish ? `Покриття: ${draft.finish}` : null,
      draft.total ? `Орієнтовна ціна: ${draft.total}` : null,
      draft.pricingNote ? `Примітка: ${draft.pricingNote}` : null,
      "",
      `Макет: ${layoutLabelMap[selectedLayout] || "Уточню"}`,
      selectedDelivery ? `Доставка: ${selectedDelivery}` : null,
      commentInput?.value ? `Коментар: ${commentInput.value}` : null
    ].filter(Boolean).join("\n");

    window.location.href = `https://t.me/dsprints?text=${encodeURIComponent(message)}`;
  });
}

const filters = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-gallery-item]");
if (filters.length && galleryItems.length) {
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const current = button.dataset.filter;
      galleryItems.forEach((card) => {
        card.hidden = current !== "all" && card.dataset.category !== current;
      });
    });
  });
}

const materialFilterButtons = document.querySelectorAll("[data-material-filter]");
const materialCards = document.querySelectorAll("[data-material-card]");
if (materialFilterButtons.length && materialCards.length) {
  const requestedMaterialFilter = new URLSearchParams(window.location.search).get("materialFilter");

  const applyMaterialFilter = (filter) => {
    materialFilterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.materialFilter === filter);
    });

    materialCards.forEach((card) => {
      card.hidden = card.dataset.materialCard !== filter;
    });

  };

  const defaultMaterialFilter =
    Array.from(materialFilterButtons).find((button) => button.dataset.materialFilter === requestedMaterialFilter) ||
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

const initCatalogGalleries = () => {
  const galleryWrappers = document.querySelectorAll("[data-gallery-images]");
  if (!galleryWrappers.length) return;

  galleryWrappers.forEach((wrapper) => {
    const imageButton = wrapper.querySelector(".catalog-image-btn");
    const previewImage = imageButton?.querySelector("img");
    const slides = (wrapper.dataset.galleryImages || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!imageButton || !previewImage || slides.length < 2) return;

    let currentIndex = 0;
    wrapper.classList.add("has-gallery");

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "catalog-nav prev";
    prevButton.setAttribute("aria-label", "Попереднє фото");
    prevButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14.7 5.3a1 1 0 0 1 0 1.4L9.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" fill="currentColor"/>
      </svg>
    `;

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "catalog-nav next";
    nextButton.setAttribute("aria-label", "Наступне фото");
    nextButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9.3 18.7a1 1 0 0 1 0-1.4l5.29-5.3-5.3-5.3a1 1 0 1 1 1.42-1.4l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.42 0Z" fill="currentColor"/>
      </svg>
    `;

    const dots = document.createElement("div");
    dots.className = "catalog-dots";

    const setSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      const currentSlide = slides[currentIndex];
      previewImage.src = currentSlide;
      imageButton.dataset.lightboxImage = currentSlide;
      dots.querySelectorAll(".catalog-dot").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "catalog-dot";
      dot.setAttribute("aria-label", `Фото ${index + 1}`);
      dot.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSlide(index);
      });
      dots.append(dot);
    });

    const shiftSlide = (step) => setSlide(currentIndex + step);

    [prevButton, nextButton].forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    });

    prevButton.addEventListener("click", () => shiftSlide(-1));
    nextButton.addEventListener("click", () => shiftSlide(1));

    let touchStartX = null;
    imageButton.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    }, { passive: true });
    imageButton.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
      const deltaX = touchEndX - touchStartX;
      touchStartX = null;
      if (Math.abs(deltaX) < 36) return;
      shiftSlide(deltaX > 0 ? -1 : 1);
    });

    wrapper.append(prevButton, nextButton, dots);
    setSlide(0);
  });
};

initCatalogGalleries();

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

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

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
      node.style.setProperty("--reveal-delay", `${Math.min(index * (isMobile ? 14 : 46), isMobile ? 70 : 220)}ms`);
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
      threshold: window.matchMedia("(max-width: 767px)").matches ? 0.02 : 0.08,
      rootMargin: window.matchMedia("(max-width: 767px)").matches ? "0px 0px -6% 0px" : "0px 0px -4% 0px"
    }
  );

  nodes.forEach((node) => observer.observe(node));
};

initRevealAnimations();

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
});
