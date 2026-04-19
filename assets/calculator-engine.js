(() => {
  const normalizeSheetCount = (value) => (Number.isFinite(value) && value > 0 ? Math.ceil(value) : 0);

  const pickTier = (tiers, sheets) => {
    if (!Array.isArray(tiers) || !tiers.length) return null;
    return tiers.find((tier) => sheets <= tier.maxSheets) || tiers[tiers.length - 1];
  };

  const getMonotoneTangents = (sortedPoints, scaleKey) => {
    const size = sortedPoints.length;
    if (size < 2) return [];

    const x = sortedPoints.map((point) => point[scaleKey]);
    const y = sortedPoints.map((point) => point.total);
    const h = [];
    const delta = [];

    for (let index = 0; index < size - 1; index += 1) {
      const step = x[index + 1] - x[index];
      h[index] = step;
      delta[index] = step ? (y[index + 1] - y[index]) / step : 0;
    }

    const tangents = new Array(size).fill(0);
    tangents[0] = delta[0];
    tangents[size - 1] = delta[size - 2];

    for (let index = 1; index < size - 1; index += 1) {
      if (delta[index - 1] === 0 || delta[index] === 0 || delta[index - 1] * delta[index] <= 0) {
        tangents[index] = 0;
        continue;
      }

      const w1 = 2 * h[index] + h[index - 1];
      const w2 = h[index] + 2 * h[index - 1];
      tangents[index] = (w1 + w2) / (w1 / delta[index - 1] + w2 / delta[index]);
    }

    return tangents;
  };

  const interpolateMonotoneSegment = ({
    scaleValue,
    prev,
    next,
    prevTangent,
    nextTangent,
    scaleKey
  }) => {
    const span = next[scaleKey] - prev[scaleKey];
    if (!span) return prev.total;

    const t = (scaleValue - prev[scaleKey]) / span;
    const t2 = t * t;
    const t3 = t2 * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    return (
      h00 * prev.total +
      h10 * span * prevTangent +
      h01 * next.total +
      h11 * span * nextTangent
    );
  };

  const interpolateLocalPolynomial = ({ scaleValue, points, prev, next, scaleKey }) => {
    if (!Array.isArray(points) || points.length < 4) return null;

    const candidates = [...points]
      .sort((left, right) => {
        const leftDistance = Math.abs((left?.[scaleKey] ?? 0) - scaleValue);
        const rightDistance = Math.abs((right?.[scaleKey] ?? 0) - scaleValue);
        return leftDistance - rightDistance;
      })
      .slice(0, 4)
      .sort((left, right) => (left?.[scaleKey] ?? 0) - (right?.[scaleKey] ?? 0));

    if (new Set(candidates.map((point) => point?.[scaleKey])).size < 4) return null;

    let interpolated = 0;
    for (let index = 0; index < candidates.length; index += 1) {
      const point = candidates[index];
      let term = point.total;

      for (let inner = 0; inner < candidates.length; inner += 1) {
        if (inner === index) continue;
        const neighbour = candidates[inner];
        const denominator = point[scaleKey] - neighbour[scaleKey];
        if (!denominator) return null;
        term *= (scaleValue - neighbour[scaleKey]) / denominator;
      }

      interpolated += term;
    }

    const lower = Math.min(prev.total, next.total);
    const upper = Math.max(prev.total, next.total);
    return Math.min(Math.max(interpolated, lower), upper);
  };

  const getCurveValue = ({ scaleValue, points, scaleKey = "sheets", floorPerUnit = 0 }) => {
    const safeScale = Math.max(0, Number(scaleValue || 0));
    const sortedPoints = Array.isArray(points)
      ? [...points].sort((a, b) => (a?.[scaleKey] ?? 0) - (b?.[scaleKey] ?? 0))
      : [];

    if (!sortedPoints.length || !safeScale) return 0;

    if (safeScale <= sortedPoints[0][scaleKey]) {
      return Math.max(sortedPoints[0].total, floorPerUnit * safeScale);
    }

    const exact = sortedPoints.find((point) => point[scaleKey] === safeScale);
    if (exact) return Math.max(exact.total, floorPerUnit * safeScale);

    const tangents = sortedPoints.length >= 3 ? getMonotoneTangents(sortedPoints, scaleKey) : [];

    for (let index = 1; index < sortedPoints.length; index += 1) {
      const prev = sortedPoints[index - 1];
      const next = sortedPoints[index];
      if (safeScale > next[scaleKey]) continue;
      const polynomialInterpolated = interpolateLocalPolynomial({
        scaleValue: safeScale,
        points: sortedPoints,
        prev,
        next,
        scaleKey
      });
      const interpolated =
        Number.isFinite(polynomialInterpolated)
          ? polynomialInterpolated
          :
        tangents.length >= sortedPoints.length
          ? interpolateMonotoneSegment({
              scaleValue: safeScale,
              prev,
              next,
              prevTangent: tangents[index - 1],
              nextTangent: tangents[index],
              scaleKey
            })
          : prev.total + ((next.total - prev.total) * (safeScale - prev[scaleKey])) / Math.max(next[scaleKey] - prev[scaleKey], 1);
      return Math.max(interpolated, floorPerUnit * safeScale);
    }

    const last = sortedPoints[sortedPoints.length - 1];
    const prev = sortedPoints[sortedPoints.length - 2] || last;
    const tailRate = (last.total - prev.total) / Math.max(last[scaleKey] - prev[scaleKey], 1);
    return Math.max(last.total + (safeScale - last[scaleKey]) * tailRate, floorPerUnit * safeScale);
  };

  const getGridFit = (sheetWidth, sheetHeight, itemWidth, itemHeight) => {
    if (itemWidth <= 0 || itemHeight <= 0) return 0;
    return Math.floor(sheetWidth / itemWidth) * Math.floor(sheetHeight / itemHeight);
  };

  const getMixedOrientationFit = (sheetWidth, sheetHeight, itemWidth, itemHeight) => {
    const columns = Math.floor(sheetWidth / itemWidth);
    const rows = Math.floor(sheetHeight / itemHeight);
    const baseCount = columns * rows;

    if (!baseCount) return 0;

    const remainingWidth = sheetWidth - columns * itemWidth;
    const remainingHeight = sheetHeight - rows * itemHeight;
    const extraRightStrip = getGridFit(remainingWidth, sheetHeight, itemHeight, itemWidth);
    const extraBottomStrip = getGridFit(sheetWidth, remainingHeight, itemHeight, itemWidth);

    return Math.max(baseCount + extraRightStrip, baseCount + extraBottomStrip);
  };

  const getItemsPerSheet = ({ sheetWidth, sheetHeight, itemWidth, itemHeight, gapX = 0, gapY = 0 }) => {
    const packedWidth = itemWidth + gapX;
    const packedHeight = itemHeight + gapY;

    if (!packedWidth || !packedHeight) return 0;

    return Math.max(
      getGridFit(sheetWidth, sheetHeight, packedWidth, packedHeight),
      getGridFit(sheetWidth, sheetHeight, packedHeight, packedWidth),
      getMixedOrientationFit(sheetWidth, sheetHeight, packedWidth, packedHeight),
      getMixedOrientationFit(sheetWidth, sheetHeight, packedHeight, packedWidth)
    );
  };

  const canFitOnSheet = ({ sheetWidth, sheetHeight, itemWidth, itemHeight, gapX = 0, gapY = 0 }) =>
    getItemsPerSheet({ sheetWidth, sheetHeight, itemWidth, itemHeight, gapX, gapY }) > 0;

  const getSheetsNeeded = ({ quantity, kindCount = 1, itemsPerSheet }) => {
    const safeItemsPerSheet = Math.max(0, Math.floor(itemsPerSheet || 0));
    const safeKinds = Math.max(1, Math.ceil(kindCount || 1));
    const safeQuantity = Math.max(0, Math.ceil(quantity || 0));
    const totalRequestedQuantity = safeQuantity * safeKinds;
    const quantityPerKind = safeQuantity;
    const sheetsPerKind = safeItemsPerSheet > 0 ? Math.ceil(quantityPerKind / safeItemsPerSheet) : 0;
    const totalSheets = safeItemsPerSheet > 0 ? Math.ceil(totalRequestedQuantity / safeItemsPerSheet) : 0;

    return {
      quantityPerKind,
      sheetsPerKind,
      totalRequestedQuantity,
      totalSheets,
      producedItems: totalSheets * safeItemsPerSheet
    };
  };

  const getMaterialConfig = (data, materialKey) => data?.materials?.[materialKey] || null;
  const getSheetProfile = (data, profileKey) => data?.sheetProfiles?.[profileKey] || null;
  const getResolvedSheetProfile = (data, materialConfig) => {
    const baseProfile = getSheetProfile(data, materialConfig?.profile) || null;
    const override = materialConfig?.sheetProfileOverride;
    if (!override) return baseProfile;
    return {
      ...(baseProfile || {}),
      ...override
    };
  };
  const getPrintConfig = (data, printKey) => data?.printModes?.[printKey] || null;
  const getResolvedPrintConfig = (data, materialConfig, printKey) => {
    const baseConfig = getPrintConfig(data, printKey) || null;
    const override = materialConfig?.printOverrides?.[printKey];
    if (!override) return baseConfig;
    return {
      ...(baseConfig || {}),
      ...override
    };
  };
  const getCutConfig = (data, cutKey) => data?.cutModes?.[cutKey] || null;
  const getFinishConfig = (data, finishKey) => data?.finishModes?.[finishKey] || null;
  const disallowsReferenceForCut = (materialConfig, cutKey) => {
    const denylist = materialConfig?.disableReferenceForCuts;
    if (!Array.isArray(denylist) || !denylist.length) return false;
    return denylist.includes(cutKey);
  };
  const allowsReferenceForCut = (materialConfig, cutKey) => {
    if (disallowsReferenceForCut(materialConfig, cutKey)) return false;
    const allowlist = materialConfig?.referenceCutAllowlist;
    if (!Array.isArray(allowlist) || !allowlist.length) return true;
    return allowlist.includes(cutKey);
  };
  const allowsReferenceApproximationForCut = (materialConfig, cutKey) => {
    const denylist = materialConfig?.disableReferenceApproximationForCuts;
    if (!Array.isArray(denylist) || !denylist.length) return true;
    return !denylist.includes(cutKey);
  };
  const getExactReferenceTotal = ({ width, height, quantity, materialKey, printKey, finishKey, cutKey }) => {
    const sizeKeys = [`${width}x${height}`];
    const rotatedSizeKey = `${height}x${width}`;
    if (rotatedSizeKey !== sizeKeys[0]) sizeKeys.push(rotatedSizeKey);

    const keys = sizeKeys.map((sizeKey) =>
      [materialKey, sizeKey, printKey, finishKey, cutKey, Math.ceil(quantity || 0)].join("|")
    );
    const override = (() => {
      try {
        const raw = window.localStorage?.getItem("dsprintDpiPriceOverrides");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        for (const key of keys) {
          if (Number.isFinite(parsed?.[key])) return parsed[key];
        }
        return null;
      } catch {
        return null;
      }
    })();
    if (Number.isFinite(override)) return override;

    const reference = window.DPI_PRICE_REFERENCE || null;
    if (!reference) return null;
    for (const key of keys) {
      if (Number.isFinite(reference[key])) return reference[key];
    }
    return null;
  };
  const getReferenceSeriesTotal = ({ width, height, quantity, materialKey, printKey, finishKey, cutKey }) => {
    const safeQuantity = Math.max(0, Math.ceil(quantity || 0));
    if (!safeQuantity) return null;

    const exact = getExactReferenceTotal({ width, height, quantity: safeQuantity, materialKey, printKey, finishKey, cutKey });
    if (Number.isFinite(exact)) return exact;

    let overrides = {};
    try {
      const raw = window.localStorage?.getItem("dsprintDpiPriceOverrides");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") overrides = parsed;
      }
    } catch {
      overrides = {};
    }

    const reference = window.DPI_PRICE_REFERENCE || {};
    const merged = { ...reference, ...overrides };
    const prefix = [materialKey, `${width}x${height}`, printKey, finishKey, cutKey].join("|") + "|";
    const points = Object.entries(merged)
      .filter(([key, value]) => key.startsWith(prefix) && Number.isFinite(value))
      .map(([key, value]) => {
        const quantityPart = Number(key.slice(prefix.length));
        return Number.isFinite(quantityPart) ? { quantity: quantityPart, total: value } : null;
      })
      .filter(Boolean);

    if (points.length < 2) return null;

    return getCurveValue({
      scaleValue: safeQuantity,
      points,
      scaleKey: "quantity"
    });
  };
  const getReferenceSeriesLinearTotal = ({ width, height, quantity, materialKey, printKey, finishKey, cutKey }) => {
    const safeQuantity = Math.max(0, Math.ceil(quantity || 0));
    if (!safeQuantity) return null;

    const exact = getExactReferenceTotal({ width, height, quantity: safeQuantity, materialKey, printKey, finishKey, cutKey });
    if (Number.isFinite(exact)) return exact;

    let overrides = {};
    try {
      const raw = window.localStorage?.getItem("dsprintDpiPriceOverrides");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") overrides = parsed;
      }
    } catch {
      overrides = {};
    }

    const reference = window.DPI_PRICE_REFERENCE || {};
    const merged = { ...reference, ...overrides };
    const prefix = [materialKey, `${width}x${height}`, printKey, finishKey, cutKey].join("|") + "|";
    const points = Object.entries(merged)
      .filter(([key, value]) => key.startsWith(prefix) && Number.isFinite(value))
      .map(([key, value]) => {
        const quantityPart = Number(key.slice(prefix.length));
        return Number.isFinite(quantityPart) ? { quantity: quantityPart, total: value } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.quantity - b.quantity);

    if (points.length < 2) return null;
    if (safeQuantity <= points[0].quantity) return points[0].total;

    for (let index = 1; index < points.length; index += 1) {
      const prev = points[index - 1];
      const next = points[index];
      if (safeQuantity > next.quantity) continue;
      return prev.total + ((next.total - prev.total) * (safeQuantity - prev.quantity)) / Math.max(next.quantity - prev.quantity, 1);
    }

    const last = points[points.length - 1];
    const prev = points[points.length - 2] || last;
    const tailRate = (last.total - prev.total) / Math.max(last.quantity - prev.quantity, 1);
    return last.total + (safeQuantity - last.quantity) * tailRate;
  };
  const getReferenceSeriesCeilingTotal = ({ width, height, quantity, materialKey, printKey, finishKey, cutKey }) => {
    const safeQuantity = Math.max(0, Math.ceil(quantity || 0));
    if (!safeQuantity) return null;

    const exact = getExactReferenceTotal({ width, height, quantity: safeQuantity, materialKey, printKey, finishKey, cutKey });
    if (Number.isFinite(exact)) return exact;

    let overrides = {};
    try {
      const raw = window.localStorage?.getItem("dsprintDpiPriceOverrides");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") overrides = parsed;
      }
    } catch {
      overrides = {};
    }

    const reference = window.DPI_PRICE_REFERENCE || {};
    const merged = { ...reference, ...overrides };
    const prefix = [materialKey, `${width}x${height}`, printKey, finishKey, cutKey].join("|") + "|";
    const points = Object.entries(merged)
      .filter(([key, value]) => key.startsWith(prefix) && Number.isFinite(value))
      .map(([key, value]) => {
        const quantityPart = Number(key.slice(prefix.length));
        return Number.isFinite(quantityPart) ? { quantity: quantityPart, total: value } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.quantity - b.quantity);

    if (points.length < 2) return null;
    const nextPoint = points.find((point) => safeQuantity <= point.quantity);
    if (nextPoint) return nextPoint.total;

    const last = points[points.length - 1];
    const prev = points[points.length - 2] || last;
    const tailRate = (last.total - prev.total) / Math.max(last.quantity - prev.quantity, 1);
    return last.total + (safeQuantity - last.quantity) * tailRate;
  };
  const parseSizeKey = (value) => {
    const match = /^(\d+)x(\d+)$/.exec(String(value || "").trim());
    if (!match) return null;
    return {
      width: Number(match[1]),
      height: Number(match[2]),
      key: `${Number(match[1])}x${Number(match[2])}`
    };
  };
  const getMergedReferenceMap = () => {
    let overrides = {};
    try {
      const raw = window.localStorage?.getItem("dsprintDpiPriceOverrides");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") overrides = parsed;
      }
    } catch {
      overrides = {};
    }
    const reference = window.DPI_PRICE_REFERENCE || {};
    return { ...reference, ...overrides };
  };
  const referenceSizeCache = new Map();
  const referenceApproximationRowsCache = new Map();
  const getReferenceSizesForSeries = ({ materialKey, printKey, finishKey, cutKey }) => {
    const cacheKey = [materialKey, printKey, finishKey, cutKey].join("|");
    if (referenceSizeCache.has(cacheKey)) return referenceSizeCache.get(cacheKey);

    const merged = getMergedReferenceMap();
    const sizes = new Map();

    for (const key of Object.keys(merged)) {
      const [rowMaterial, sizeKey, rowPrint, rowFinish, rowCut] = key.split("|");
      if (rowMaterial !== materialKey || rowPrint !== printKey || rowFinish !== finishKey || rowCut !== cutKey) continue;
      const parsedSize = parseSizeKey(sizeKey);
      if (!parsedSize) continue;
      sizes.set(parsedSize.key, parsedSize);
    }

    const result = [...sizes.values()];
    referenceSizeCache.set(cacheKey, result);
    return result;
  };
  const getApproximationFeatureVector = (row) => {
    const area = Math.max(1, row.width * row.height);
    const shortSide = Math.max(1, Math.min(row.width, row.height));
    const longSide = Math.max(shortSide, Math.max(row.width, row.height));
    const itemsPerSheet = Math.max(1, Math.floor(row.itemsPerSheet || 1));
    const sheets = Math.max(1, normalizeSheetCount(row.sheets));
    const contourPerItemMm = Math.max(1, row.contourPerItemMm || 1);
    const contourTotalMm = Math.max(1, row.contourTotalMm || 1);

    return {
      logArea: Math.log(area),
      logAspect: Math.log(longSide / shortSide),
      logQuantity: Math.log(Math.max(1, Math.ceil(row.quantity || 1))),
      logItemsPerSheet: Math.log(itemsPerSheet),
      logSheets: Math.log(sheets),
      logContourPerItem: Math.log(contourPerItemMm),
      logContourTotal: Math.log(contourTotalMm)
    };
  };
  const getApproximationDistanceScore = ({ targetFeatures, candidateFeatures, cutKey }) => {
    let distance =
      Math.abs(targetFeatures.logArea - candidateFeatures.logArea) * 1.2 +
      Math.abs(targetFeatures.logAspect - candidateFeatures.logAspect) * 0.5 +
      Math.abs(targetFeatures.logQuantity - candidateFeatures.logQuantity) * 0.8 +
      Math.abs(targetFeatures.logItemsPerSheet - candidateFeatures.logItemsPerSheet) * 1.4 +
      Math.abs(targetFeatures.logSheets - candidateFeatures.logSheets) * 1.1;

    if (cutKey === "digitalContour") {
      distance +=
        Math.abs(targetFeatures.logContourPerItem - candidateFeatures.logContourPerItem) * 1 +
        Math.abs(targetFeatures.logContourTotal - candidateFeatures.logContourTotal) * 0.8;
    }

    return distance;
  };
  const getReferenceApproximationRows = ({ materialKey, printKey, finishKey, cutKey, data }) => {
    const cacheKey = [materialKey, printKey, finishKey, cutKey].join("|");
    if (referenceApproximationRowsCache.has(cacheKey)) {
      return referenceApproximationRowsCache.get(cacheKey);
    }

    const merged = getMergedReferenceMap();
    const rows = [];

    for (const [key, referenceTotal] of Object.entries(merged)) {
      if (!Number.isFinite(referenceTotal)) continue;
      const [rowMaterial, sizeKey, rowPrint, rowFinish, rowCut, quantityPart] = key.split("|");
      if (rowMaterial !== materialKey || rowPrint !== printKey || rowFinish !== finishKey || rowCut !== cutKey) continue;

      const parsedSize = parseSizeKey(sizeKey);
      const quantity = Number(quantityPart);
      if (!parsedSize || !Number.isFinite(quantity) || quantity <= 0) continue;

      const formulaResult = calculate(
        {
          width: parsedSize.width,
          height: parsedSize.height,
          quantity,
          kindCount: 1,
          materialKey,
          printKey,
          finishKey,
          cutKey,
          ignoreExactReference: true,
          ignoreReferenceApproximation: true
        },
        data
      );

      if (!formulaResult?.ok || !Number.isFinite(formulaResult.total) || formulaResult.total <= 0) continue;

      const row = {
        key,
        width: parsedSize.width,
        height: parsedSize.height,
        quantity,
        referenceTotal,
        formulaTotal: formulaResult.total,
        itemsPerSheet: formulaResult.itemsPerSheet,
        sheets: formulaResult.sheets.totalSheets,
        contourPerItemMm: formulaResult.cutCharge?.contourLengthPerItemMm || 0,
        contourTotalMm: formulaResult.cutCharge?.contourLengthTotalMm || 0
      };
      row.features = getApproximationFeatureVector(row);
      rows.push(row);
    }

    referenceApproximationRowsCache.set(cacheKey, rows);
    return rows;
  };
  const getFeatureAdjustedReferenceTotal = ({ input, data, formulaTotal, itemsPerSheet, sheets, cutCharge }) => {
    if (!Number.isFinite(formulaTotal) || formulaTotal <= 0) return null;

    const referenceRows = getReferenceApproximationRows({
      materialKey: input.materialKey,
      printKey: input.printKey,
      finishKey: input.finishKey,
      cutKey: input.cutKey,
      data
    });
    if (!referenceRows.length) return null;

    const targetFeatures = getApproximationFeatureVector({
      width: input.width,
      height: input.height,
      quantity: input.quantity,
      itemsPerSheet,
      sheets,
      contourPerItemMm: cutCharge?.contourLengthPerItemMm || 0,
      contourTotalMm: cutCharge?.contourLengthTotalMm || 0
    });
    const nearest = referenceRows
      .map((row) => ({
        row,
        distance: getApproximationDistanceScore({
          targetFeatures,
          candidateFeatures: row.features,
          cutKey: input.cutKey
        })
      }))
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 18);

    if (!nearest.length) return null;

    const weighted = nearest.reduce(
      (accumulator, candidate) => {
        const weight = 1 / Math.pow(candidate.distance + 0.08, 2);
        const ratio = candidate.row.referenceTotal / Math.max(candidate.row.formulaTotal, 1);
        accumulator.totalWeight += weight;
        accumulator.totalRatio += ratio * weight;
        return accumulator;
      },
      { totalWeight: 0, totalRatio: 0 }
    );

    if (!weighted.totalWeight) return null;
    return formulaTotal * (weighted.totalRatio / weighted.totalWeight);
  };
  const getSizeDistanceScore = ({ targetWidth, targetHeight, candidateWidth, candidateHeight, targetItemsPerSheet, candidateItemsPerSheet }) => {
    const widthNorm = Math.max(targetWidth, 40);
    const heightNorm = Math.max(targetHeight, 40);
    const areaRatio = (candidateWidth * candidateHeight) / Math.max(targetWidth * targetHeight, 1);
    const targetAspect = targetWidth / Math.max(targetHeight, 1);
    const candidateAspect = candidateWidth / Math.max(candidateHeight, 1);
    const sheetDensityDelta = Math.abs((candidateItemsPerSheet || 0) - (targetItemsPerSheet || 0)) / Math.max(targetItemsPerSheet || 1, 1);

    return (
      Math.hypot((candidateWidth - targetWidth) / widthNorm, (candidateHeight - targetHeight) / heightNorm) +
      Math.abs(Math.log(Math.max(areaRatio, 0.0001))) * 0.35 +
      Math.abs(Math.log(Math.max(candidateAspect / Math.max(targetAspect, 0.0001), 0.0001))) * 0.2 +
      sheetDensityDelta * 0.45
    );
  };
  const getReferenceAdjustedTotal = ({ input, data, formulaTotal, itemsPerSheet, sheets, cutCharge }) => {
    if (input.materialKey === "paperSlits" && input.cutKey === "pieceTrim") {
      return formulaTotal;
    }

    if (
      input.materialKey === "paperSlits" &&
      Number.isFinite(cutCharge?.smallItemRunSurcharge) &&
      cutCharge.smallItemRunSurcharge > 0
    ) {
      return formulaTotal;
    }

    const shouldUseUpwardOnlyPieceTrimApproximation =
      input.materialKey === "paperSlits" &&
      input.cutKey === "pieceTrim";

    if (!shouldUseUpwardOnlyPieceTrimApproximation) {
      const featureAdjustedTotal = getFeatureAdjustedReferenceTotal({
        input,
        data,
        formulaTotal,
        itemsPerSheet,
        sheets,
        cutCharge
      });
      if (Number.isFinite(featureAdjustedTotal)) return featureAdjustedTotal;
    }

    const candidateSizes = getReferenceSizesForSeries({
      materialKey: input.materialKey,
      printKey: input.printKey,
      finishKey: input.finishKey,
      cutKey: input.cutKey
    });
    if (!candidateSizes.length) return null;

    const candidates = [];
    for (const candidate of candidateSizes) {
      if (candidate.width === input.width && candidate.height === input.height) continue;

      const candidateFormula = calculate(
        {
          ...input,
          width: candidate.width,
          height: candidate.height,
          ignoreExactReference: true,
          ignoreReferenceApproximation: true
        },
        data
      );
      if (!candidateFormula?.ok) continue;

      const candidateReference = getReferenceSeriesTotal({
        width: candidate.width,
        height: candidate.height,
        quantity: input.quantity,
        materialKey: input.materialKey,
        printKey: input.printKey,
        finishKey: input.finishKey,
        cutKey: input.cutKey
      });
      if (!Number.isFinite(candidateReference)) continue;

      const distance = getSizeDistanceScore({
        targetWidth: input.width,
        targetHeight: input.height,
        candidateWidth: candidate.width,
        candidateHeight: candidate.height,
        targetItemsPerSheet: itemsPerSheet,
        candidateItemsPerSheet: candidateFormula.itemsPerSheet
      });

      candidates.push({
        width: candidate.width,
        height: candidate.height,
        distance,
        delta: candidateReference - candidateFormula.total,
        referenceTotal: candidateReference
      });
    }

    if (!candidates.length) return null;

    const nearest = candidates.sort((left, right) => left.distance - right.distance).slice(0, 6);
    const weighted = nearest.reduce(
      (accumulator, candidate) => {
        const weight = 1 / Math.pow(candidate.distance + 0.15, 2);
        accumulator.totalWeight += weight;
        accumulator.totalDelta += candidate.delta * weight;
        return accumulator;
      },
      { totalWeight: 0, totalDelta: 0 }
    );

    if (!weighted.totalWeight) return null;
    let adjustedTotal = formulaTotal + weighted.totalDelta / weighted.totalWeight;

    if (input.materialKey === "paperSlits" && input.cutKey === "pieceTrim") {
      const targetArea = Math.max(input.width * input.height, 1);
      const envelopeCandidates = nearest.filter((candidate) => {
        const areaRatio = (candidate.width * candidate.height) / targetArea;
        return areaRatio >= 0.78 && areaRatio <= 1.35;
      });

      if (envelopeCandidates.length >= 2) {
        const envelopeFloor = Math.max(...envelopeCandidates.map((candidate) => candidate.referenceTotal));
        adjustedTotal = Math.max(adjustedTotal, envelopeFloor);
      }

      adjustedTotal = Math.max(adjustedTotal, formulaTotal);
    }

    return adjustedTotal;
  };
  const isBelowCutMinimum = ({ width, height, cutConfig }) => {
    if (!cutConfig) return false;
    const minWidth = cutConfig.minWidth ?? 0;
    const minHeight = cutConfig.minHeight ?? 0;
    return width < minWidth || height < minHeight;
  };

  const getMaterialCharge = (sheets, materialConfig) => {
    const totalSheets = normalizeSheetCount(sheets);
    const baseMaterialPerSheet = materialConfig?.sheetCost;

    if (Array.isArray(materialConfig?.curve) && materialConfig.curve.length) {
      const amount = getCurveValue({
        scaleValue: totalSheets,
        points: materialConfig.curve,
        scaleKey: "sheets",
        floorPerUnit: baseMaterialPerSheet ?? 0
      });
      return {
        amount,
        baseMaterialPerSheet: totalSheets ? amount / totalSheets : baseMaterialPerSheet,
        missing: false
      };
    }

    if (!Number.isFinite(baseMaterialPerSheet)) {
      return { amount: 0, baseMaterialPerSheet: null, missing: true };
    }

    return {
      amount: baseMaterialPerSheet * totalSheets,
      baseMaterialPerSheet,
      missing: false
    };
  };

  const getSteppedRate = (sheets, config) => {
    const totalSheets = normalizeSheetCount(sheets);
    const tier = pickTier(config?.tiers, totalSheets);
    const rawRate = tier?.ratePerSheet ?? config?.ratePerSheet ?? 0;
    const floorPerSheet = config?.floorPerSheet ?? 0;
    const appliedRate = Math.max(rawRate, floorPerSheet);

    return {
      ratePerSheet: appliedRate,
      floorPerSheet,
      tier
    };
  };

  const getFormulaRate = (sheets, config) => {
    const totalSheets = normalizeSheetCount(sheets);
    const floorPerSheet = config?.floorPerSheet ?? 0;
    const basePerSheet = config?.basePerSheet ?? 0;
    const curveFactor = config?.curveFactor ?? 0;
    const exponent = config?.curveExponent ?? 1;
    const rawRate = basePerSheet + curveFactor / Math.pow(Math.max(totalSheets, 1), exponent);
    const appliedRate = Math.max(rawRate, floorPerSheet);

    return {
      ratePerSheet: appliedRate,
      floorPerSheet,
      tier: null
    };
  };

  const getCurveCharge = (sheets, config) => {
    const totalSheets = normalizeSheetCount(sheets);
    const points = Array.isArray(config?.curve) ? config.curve : [];
    if (!points.length || !totalSheets) {
      return { amount: 0, ratePerSheet: 0, floorPerSheet: config?.floorPerSheet ?? 0, tier: null };
    }
    const floorPerSheet = config?.floorPerSheet ?? 0;
    const amount = getCurveValue({ scaleValue: totalSheets, points, scaleKey: "sheets", floorPerUnit: floorPerSheet });

    return {
      amount,
      ratePerSheet: amount / totalSheets,
      floorPerSheet,
      tier: null
    };
  };

  const getPrintCharge = (sheets, printConfig) => {
    const totalSheets = normalizeSheetCount(sheets);
    if (!printConfig || printConfig.mode === "none" || !totalSheets) {
      return { amount: 0, ratePerSheet: 0, floorPerSheet: 0, tier: null };
    }

    if (Array.isArray(printConfig.curve) && printConfig.curve.length) {
      return getCurveCharge(totalSheets, printConfig);
    }

    const strategy = printConfig.formula ? getFormulaRate(totalSheets, printConfig) : getSteppedRate(totalSheets, printConfig);
    return {
      amount: strategy.ratePerSheet * totalSheets,
      ratePerSheet: strategy.ratePerSheet,
      floorPerSheet: strategy.floorPerSheet,
      tier: strategy.tier
    };
  };

  const getAreaMinimum = (width, height, rules) => {
    if (!Array.isArray(rules) || !rules.length) return 0;
    const area = width * height;
    const match = [...rules]
      .sort((a, b) => a.maxArea - b.maxArea)
      .find((rule) => area <= rule.maxArea);
    return match?.total ?? 0;
  };

  const getDensityBucketMinimum = ({ width, height, itemsPerSheet, rules }) => {
    if (!Array.isArray(rules) || !rules.length) return 0;

    const safeItems = Math.max(1, Math.floor(itemsPerSheet || 1));
    const shortSide = Math.min(width, height);
    const longSide = Math.max(width, height);

    const match = [...rules]
      .sort((left, right) => (left.maxItemsPerSheet ?? Infinity) - (right.maxItemsPerSheet ?? Infinity))
      .find((rule) => {
        const maxItems = rule.maxItemsPerSheet ?? Infinity;
        const minItems = rule.minItemsPerSheet ?? 0;
        const minShort = rule.minShortSide ?? 0;
        const maxShort = rule.maxShortSide ?? Infinity;
        const minLong = rule.minLongSide ?? 0;
        const maxLong = rule.maxLongSide ?? Infinity;

        return (
          safeItems >= minItems &&
          safeItems <= maxItems &&
          shortSide >= minShort &&
          shortSide <= maxShort &&
          longSide >= minLong &&
          longSide <= maxLong
        );
      });

    return match?.total ?? 0;
  };
  const getSmallItemRunSurcharge = ({ width, height, quantity, sheets, cutConfig, materialKey }) => {
      const basePricing = cutConfig?.smallItemRunPricing;
      if (!basePricing) return 0;
      const pricing = basePricing?.materialOverrides?.[materialKey]
        ? { ...basePricing, ...basePricing.materialOverrides[materialKey] }
        : basePricing;
      if (!pricing) return 0;
      if (Array.isArray(pricing.materialKeys) && !pricing.materialKeys.includes(materialKey)) return 0;

    const itemArea = Math.max(1, width * height);
    const fullRateMaxArea = Math.max(1, pricing.fullRateMaxArea ?? 0);
    const taperMaxArea = Math.max(fullRateMaxArea, pricing.taperMaxArea ?? fullRateMaxArea);
    if (itemArea >= taperMaxArea) return 0;

    const safeSheets = Math.max(1, normalizeSheetCount(sheets));
    const safeQuantity = Math.max(0, Math.ceil(quantity || 0));
    if (!safeQuantity) return 0;

    const averageItemsPerUsedSheet = safeQuantity / safeSheets;
    const threshold = pricing.thresholdItemsPerUsedSheet ?? 0;
    if (averageItemsPerUsedSheet <= threshold) return 0;

    const areaFactor = itemArea <= fullRateMaxArea
      ? 1
      : 1 - (itemArea - fullRateMaxArea) / Math.max(taperMaxArea - fullRateMaxArea, 1);

    return Math.sqrt(Math.max(0, averageItemsPerUsedSheet - threshold)) * Math.max(0, areaFactor) * (pricing.ratePerExtraItem ?? 0);
  };
  const getMediumRunSheetSurcharge = ({ sheets, itemsPerSheet, cutConfig, materialKey }) => {
    const pricing = cutConfig?.mediumRunSheetPricing;
    if (!pricing) return 0;
    if (Array.isArray(pricing.materialKeys) && !pricing.materialKeys.includes(materialKey)) return 0;

    const safeSheets = Math.max(1, normalizeSheetCount(sheets));
    if (safeSheets > Math.max(1, pricing.maxSheets ?? safeSheets)) return 0;

    const safeItemsPerSheet = Math.max(1, Math.floor(itemsPerSheet || 1));
    const threshold = pricing.thresholdItemsPerSheet ?? 0;
    if (safeItemsPerSheet >= threshold) return 0;

    return (threshold - safeItemsPerSheet) * safeSheets * (pricing.ratePerMissingItemPerSheet ?? 0);
  };
  const getElongatedShapeSurcharge = ({ width, height, sheets, cutConfig, materialKey, baseAmount, printKey }) => {
    const pricing = cutConfig?.elongatedShapePricing;
    if (!pricing || !Number.isFinite(baseAmount) || baseAmount <= 0) return 0;
    if (Array.isArray(pricing.materialKeys) && !pricing.materialKeys.includes(materialKey)) return 0;

    const shortSide = Math.max(1, Math.min(width, height));
    const longSide = Math.max(shortSide, Math.max(width, height));
    if (Number.isFinite(pricing.maxLongSide) && longSide > pricing.maxLongSide) return 0;
    const aspectRatio = longSide / shortSide;
    const excessAspect = aspectRatio - (pricing.minAspectRatio ?? aspectRatio);
    if (excessAspect <= 0) return 0;

    const safeSheets = Math.max(1, normalizeSheetCount(sheets));
    const aspectFactor = Math.pow(excessAspect, pricing.exponent ?? 1);
    const sheetFactor = Math.pow(safeSheets, pricing.sheetExponent ?? 1);
    const printModeFactor = pricing.printModeFactors?.[printKey] ?? 1;
    return baseAmount * aspectFactor * sheetFactor * (pricing.multiplier ?? 0) * printModeFactor;
  };
  const getLongNarrowRunSurcharge = ({ width, height, sheets, cutConfig, materialKey, printKey }) => {
    const pricing = cutConfig?.longNarrowRunPricing;
    if (!pricing) return 0;
    if (Array.isArray(pricing.materialKeys) && !pricing.materialKeys.includes(materialKey)) return 0;

    const shortSide = Math.max(1, Math.min(width, height));
    const longSide = Math.max(shortSide, Math.max(width, height));
    if (longSide < (pricing.minLongSide ?? Infinity)) return 0;
    if (shortSide > (pricing.shortSideLimit ?? 0)) return 0;
    if (shortSide <= (pricing.shortSideBypassThreshold ?? 0) && longSide > (pricing.longSideSoftCap ?? longSide)) return 0;
    if (
      longSide <= (pricing.upperLongRangeLimit ?? -Infinity) &&
      shortSide >= (pricing.upperLongRangeShortSideBypass ?? Infinity)
    ) {
      return 0;
    }

    const sheetFactor = Math.min(Math.max(1, normalizeSheetCount(sheets)), pricing.maxSheetFactor ?? normalizeSheetCount(sheets));
    const widthFactor = Math.max(0, (pricing.baseShortSide ?? 0) - shortSide);
    if (!widthFactor) return 0;

    const longSideFactor = Math.min(1, (pricing.longSideSoftCap ?? longSide) / Math.max(longSide, 1));
    const printModeFactor = pricing.printModeFactors?.[printKey] ?? 1;
    return (widthFactor * sheetFactor * longSideFactor * printModeFactor) / Math.max(pricing.sheetDivisor ?? 1, 1);
  };
  const getVeryLongFormatSurcharge = ({ width, height, sheets, cutConfig, materialKey, printKey }) => {
    const pricing = cutConfig?.veryLongFormatPricing;
    if (!pricing) return 0;
    if (Array.isArray(pricing.materialKeys) && !pricing.materialKeys.includes(materialKey)) return 0;

    const shortSide = Math.max(1, Math.min(width, height));
    const longSide = Math.max(shortSide, Math.max(width, height));
    if (longSide < (pricing.minLongSide ?? Infinity)) return 0;
    if (shortSide < (pricing.minShortSide ?? 0)) return 0;
    if (shortSide > (pricing.shortSideLimit ?? Infinity)) return 0;

    const extraWidth = Math.max(0, shortSide - (pricing.baseShortSide ?? shortSide));

    const safeSheets = Math.max(1, normalizeSheetCount(sheets));
    const printModeFactor = pricing.printModeFactors?.[printKey] ?? 1;
    const longSideFactor = Math.pow(
      (pricing.longSideReference ?? longSide) / Math.max(longSide, 1),
      pricing.longSideDecayExponent ?? 1
    );
    return (
      (pricing.basePerSheet ?? 0) * safeSheets +
      extraWidth * safeSheets * (pricing.ratePerMmPerSheet ?? 0)
    ) * printModeFactor * longSideFactor;
  };
  const getLongFormat300NarrowSurcharge = ({ width, height, sheets, cutConfig, materialKey }) => {
    const pricing = cutConfig?.longFormat300NarrowPricing;
    if (!pricing) return 0;
    if (Array.isArray(pricing.materialKeys) && !pricing.materialKeys.includes(materialKey)) return 0;

    const shortSide = Math.max(1, Math.min(width, height));
    const longSide = Math.max(shortSide, Math.max(width, height));
    if (longSide < (pricing.minLongSide ?? Infinity)) return 0;
    if (longSide > (pricing.maxLongSide ?? -Infinity)) return 0;
    if (shortSide < (pricing.minShortSide ?? 0)) return 0;
    if (shortSide > (pricing.shortSideLimit ?? Infinity)) return 0;

    return Math.max(1, normalizeSheetCount(sheets)) * (pricing.ratePerSheet ?? 0);
  };

  const getCutDensityMetric = ({ width, height, itemsPerSheet, densityConfig, profile }) => {
    if (!densityConfig) return 0;
    const safeItemsPerSheet = Math.max(1, Math.floor(itemsPerSheet || 1));
    const freeItemsPerSheet = Math.max(1, Math.floor(densityConfig.freeItemsPerSheet || 1));
    if (safeItemsPerSheet <= freeItemsPerSheet) return 0;

    if (densityConfig.metric === "inverseAreaLog") {
      const itemArea = Math.max(1, width * height);
      const referenceArea = Math.max(1, (profile?.printWidth || 0) * (profile?.printHeight || 0));
      return Math.max(0, Math.log(referenceArea / itemArea));
    }

    return Math.max(0, Math.log(safeItemsPerSheet / freeItemsPerSheet));
  };

  const getSheetGrowthFactor = (totalSheets, densityConfig) => {
    if (totalSheets <= 1) return 0;
    if (densityConfig?.sheetGrowth === "log") return Math.log(totalSheets);
    return Math.max(0, totalSheets - 1);
  };

  const getContourLengthMm = ({ width, height, quantity, cutConfig, contourLengthMm }) => {
    const safeQuantity = Math.max(0, Math.ceil(quantity || 0));
    if (!safeQuantity) return { perItemMm: 0, totalMm: 0 };

    const actualPerimeterMm = Math.max(0, 2 * (width + height));
    const contourMarginMm = cutConfig?.defaultMarginMm ?? 0;
    const perimeterWithMarginMm = Math.max(0, 2 * ((width + contourMarginMm * 2) + (height + contourMarginMm * 2)));
    const basePerItemMm = cutConfig?.contourLengthMode === "averageWithBleed"
      ? (actualPerimeterMm + perimeterWithMarginMm) / 2
      : actualPerimeterMm;
    const configuredPerItemMm = Number.isFinite(contourLengthMm) && contourLengthMm > 0
      ? contourLengthMm
      : basePerItemMm * (cutConfig?.contourLengthMultiplier ?? 1);

    return {
      perItemMm: configuredPerItemMm,
      totalMm: configuredPerItemMm * safeQuantity,
      contourMarginMm
    };
  };

  const getContourMeterRate = ({ quantity, sheets, cutConfig }) => {
    const baseRate = cutConfig?.pricePerMeter ?? 0;
    const formula = cutConfig?.pricePerMeterFormula;
    if (!formula) return baseRate;

    const scaleValue = formula.scaleBy === "sheets"
      ? Math.max(1, normalizeSheetCount(sheets))
      : Math.max(1, Math.ceil(quantity || 0));
    const floorRate = formula.floorPerMeter ?? baseRate;
    const maxRate = formula.maxPerMeter ?? Infinity;
    const extraRate = (formula.curveFactor ?? 0) / Math.pow(scaleValue, formula.exponent ?? 1);
    return Math.max(floorRate, Math.min(maxRate, floorRate + extraRate));
  };

  const getSimpleBucketCutCharge = ({ totalSheets, itemsPerSheet, width, height, simpleBucketPricing }) => {
    if (!simpleBucketPricing) return null;

    const safeItemsPerSheet = Math.max(1, Math.floor(itemsPerSheet || 1));
    const safeSheets = Math.max(1, normalizeSheetCount(totalSheets));
    const shortSide = Math.max(1, Math.min(width || 0, height || 0));
    const longSide = Math.max(shortSide, Math.max(width || 0, height || 0));
    const aspectRatio = longSide / shortSide;
    const bucket = [...(simpleBucketPricing.buckets || [])]
      .sort((left, right) => (left.maxItemsPerSheet ?? Infinity) - (right.maxItemsPerSheet ?? Infinity))
      .find((entry) => safeItemsPerSheet <= (entry.maxItemsPerSheet ?? Infinity));
    if (!bucket || !Number.isFinite(bucket.total)) return null;

    const sheetSurcharge = [...(simpleBucketPricing.sheetSurcharges || [])]
      .sort((left, right) => (left.minSheets ?? 0) - (right.minSheets ?? 0))
      .reduce((total, entry) => (safeSheets >= (entry.minSheets ?? Infinity) ? entry.total ?? total : total), 0);

    const aspectSurcharge = [...(simpleBucketPricing.aspectSurcharges || [])]
      .sort((left, right) => (left.minAspectRatio ?? 0) - (right.minAspectRatio ?? 0))
      .reduce((total, entry) => (aspectRatio >= (entry.minAspectRatio ?? Infinity) ? entry.total ?? total : total), 0);

    return {
      amount: bucket.total + sheetSurcharge + aspectSurcharge,
      bucketTotal: bucket.total,
      sheetSurcharge,
      aspectSurcharge
    };
  };

  const getSimpleContourCutCharge = ({
    width,
    height,
    quantity,
    itemsPerSheet,
    sheets,
    contourLengthMm,
    simpleContourPricing
  }) => {
    if (!simpleContourPricing) return null;

    const area = Math.max(1, (width || 0) * (height || 0));
    const shortSide = Math.max(1, Math.min(width || 0, height || 0));
    const longSide = Math.max(shortSide, Math.max(width || 0, height || 0));
    const aspectRatio = longSide / shortSide;
    const safeItemsPerSheet = Math.max(1, Math.floor(itemsPerSheet || 1));
    const safeSheets = Math.max(1, normalizeSheetCount(sheets));

    const longNarrowBucket = [...(simpleContourPricing.longNarrowBuckets || [])]
      .sort((left, right) => (left.minAspectRatio ?? 0) - (right.minAspectRatio ?? 0))
      .find((entry) =>
        aspectRatio >= (entry.minAspectRatio ?? 0) &&
        safeItemsPerSheet <= (entry.maxItemsPerSheet ?? Infinity)
      );
    if (longNarrowBucket && (Number.isFinite(longNarrowBucket.total) || Number.isFinite(longNarrowBucket.baseTotal))) {
      const amount = Number.isFinite(longNarrowBucket.total)
        ? longNarrowBucket.total
        : (longNarrowBucket.baseTotal ?? 0) + safeSheets * (longNarrowBucket.ratePerSheet ?? 0);
      return {
        amount,
        fixedCharge: 0,
        pricePerMeter: 0,
        contourLengthPerItemMm: contourLengthMm?.perItemMm ?? 0,
        contourLengthTotalMm: contourLengthMm?.totalMm ?? 0,
        contourMarginMm: contourLengthMm?.contourMarginMm ?? 0,
        densitySurcharge: 0,
        largeFormatBucketTotal: 0
      };
    }

    const balancedMediumBucket = [...(simpleContourPricing.balancedMediumBuckets || [])]
      .find((entry) =>
        area >= (entry.minArea ?? 0) &&
        area <= (entry.maxArea ?? Infinity) &&
        safeItemsPerSheet >= (entry.minItemsPerSheet ?? 0) &&
        safeItemsPerSheet <= (entry.maxItemsPerSheet ?? Infinity) &&
        aspectRatio <= (entry.maxAspectRatio ?? Infinity)
      );
    if (balancedMediumBucket && Number.isFinite(balancedMediumBucket.total)) {
      return {
        amount: balancedMediumBucket.total,
        fixedCharge: 0,
        pricePerMeter: 0,
        contourLengthPerItemMm: contourLengthMm?.perItemMm ?? 0,
        contourLengthTotalMm: contourLengthMm?.totalMm ?? 0,
        contourMarginMm: contourLengthMm?.contourMarginMm ?? 0,
        densitySurcharge: 0,
        largeFormatBucketTotal: 0
      };
    }

    const mediumFormatBucket = [...(simpleContourPricing.mediumFormatBuckets || [])]
      .sort((left, right) => (left.maxItemsPerSheet ?? Infinity) - (right.maxItemsPerSheet ?? Infinity))
      .find((entry) =>
        area >= (entry.minArea ?? 0) &&
        area <= (entry.maxArea ?? Infinity) &&
        safeItemsPerSheet <= (entry.maxItemsPerSheet ?? Infinity)
      );
    if (mediumFormatBucket && (Number.isFinite(mediumFormatBucket.total) || Number.isFinite(mediumFormatBucket.baseTotal))) {
      const amount = Number.isFinite(mediumFormatBucket.total)
        ? mediumFormatBucket.total
        : (mediumFormatBucket.baseTotal ?? 0) + safeSheets * (mediumFormatBucket.ratePerSheet ?? 0);
      return {
        amount,
        fixedCharge: 0,
        pricePerMeter: 0,
        contourLengthPerItemMm: contourLengthMm?.perItemMm ?? 0,
        contourLengthTotalMm: contourLengthMm?.totalMm ?? 0,
        contourMarginMm: contourLengthMm?.contourMarginMm ?? 0,
        densitySurcharge: 0,
        largeFormatBucketTotal: 0
      };
    }

    const largeFormatBucket = [...(simpleContourPricing.largeFormatBuckets || [])]
      .sort((left, right) => (left.maxItemsPerSheet ?? Infinity) - (right.maxItemsPerSheet ?? Infinity))
      .find((entry) =>
        area >= (entry.minArea ?? 0) &&
        safeItemsPerSheet <= (entry.maxItemsPerSheet ?? Infinity)
      );
    if (largeFormatBucket && (Number.isFinite(largeFormatBucket.total) || Number.isFinite(largeFormatBucket.baseTotal))) {
      const amount = Number.isFinite(largeFormatBucket.total)
        ? largeFormatBucket.total
        : (largeFormatBucket.baseTotal ?? 0) + safeSheets * (largeFormatBucket.ratePerSheet ?? 0);
      return {
        amount,
        fixedCharge: 0,
        pricePerMeter: 0,
        contourLengthPerItemMm: contourLengthMm?.perItemMm ?? 0,
        contourLengthTotalMm: contourLengthMm?.totalMm ?? 0,
        contourMarginMm: contourLengthMm?.contourMarginMm ?? 0,
        densitySurcharge: 0,
        largeFormatBucketTotal: amount
      };
    }

    const totalMeters = Math.max(0, Number(contourLengthMm?.totalMm || 0) / 1000);
    const densitySurcharge = [...(simpleContourPricing.densitySurcharges || [])]
      .sort((left, right) => (left.minItemsPerSheet ?? 0) - (right.minItemsPerSheet ?? 0))
      .reduce((total, entry) => (safeItemsPerSheet >= (entry.minItemsPerSheet ?? Infinity) ? entry.total ?? total : total), 0);

    const amount = Math.max(
      (simpleContourPricing.base ?? 0) + totalMeters * (simpleContourPricing.ratePerMeter ?? 0) + densitySurcharge,
      simpleContourPricing.minTotal ?? 0
    );

    return {
      amount,
      fixedCharge: simpleContourPricing.base ?? 0,
      pricePerMeter: simpleContourPricing.ratePerMeter ?? 0,
      contourLengthPerItemMm: contourLengthMm?.perItemMm ?? 0,
      contourLengthTotalMm: contourLengthMm?.totalMm ?? 0,
      contourMarginMm: contourLengthMm?.contourMarginMm ?? 0,
      densitySurcharge
    };
  };

    const getCutCharge = ({ width, height, quantity, sheets, itemsPerSheet, cutConfig, profile, contourLengthMm, materialKey, printKey, materialConfig, cutKey }) => {
    const totalSheets = normalizeSheetCount(sheets);
    if (!cutConfig) return { amount: 0 };

    const cutOverride = materialConfig?.cutOverrides?.[cutKey] || null;
    const simpleBucketCharge = getSimpleBucketCutCharge({
      totalSheets,
      itemsPerSheet,
      width,
      height,
      simpleBucketPricing: cutOverride?.simpleBucketPricing
    });
    if (simpleBucketCharge) return simpleBucketCharge;

    const simpleContourLength = getContourLengthMm({ width, height, quantity, cutConfig, contourLengthMm });
    const simpleContourCharge = getSimpleContourCutCharge({
      width,
      height,
      quantity,
      itemsPerSheet,
      sheets: totalSheets,
      contourLengthMm: simpleContourLength,
      simpleContourPricing: cutOverride?.simpleContourPricing
    });
    if (simpleContourCharge) return simpleContourCharge;

    if (Number.isFinite(cutConfig.pricePerMeter) && cutConfig.pricePerMeter > 0) {
      const contourLength = getContourLengthMm({ width, height, quantity, cutConfig, contourLengthMm });
      const totalMeters = contourLength.totalMm / 1000;
      const fixedCharge = cutConfig.fixedCharge ?? 0;
      const pricePerMeter = getContourMeterRate({ quantity, sheets: totalSheets, cutConfig });
      let amount = Math.max(
        fixedCharge + totalMeters * pricePerMeter,
        cutConfig.minCharge ?? 0
      );

      const contourMultiplier = materialConfig?.cutOverrides?.digitalContour?.amountMultiplier;
      if (Number.isFinite(contourMultiplier) && contourMultiplier > 0) {
        amount *= contourMultiplier;
      }

      return {
        amount,
        fixedCharge,
        pricePerMeter,
        contourLengthPerItemMm: contourLength.perItemMm,
        contourLengthTotalMm: contourLength.totalMm,
        contourMarginMm: contourLength.contourMarginMm
      };
    }

    const fixedCharge = cutConfig.fixedCharge ?? 0;
    const perSheetCharge = cutConfig.pricePerSheet ?? 0;
    const densityConfig = cutConfig.densityPricing || null;
    const areaMinimum = getAreaMinimum(width, height, cutConfig.minimumByArea);
    const densityBucketMinimum = getDensityBucketMinimum({
      width,
      height,
      itemsPerSheet,
      rules: cutConfig.densityBuckets
    });
    const baseCurveAmount = Array.isArray(cutConfig.baseCurve)
      ? getCurveValue({
        scaleValue: cutConfig.baseCurveScaleBy === "sheets" ? totalSheets : Math.max(0, Math.ceil(quantity || 0)),
        points: cutConfig.baseCurve,
        scaleKey: cutConfig.baseCurveScaleBy === "sheets" ? "sheets" : "quantity"
      })
      : 0;
    const densityMetric = getCutDensityMetric({ width, height, itemsPerSheet, densityConfig, profile });
    const densityBaseComplexity = densityConfig ? Math.pow(densityMetric, densityConfig.exponent ?? 1) : 0;
    const densityRunComplexity = densityConfig
      ? Math.pow(densityMetric, densityConfig.runExponent ?? densityConfig.exponent ?? 1)
      : 0;
    const densityBase = densityConfig ? (densityConfig.base ?? 0) * densityBaseComplexity : 0;
    const densityRun = densityConfig
      ? (densityConfig.runPerSheet ?? 0) * densityRunComplexity * getSheetGrowthFactor(totalSheets, densityConfig)
      : 0;
    const smallItemRunSurcharge = getSmallItemRunSurcharge({
      width,
      height,
      quantity,
      sheets: totalSheets,
      cutConfig,
      materialKey
    });
    const mediumRunSheetSurcharge = getMediumRunSheetSurcharge({
      sheets: totalSheets,
      itemsPerSheet,
      cutConfig,
      materialKey
    });
    const elongatedShapeSurcharge = getElongatedShapeSurcharge({
      width,
      height,
      sheets: totalSheets,
      cutConfig,
      materialKey,
      baseAmount: Math.max(baseCurveAmount + fixedCharge + perSheetCharge * totalSheets, areaMinimum, densityBucketMinimum),
      printKey
    });
    const longNarrowRunSurcharge = getLongNarrowRunSurcharge({
      width,
      height,
      sheets: totalSheets,
      cutConfig,
      materialKey,
      printKey
    });
    const veryLongFormatSurcharge = getVeryLongFormatSurcharge({
      width,
      height,
      sheets: totalSheets,
      cutConfig,
      materialKey,
      printKey
    });
    const longFormat300NarrowSurcharge = getLongFormat300NarrowSurcharge({
      width,
      height,
      sheets: totalSheets,
      cutConfig,
      materialKey
    });
    const amountBeforeElongation = Math.max(
      baseCurveAmount + fixedCharge + perSheetCharge * totalSheets + densityBase + densityRun + smallItemRunSurcharge + mediumRunSheetSurcharge,
      cutConfig.minCharge ?? 0,
      areaMinimum,
      densityBucketMinimum
    );
    let amount = amountBeforeElongation + elongatedShapeSurcharge + longNarrowRunSurcharge + veryLongFormatSurcharge + longFormat300NarrowSurcharge;

    const genericMultiplier = materialConfig?.cutOverrides?.[cutKey]?.amountMultiplier;
    if (Number.isFinite(genericMultiplier) && genericMultiplier > 0) {
      amount *= genericMultiplier;
    }

    return {
      amount,
      baseCurveAmount,
      fixedCharge,
      pricePerSheet: perSheetCharge,
      areaMinimum,
      densityBucketMinimum,
      densityBase,
      densityRun,
      smallItemRunSurcharge,
      mediumRunSheetSurcharge,
      amountBeforeElongation,
      elongatedShapeSurcharge,
      longNarrowRunSurcharge,
      veryLongFormatSurcharge,
      longFormat300NarrowSurcharge
    };
  };

    const getFinishCharge = (sheets, finishConfig) => {
      const totalSheets = normalizeSheetCount(sheets);
      if (!finishConfig || finishConfig.mode === "none" || !totalSheets) {
        return { amount: 0, pricePerSheet: 0 };
      }

    const fixedCharge = finishConfig.fixedCharge ?? 0;
    const pricePerSheet = finishConfig.pricePerSheet ?? 0;
    const curveAmount = Array.isArray(finishConfig.curve)
      ? getCurveValue({ scaleValue: totalSheets, points: finishConfig.curve, scaleKey: "sheets" })
      : 0;
    return {
      amount: Math.max(curveAmount + fixedCharge + pricePerSheet * totalSheets, finishConfig.minCharge ?? 0),
      curveAmount,
      fixedCharge,
        pricePerSheet
      };
    };

    const getMaterialBaseAdjustment = ({
      input,
      width,
      height,
      itemsPerSheet,
      sheets,
      materialConfig
    }) => {
      const adjustments = Array.isArray(materialConfig?.baseAdjustments) ? materialConfig.baseAdjustments : [];
      if (!adjustments.length) return 0;

      const area = Math.max(1, (width || 0) * (height || 0));
      const shortSide = Math.max(1, Math.min(width || 0, height || 0));
      const longSide = Math.max(shortSide, Math.max(width || 0, height || 0));
      const aspectRatio = longSide / shortSide;
      const safeItemsPerSheet = Math.max(1, Math.floor(itemsPerSheet || 1));
      const safeSheets = Math.max(1, normalizeSheetCount(sheets));

      const match = adjustments.find((entry) =>
        area >= (entry.minArea ?? 0) &&
        area <= (entry.maxArea ?? Infinity) &&
        safeItemsPerSheet >= (entry.minItemsPerSheet ?? 0) &&
        safeItemsPerSheet <= (entry.maxItemsPerSheet ?? Infinity) &&
        safeSheets >= (entry.minSheets ?? 0) &&
        safeSheets <= (entry.maxSheets ?? Infinity) &&
        aspectRatio >= (entry.minAspectRatio ?? 0) &&
        aspectRatio <= (entry.maxAspectRatio ?? Infinity)
      );
      if (!match) return 0;

      const printDiscount = match.printDiscounts?.[input.printKey];
      if (Number.isFinite(printDiscount)) return printDiscount;
      if (Number.isFinite(match.discount)) return match.discount;
      return 0;
    };
  
      const getMaterialStatus = (materialConfig) => {
      if (!materialConfig) return { canQuote: false, isApproximate: false, note: "" };

    return {
      canQuote: materialConfig.canQuote !== false,
      isApproximate: !!materialConfig.isApproximate,
      note: materialConfig.note || ""
      };
    };

  const applyDeltaPreservingNonNegativeCharges = ({
      delta,
      input,
      materialCharge,
      printCharge,
      cutCharge,
      finishCharge,
      sheets,
      finishKey
    }) => {
      if (!Number.isFinite(delta) || delta === 0) return;

      const applyWithFallback = (charge) => {
        const nextAmount = (charge?.amount ?? 0) + delta;
        if (nextAmount >= 0) {
          charge.amount = nextAmount;
          return;
        }

        charge.amount = 0;
        materialCharge.amount += nextAmount;
      };

      if (input.cutKey !== "trim") {
        applyWithFallback(cutCharge);
        return;
      }

      if (finishKey !== "none") {
        applyWithFallback(finishCharge);
        return;
      }

      applyWithFallback(printCharge);
      if (sheets.totalSheets > 0) {
        printCharge.ratePerSheet = printCharge.amount / sheets.totalSheets;
      }
    };

  const getMaterialDigitalContourModeledTotal = ({
    input,
    data,
    materialConfig,
    finishKey,
    cutCharge
  }) => {
    if (input.cutKey !== "digitalContour" || input.ignoreContourPieceTrimModel) return null;

    const deltaModel = materialConfig?.cutOverrides?.digitalContour?.pieceTrimDeltaModel;
    if (!deltaModel) return null;

    const totalMeters = Number.isFinite(cutCharge?.contourLengthTotalMm)
      ? cutCharge.contourLengthTotalMm / 1000
      : null;
    const perItemMeters = Number.isFinite(cutCharge?.contourLengthPerItemMm)
      ? cutCharge.contourLengthPerItemMm / 1000
      : null;
    if (!Number.isFinite(totalMeters) || !Number.isFinite(perItemMeters)) return null;

    const pieceTrimQuote = calculate(
      {
        ...input,
        cutKey: "pieceTrim",
        finishKey,
        ignoreContourPieceTrimModel: true
      },
      data
    );
    if (!pieceTrimQuote?.ok || !Number.isFinite(pieceTrimQuote.total)) return null;

    const contourDelta = Math.max(
      deltaModel.minDelta ?? 0,
      (deltaModel.base ?? 0) +
        totalMeters * (deltaModel.totalMeters ?? 0) +
        perItemMeters * (deltaModel.perItemMeters ?? 0)
    );

    return {
      total: pieceTrimQuote.total + contourDelta,
      pieceTrimQuote,
      contourDelta
    };
  };

  const calculate = (input, data) => {
    const materialConfig = getMaterialConfig(data, input.materialKey);
    const status = getMaterialStatus(materialConfig);
    if (!materialConfig || !status.canQuote) {
      return {
        ok: false,
        code: "material-pending",
        message: status.note || "Ціна для цього матеріалу уточнюється."
      };
    }

    const allowedFinishes = Array.isArray(materialConfig.allowedFinishes) && materialConfig.allowedFinishes.length
      ? new Set(materialConfig.allowedFinishes)
      : null;
    const finishKey = allowedFinishes && !allowedFinishes.has(input.finishKey)
      ? "none"
      : input.finishKey;
    const resolvedCutKey = materialConfig?.cutAliases?.[input.cutKey] || input.cutKey;

    if (materialConfig.disallowBlankDigitalContour && input.printKey === "blank" && resolvedCutKey === "digitalContour") {
      return {
        ok: false,
        code: "combination-unavailable",
        message: "Не знайдено пропозиції з такими параметрами."
      };
    }

    const profile = getResolvedSheetProfile(data, materialConfig);
    const cutConfig = getCutConfig(data, resolvedCutKey);
    if (!profile) {
      return {
        ok: false,
        code: "profile-missing",
        message: "Для цього матеріалу ще не задано параметри листа."
      };
    }

    if (isBelowCutMinimum({ width: input.width, height: input.height, cutConfig })) {
      return {
        ok: false,
        code: "cut-size-too-small",
        message: `Мінімальний розмір для "${cutConfig.label}" — ${cutConfig.minWidth}×${cutConfig.minHeight} мм.`
      };
    }

    const shouldRestrictContourByLayout =
      Number.isFinite(cutConfig?.pricePerMeter) &&
      cutConfig.pricePerMeter > 0 &&
      input.materialKey === "paperSlits";

    if (shouldRestrictContourByLayout) {
      const contourMarginMm = cutConfig.defaultMarginMm ?? 0;
      const fitsContourLayout = canFitOnSheet({
        sheetWidth: profile.printWidth,
        sheetHeight: profile.printHeight,
        itemWidth: input.width + contourMarginMm * 2,
        itemHeight: input.height + contourMarginMm * 2,
        gapX: profile.gapX || 0,
        gapY: profile.gapY || 0
      });

      if (!fitsContourLayout) {
        return {
          ok: false,
          code: "contour-too-large",
          message: `Фігурна порізка для самоклеючого паперу з надсічками у розмірі ${input.width}×${input.height} мм не вміщується в робочу область листа зі стандартними полями ${contourMarginMm} мм.`
        };
      }
    }

    const itemWidth = input.width + (profile.cutMargin || 0) * 2;
    const itemHeight = input.height + (profile.cutMargin || 0) * 2;
    const itemsPerSheet = getItemsPerSheet({
      sheetWidth: profile.printWidth,
      sheetHeight: profile.printHeight,
      itemWidth,
      itemHeight,
      gapX: profile.gapX || 0,
      gapY: profile.gapY || 0
    });

    if (!itemsPerSheet) {
      return {
        ok: false,
        code: "too-large",
        message: "Такий розмір не вміщується в робочу область листа."
      };
    }

    const sheets = getSheetsNeeded({
      quantity: input.quantity,
      kindCount: input.kindCount,
      itemsPerSheet
    });
    const totalRequestedQuantity = sheets.totalRequestedQuantity || Math.max(0, Math.ceil(input.quantity || 0));
    const materialCharge = getMaterialCharge(sheets.totalSheets, materialConfig);
    if (materialCharge.missing) {
      return {
        ok: false,
        code: "material-pending",
        message: "Для цього матеріалу ціна ще уточнюється."
      };
    }

    const printCharge = getPrintCharge(
      sheets.totalSheets,
      getResolvedPrintConfig(data, materialConfig, input.printKey)
    );
    const cutCharge = getCutCharge({
      width: input.width,
      height: input.height,
      quantity: totalRequestedQuantity,
      sheets: sheets.totalSheets,
      itemsPerSheet,
      cutConfig,
      profile,
      contourLengthMm: input.contourLengthMm,
      materialKey: input.materialKey,
      printKey: input.printKey,
      materialConfig,
      cutKey: resolvedCutKey
      });
      const finishCharge = getFinishCharge(sheets.totalSheets, getFinishConfig(data, finishKey));
      const materialBaseAdjustment = getMaterialBaseAdjustment({
        input,
        width: input.width,
        height: input.height,
        itemsPerSheet,
        sheets: sheets.totalSheets,
        materialConfig
      });
      if (materialBaseAdjustment > 0) {
        materialCharge.amount = Math.max(0, materialCharge.amount - materialBaseAdjustment);
        if (sheets.totalSheets > 0) {
          materialCharge.baseMaterialPerSheet = materialCharge.amount / sheets.totalSheets;
        }
      }
      const formulaTotal = materialCharge.amount + printCharge.amount + cutCharge.amount + finishCharge.amount;
    let total = formulaTotal;
    let sameSizeReferenceSeriesTotal = null;
    let usedModeledContourTotal = false;
    const useReferenceForCut = allowsReferenceForCut(materialConfig, resolvedCutKey);
    const exactReferenceTotal = input.ignoreExactReference
      ? null
      : !useReferenceForCut
        ? null
      : getExactReferenceTotal({
        width: input.width,
        height: input.height,
        quantity: totalRequestedQuantity,
        materialKey: input.materialKey,
        printKey: input.printKey,
        finishKey,
        cutKey: resolvedCutKey
      });

    if (Number.isFinite(exactReferenceTotal)) {
      const delta = exactReferenceTotal - total;
      applyDeltaPreservingNonNegativeCharges({
        delta,
        input,
        materialCharge,
        printCharge,
        cutCharge,
        finishCharge,
        sheets,
        finishKey
      });
      total = exactReferenceTotal;
    } else if (!input.ignoreReferenceApproximation) {
      const modeledContour = getMaterialDigitalContourModeledTotal({
        input,
        data,
        materialConfig,
        finishKey,
        cutCharge
      });
      if (modeledContour) {
        usedModeledContourTotal = true;
        total = modeledContour.total;
        materialCharge.amount = modeledContour.pieceTrimQuote.materialCharge.amount;
        materialCharge.baseMaterialPerSheet = modeledContour.pieceTrimQuote.materialCharge.baseMaterialPerSheet;
        materialCharge.missing = modeledContour.pieceTrimQuote.materialCharge.missing;
        printCharge.amount = modeledContour.pieceTrimQuote.printCharge.amount;
        if ("ratePerSheet" in modeledContour.pieceTrimQuote.printCharge) {
          printCharge.ratePerSheet = modeledContour.pieceTrimQuote.printCharge.ratePerSheet;
        }
        if ("floorPerSheet" in modeledContour.pieceTrimQuote.printCharge) {
          printCharge.floorPerSheet = modeledContour.pieceTrimQuote.printCharge.floorPerSheet;
        }
        if ("tier" in modeledContour.pieceTrimQuote.printCharge) {
          printCharge.tier = modeledContour.pieceTrimQuote.printCharge.tier;
        }
        cutCharge.amount = modeledContour.contourDelta;
        cutCharge.modeledFromPieceTrim = true;
        cutCharge.modeledContourDelta = modeledContour.contourDelta;
        finishCharge.amount = modeledContour.pieceTrimQuote.finishCharge.amount;
      } else if (!input.ignoreReferenceApproximation && useReferenceForCut) {
        const shouldUseLinearSameSizeReference =
          (input.materialKey === "upmMatte" &&
            resolvedCutKey === "pieceTrim" &&
            itemsPerSheet <= 2) ||
          (materialConfig?.sameSizeReferenceQuantityMode === "ceiling" && itemsPerSheet <= 2);
        const shouldUseCeilingSameSizeReference =
          materialConfig?.sameSizeReferenceQuantityMode === "ceiling" &&
          !shouldUseLinearSameSizeReference;
        const shouldSkipSameSizeReferenceSeries =
          input.materialKey === "paperSlits" &&
          Number.isFinite(cutCharge?.smallItemRunSurcharge) &&
          cutCharge.smallItemRunSurcharge > 0;
        const canUseCrossSizeReferenceApproximation =
          allowsReferenceApproximationForCut(materialConfig, resolvedCutKey);
        sameSizeReferenceSeriesTotal =
          shouldSkipSameSizeReferenceSeries
            ? null
            : shouldUseCeilingSameSizeReference
              ? getReferenceSeriesCeilingTotal({
                  width: input.width,
                  height: input.height,
                  quantity: totalRequestedQuantity,
                  materialKey: input.materialKey,
                  printKey: input.printKey,
                  finishKey,
                  cutKey: resolvedCutKey
                })
            : shouldUseLinearSameSizeReference
              ? getReferenceSeriesLinearTotal({
                  width: input.width,
                  height: input.height,
                  quantity: totalRequestedQuantity,
                  materialKey: input.materialKey,
                  printKey: input.printKey,
                  finishKey,
                  cutKey: resolvedCutKey
                })
              : getReferenceSeriesTotal({
                  width: input.width,
                  height: input.height,
                  quantity: totalRequestedQuantity,
                  materialKey: input.materialKey,
                  printKey: input.printKey,
                  finishKey,
                  cutKey: resolvedCutKey
                });
        const adjustedReferenceLikeTotal = Number.isFinite(sameSizeReferenceSeriesTotal)
          ? sameSizeReferenceSeriesTotal
          : canUseCrossSizeReferenceApproximation
            ? getReferenceAdjustedTotal({
                input: {
                  ...input,
                  finishKey,
                  cutKey: resolvedCutKey
                },
                data,
                formulaTotal,
                itemsPerSheet,
                sheets: sheets.totalSheets,
                cutCharge
              })
            : null;
        if (Number.isFinite(adjustedReferenceLikeTotal)) {
          const delta = adjustedReferenceLikeTotal - total;
          applyDeltaPreservingNonNegativeCharges({
            delta,
            input,
            materialCharge,
            printCharge,
            cutCharge,
            finishCharge,
            sheets,
            finishKey
          });
          total = adjustedReferenceLikeTotal;
        }
      }
    }

    const shouldSmoothLargeRunSheetSteps =
      !input.ignoreSheetBandSmoothing &&
      !Number.isFinite(exactReferenceTotal) &&
      !Number.isFinite(sameSizeReferenceSeriesTotal) &&
      !usedModeledContourTotal &&
      itemsPerSheet > 0 &&
      sheets.totalSheets > 2;

    if (shouldSmoothLargeRunSheetSteps) {
      const effectiveSheets = totalRequestedQuantity / Math.max(itemsPerSheet, 1);
      const lowerFullSheets = Math.floor(effectiveSheets);
      const upperFullSheets = Math.ceil(effectiveSheets);

      if (upperFullSheets > lowerFullSheets && lowerFullSheets >= 2) {
        const lowerQuantity = lowerFullSheets * itemsPerSheet;
        const upperQuantity = upperFullSheets * itemsPerSheet;

        if (totalRequestedQuantity > lowerQuantity && totalRequestedQuantity < upperQuantity) {
          const lowerQuote = calculate(
            {
              ...input,
              quantity: lowerQuantity,
              ignoreSheetBandSmoothing: true
            },
            data
          );
          const upperQuote = calculate(
            {
              ...input,
              quantity: upperQuantity,
              ignoreSheetBandSmoothing: true
            },
            data
          );

          if (lowerQuote?.ok && upperQuote?.ok) {
            const factor = (totalRequestedQuantity - lowerQuantity) / Math.max(upperQuantity - lowerQuantity, 1);
            const mix = (start, end) => start + (end - start) * factor;

            materialCharge.amount = mix(lowerQuote.materialCharge.amount, upperQuote.materialCharge.amount);
            printCharge.amount = mix(lowerQuote.printCharge.amount, upperQuote.printCharge.amount);
            cutCharge.amount = mix(lowerQuote.cutCharge.amount, upperQuote.cutCharge.amount);
            finishCharge.amount = mix(lowerQuote.finishCharge.amount, upperQuote.finishCharge.amount);
            if (sheets.totalSheets > 0) {
              materialCharge.baseMaterialPerSheet = materialCharge.amount / sheets.totalSheets;
              printCharge.ratePerSheet = printCharge.amount / sheets.totalSheets;
              finishCharge.pricePerSheet = finishCharge.amount / sheets.totalSheets;
            }
            cutCharge.sheetBandSmoothed = true;
            cutCharge.sheetBandLowerQuantity = lowerQuantity;
            cutCharge.sheetBandUpperQuantity = upperQuantity;
            total = materialCharge.amount + printCharge.amount + cutCharge.amount + finishCharge.amount;
          }
        }
      }
    }

    return {
      ok: true,
      total,
      itemWidth,
      itemHeight,
      itemsPerSheet,
      sheets,
      profile,
      materialCharge,
      printCharge,
      cutCharge,
      finishCharge,
      materialStatus: status,
      exactReferenceTotal
    };
  };

  window.StickerSheetCalculator = {
    getItemsPerSheet,
    getSheetsNeeded,
    getMaterialCharge,
    getPrintCharge,
    getCutCharge,
    getFinishCharge,
    calculate
  };
})();
