const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "assets", "dpi-price-reference.js");
const FORMULA_DIR = path.join(PROJECT_ROOT, "dpi_formula");

const DPI_ALL_PATH = path.join(FORMULA_DIR, "dpi_all.csv");
const DPI_ALL_VALID_SIZES = new Set(["297x420"]);

const S = {
  paperSlits: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 \u043f\u0430\u043f\u0456\u0440 \u0437 \u043d\u0430\u0434\u0441\u0456\u0447\u043a\u0430\u043c\u0438",
  upmMatte: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0430 \u043f\u043b\u0456\u0432\u043a\u0430 upm \u0431\u0456\u043b\u0430 \u0431\u0435\u0437 \u043f\u0440\u043e\u0441\u0456\u0447\u043a\u0438 \u043c\u0430\u0442\u043e\u0432\u0430",
  ritramaWhite: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0430 \u043f\u043b\u0456\u0432\u043a\u0430 ritrama \u0431\u0456\u043b\u0430 \u0433\u043b\u044f\u043d\u0435\u0446\u044c",
  waterproof: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 waterproof white",
  ritramaClear: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0430 \u043f\u043b\u0456\u0432\u043a\u0430 ritrama \u043f\u0440\u043e\u0437\u043e\u0440\u0430 \u0433\u043b\u044f\u043d\u0435\u0446\u044c",
  woodstock: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 woodstock betulla",
  kraft: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 upm \u0431\u0443\u0440\u0438\u0439 \u043a\u0440\u0430\u0444\u0442",
  tintoretto: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 tintoretto angora",
  sirio: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 sirio pearl ice white",
  silver: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 lam foil matt silver",
  embossed: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 embossed coated skin",
  snow: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 constellation snow vergata",
  jade: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 constellation jade raster",
  antiquaWhite: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 antiqua white",
  antiquaIvory: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 antiqua ivory",
  acquerello: "\u0441\u0430\u043c\u043e\u043a\u043b\u0435\u044e\u0447\u0438\u0439 acquerello avorio",
  noPrint: "\u0431\u0435\u0437 \u0434\u0440\u0443\u043a\u0443",
  noFinish: "\u0431\u0435\u0437 \u043e\u0437\u0434\u043e\u0431\u043b\u0435\u043d\u043d\u044f",
  gloss: "\u043b\u0430\u043c\u0456\u043d\u0430\u0446\u0456\u044f \u0433\u043b\u044f\u043d\u0446\u0435\u0432\u0430",
  matte: "\u043b\u0430\u043c\u0456\u043d\u0430\u0446\u0456\u044f \u043c\u0430\u0442\u043e\u0432\u0430",
  contour: "\u0444\u0456\u0433\u0443\u0440\u043d\u0430 \u043d\u0430\u0434\u0441\u0456\u0447\u043a\u0430",
  plotter1: "\u043f\u043b\u043e\u0442\u0442\u0435\u0440",
  plotter2: "\u043f\u043b\u043e\u0442\u0435\u0440",
  noCut: "\u0431\u0435\u0437 \u043f\u043e\u0440\u0456\u0437\u043a\u0438",
  pieceCut: "\u043f\u043e\u0440\u0456\u0437\u043a\u0430"
};

const MATERIAL_MAP = {
  [S.paperSlits]: "paperSlits",
  [S.upmMatte]: "upmMatte",
  [S.ritramaWhite]: "ritramaWhite",
  [S.waterproof]: "waterproof",
  [S.ritramaClear]: "ritramaClear",
  [S.woodstock]: "woodstock",
  [S.kraft]: "kraft",
  [S.tintoretto]: "tintoretto",
  [S.sirio]: "sirio",
  [S.silver]: "silver",
  [S.embossed]: "embossed",
  [S.snow]: "snow",
  [S.jade]: "jade",
  [S.antiquaWhite]: "antiquaWhite",
  [S.antiquaIvory]: "antiquaIvory",
  [S.acquerello]: "acquerello"
};

const PRINT_MAP = {
  "4+0": "color1",
  "1+0": "bw1",
  [S.noPrint]: "blank"
};

const FINISH_MAP = {
  [S.noFinish]: "none",
  [S.gloss]: "glossLam",
  [S.matte]: "matteLam",
  "soft touch": "softTouch",
  [S.contour]: "none",
  [S.plotter1]: "none",
  [S.plotter2]: "none"
};

const repairMojibake = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  const suspiciousMarkers = ["Ð", "Ñ", "â‚", "Â", "Ã"];
  const looksBroken = suspiciousMarkers.some((marker) => trimmed.includes(marker));
  if (!looksBroken) return trimmed;

  try {
    return Buffer.from(trimmed, "latin1").toString("utf8").trim();
  } catch {
    return trimmed;
  }
};

const normalizeValue = (value) => {
  if (typeof value === "string") return repairMojibake(value);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};
const normalizeCase = (value) => normalizeValue(value).toLowerCase();

const walkFiles = (dirPath) => {
  if (!fs.existsSync(dirPath)) return [];

  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
      continue;
    }
    results.push(fullPath);
  }
  return results;
};

const parseCsvLine = (line) => {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === "\"") {
      if (inQuotes && line[index + 1] === "\"") {
        current += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
};

const loadCsvRows = (filePath) => {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]).map(normalizeValue);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = normalizeValue(values[index] ?? "");
    });
    return row;
  });
};

const loadJsonlRows = (filePath) => {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
};

const loadRows = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".jsonl" ? loadJsonlRows(filePath) : loadCsvRows(filePath);
};

const normalizeMaterialKey = (value) => MATERIAL_MAP[normalizeCase(value)] || null;
const normalizePrintKey = (value) => PRINT_MAP[normalizeCase(value)] || null;
const normalizeFinishKey = (value) => FINISH_MAP[normalizeCase(value)] || null;

const normalizeCutKey = (cutValue, finishValue) => {
  const normalizedCut = normalizeCase(cutValue);
  const normalizedFinish = normalizeCase(finishValue);

  if (normalizedCut === S.plotter1 || normalizedCut === S.plotter2) return "digitalContour";
  if (normalizedCut === S.contour || normalizedFinish === S.contour) return "digitalContour";
  if (normalizedCut === S.noCut) return "trim";
  if (normalizedCut === S.pieceCut) return "pieceTrim";

  return null;
};

const buildReferenceMap = (rows, options = {}) => {
  const references = {};
  const validSizes = options.validSizes || null;

  for (const row of rows) {
    const size = normalizeValue(row.size);
    if (validSizes && size && !validSizes.has(size)) continue;

    const finishSource = row.finish || row.coating || "";
    const materialKey = normalizeMaterialKey(row.material);
    const printKey = normalizePrintKey(row.print);
    const finishKey = normalizeFinishKey(finishSource);
    const cutKey = normalizeCutKey(row.cut, finishSource);
    const quantity = Number(normalizeValue(row.quantity));
    const price = Number(normalizeValue(row.price_num));

    if (!materialKey || !printKey || !finishKey || !cutKey || !size) continue;
    if (!Number.isFinite(quantity) || !Number.isFinite(price) || price <= 0) continue;

    const key = [materialKey, size, printKey, finishKey, cutKey, Math.ceil(quantity)].join("|");
    references[key] = price;
  }

  return references;
};

const resolveInputFiles = (inputPaths) => {
  if (inputPaths.length) return inputPaths.filter((filePath) => fs.existsSync(filePath));

  const getPriority = (filePath) => {
    const normalized = filePath.replace(/\\/g, "/").toLowerCase();
    let score = 0;

    if (normalized.endsWith("/dpi_all.csv")) score -= 100;
    if (normalized.includes("/some parts/")) score -= 50;
    if (normalized.includes("/dpi_big_qty")) score += 20;
    if (normalized.includes("/clean/")) score += 40;
    if (/\b\d+x\d+\b/.test(normalized)) score += 60;
    if (normalized.endsWith(".csv")) score += 10;

    return score;
  };

  const files = walkFiles(FORMULA_DIR)
    .filter((filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      return ext === ".csv" || ext === ".jsonl";
    })
    .sort((left, right) => {
      const priorityDiff = getPriority(left) - getPriority(right);
      if (priorityDiff !== 0) return priorityDiff;
      return left.localeCompare(right);
    });

  if (!files.length) throw new Error(`No input files found in ${FORMULA_DIR}.`);
  return files;
};

const main = () => {
  const files = resolveInputFiles(process.argv.slice(2));
  const references = {};
  let totalRows = 0;

  for (const filePath of files) {
    const rows = loadRows(filePath);
    totalRows += rows.length;
    Object.assign(
      references,
      buildReferenceMap(rows, {
        validSizes: path.resolve(filePath) === path.resolve(DPI_ALL_PATH) ? DPI_ALL_VALID_SIZES : null
      })
    );
  }

  const payload = `window.DPI_PRICE_REFERENCE = ${JSON.stringify(references, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_PATH, payload, "utf8");

  console.log(`Loaded ${totalRows} rows from ${files.length} input file(s).`);
  console.log(`Saved ${Object.keys(references).length} references to ${OUTPUT_PATH}`);
};

main();
