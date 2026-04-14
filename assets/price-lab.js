const priceLabPage = document.querySelector("[data-price-lab]");

if (priceLabPage && window.StickerSheetCalculator && window.PRINT_CALC_DATA) {
  const engine = window.StickerSheetCalculator;
  const pricingData = window.PRINT_CALC_DATA;
  const referenceMap = window.DPI_PRICE_REFERENCE || {};
  const STORAGE_KEY = "dsprintDpiPriceOverrides";
  const MAIN_SIZES = ["297x420", "210x297", "148x210", "105x148", "99x210", "100x210", "90x50", "85x55", "84x64", "100x70", "200x200", "210x210"];

  const state = {
    materialKey: "paperSlits",
    printKey: "color1",
    finishKey: "none",
    cutKey: "pieceTrim",
    quantity: 100
  };

  const printOptions = [
    { key: "color1", label: "4+0" },
    { key: "bw1", label: "1+0" },
    { key: "blank", label: "без друку" }
  ];
  const finishOptions = [
    { key: "none", label: "без оздоблення" },
    { key: "glossLam", label: "ламінація глянцева" },
    { key: "matteLam", label: "ламінація матова" },
    { key: "softTouch", label: "soft touch" }
  ];
  const cutOptions = [
    { key: "trim", label: "без порізки" },
    { key: "pieceTrim", label: "порізка" },
    { key: "digitalContour", label: "фігурна надсічка / плотер" }
  ];

  const formatMoney = (value) => `${Math.round(value).toLocaleString("uk-UA")} грн`;
  const getReferenceKey = ({ size, quantity, materialKey, printKey, finishKey, cutKey }) =>
    [materialKey, size, printKey, finishKey, cutKey, Math.ceil(quantity || 0)].join("|");

  const readOverrides = () => {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  };

  const saveOverrides = (overrides) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  };

  const getActiveReferencePrice = (key) => {
    const overrides = readOverrides();
    if (Number.isFinite(overrides[key])) return overrides[key];
    return Number.isFinite(referenceMap[key]) ? referenceMap[key] : null;
  };

  const renderOptionGroup = (node, options, activeKey, onChange) => {
    node.innerHTML = options.map((option) => `
      <button type="button" class="option-pill ${option.key === activeKey ? "active" : ""}" data-key="${option.key}">
        ${option.label}
      </button>
    `).join("");

    node.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => onChange(button.dataset.key));
    });
  };

  const quantityNode = priceLabPage.querySelector("[data-price-lab-quantity]");
  const modelSummaryNode = priceLabPage.querySelector("[data-price-lab-summary]");
  const tableBodyNode = priceLabPage.querySelector("[data-price-lab-body]");
  const printGroupNode = priceLabPage.querySelector("[data-price-lab-print]");
  const finishGroupNode = priceLabPage.querySelector("[data-price-lab-finish]");
  const cutGroupNode = priceLabPage.querySelector("[data-price-lab-cut]");
  const clearOverridesButton = priceLabPage.querySelector("[data-price-lab-clear]");

  const buildRows = () => {
    return MAIN_SIZES.map((size) => {
      const [width, height] = size.split("x").map(Number);
      const key = getReferenceKey({
        size,
        quantity: state.quantity,
        materialKey: state.materialKey,
        printKey: state.printKey,
        finishKey: state.finishKey,
        cutKey: state.cutKey
      });
      const model = engine.calculate({
        width,
        height,
        quantity: state.quantity,
        kindCount: 1,
        materialKey: state.materialKey,
        printKey: state.printKey,
        finishKey: state.finishKey,
        cutKey: state.cutKey,
        ignoreExactReference: true
      }, pricingData);
      const dpiPrice = getActiveReferencePrice(key);
      const diff = Number.isFinite(dpiPrice) && model.ok ? model.total - dpiPrice : null;

      return {
        key,
        size,
        width,
        height,
        dpiPrice,
        diff,
        model
      };
    });
  };

  const updateSummary = (rows) => {
    const withReference = rows.filter((row) => Number.isFinite(row.dpiPrice) && row.model.ok);
    if (!withReference.length) {
      modelSummaryNode.textContent = "Для цієї комбінації ще немає референсних цін DPI.";
      return;
    }

    const avgAbsDiff = withReference.reduce((sum, row) => sum + Math.abs(row.diff), 0) / withReference.length;
    const worst = withReference.reduce((current, row) => (Math.abs(row.diff) > Math.abs(current.diff) ? row : current), withReference[0]);
    modelSummaryNode.textContent = `Знайдено ${withReference.length} референсів. Середнє абсолютне відхилення: ${avgAbsDiff.toFixed(1).replace(".", ",")} грн. Найбільше відхилення: ${worst.size} (${Math.round(worst.diff)} грн).`;
  };

  const renderTable = () => {
    const rows = buildRows();
    tableBodyNode.innerHTML = rows.map((row) => {
      const modelPrice = row.model.ok ? Math.round(row.model.total) : null;
      const diffClass = row.diff == null ? "" : row.diff > 0 ? "is-high" : row.diff < 0 ? "is-low" : "is-even";
      const diffText = row.diff == null ? "—" : `${row.diff > 0 ? "+" : ""}${Math.round(row.diff)} грн`;
      const override = readOverrides()[row.key];

      return `
        <tr>
          <td><strong>${row.size}</strong></td>
          <td>${row.model.ok ? row.model.itemsPerSheet : "—"}</td>
          <td>${row.model.ok ? row.model.sheets.totalSheets : "—"}</td>
          <td>${modelPrice == null ? "—" : formatMoney(modelPrice)}</td>
          <td>${row.dpiPrice == null ? "—" : formatMoney(row.dpiPrice)}</td>
          <td class="price-lab-diff ${diffClass}">${diffText}</td>
          <td>
            <input class="price-lab-input" type="number" min="0" step="1" value="${Number.isFinite(override) ? override : row.dpiPrice ?? ""}" data-key="${row.key}">
          </td>
          <td>
            <button type="button" class="price-lab-mini" data-action="save" data-key="${row.key}">Зберегти</button>
            <button type="button" class="price-lab-mini ghost" data-action="reset" data-key="${row.key}">Скинути</button>
          </td>
        </tr>
      `;
    }).join("");

    tableBodyNode.querySelectorAll("[data-action='save']").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.key;
        const input = tableBodyNode.querySelector(`input[data-key="${key}"]`);
        const value = Number(input.value);
        if (!Number.isFinite(value) || value < 0) return;
        const overrides = readOverrides();
        overrides[key] = value;
        saveOverrides(overrides);
        renderTable();
      });
    });

    tableBodyNode.querySelectorAll("[data-action='reset']").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.key;
        const overrides = readOverrides();
        delete overrides[key];
        saveOverrides(overrides);
        renderTable();
      });
    });

    updateSummary(rows);
  };

  const renderControls = () => {
    renderOptionGroup(printGroupNode, printOptions, state.printKey, (key) => {
      state.printKey = key;
      renderControls();
      renderTable();
    });
    renderOptionGroup(finishGroupNode, finishOptions, state.finishKey, (key) => {
      state.finishKey = key;
      renderControls();
      renderTable();
    });
    renderOptionGroup(cutGroupNode, cutOptions, state.cutKey, (key) => {
      state.cutKey = key;
      renderControls();
      renderTable();
    });
  };

  quantityNode.value = state.quantity;
  quantityNode.addEventListener("input", () => {
    const value = Number(quantityNode.value);
    if (!Number.isFinite(value) || value <= 0) return;
    state.quantity = Math.ceil(value);
    renderTable();
  });

  clearOverridesButton.addEventListener("click", () => {
    window.localStorage.removeItem(STORAGE_KEY);
    renderTable();
  });

  renderControls();
  renderTable();
}
