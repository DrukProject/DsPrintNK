window.PRINT_CALC_DATA = {
  sheetProfiles: {
    paper: {
      label: "Папір",
      stockWidth: 330,
      stockHeight: 450,
      printWidth: 310,
      printHeight: 440,
      cutMargin: 2
    },
    film: {
      label: "Плівка",
      stockWidth: 330,
      stockHeight: 488,
      printWidth: 320,
      printHeight: 480,
      cutMargin: 2
    }
  },
  materials: {
    upmMatte: { sheetCost: 28.18, profile: "film" },
    ritramaClear: { sheetCost: 28.9, profile: "film" },
    ritramaWhite: { sheetCost: 28.45, profile: "film" },
    waterproof: { sheetCost: 29.3, profile: "film" },
    paperSlits: { sheetCost: 10.39, profile: "paper" },
    woodstock: { sheetCost: 12.4, profile: "paper" },
    kraft: { sheetCost: 11.3, profile: "paper" },
    tintoretto: { sheetCost: 12.9, profile: "paper" },
    sirio: { sheetCost: 13.8, profile: "paper" },
    silver: { sheetCost: 13.4, profile: "paper" },
    embossed: { sheetCost: 12.7, profile: "paper" },
    snow: { sheetCost: 13.2, profile: "paper" },
    jade: { sheetCost: 13.9, profile: "paper" },
    antiquaWhite: { sheetCost: 12.8, profile: "paper" },
    antiquaIvory: { sheetCost: 12.8, profile: "paper" },
    acquerello: { sheetCost: 13.1, profile: "paper" }
  },
  printModes: {
    blank: { setupFee: 0, maxPerSheet: 0, minPerSheet: 0, minSheets: 1, maxSheets: 500, minCharge: 0 },
    bw1: { setupFee: 5, maxPerSheet: 50, minPerSheet: 15, minSheets: 1, maxSheets: 500, minCharge: 50 },
    color1: {
      minCharge: 60,
      curve: [
        { sheets: 1, total: 23.01 },
        { sheets: 2, total: 46.62 },
        { sheets: 3, total: 70.23 },
        { sheets: 5, total: 98.45 },
        { sheets: 13, total: 175.33 },
        { sheets: 25, total: 288.65 },
        { sheets: 50, total: 516.9 },
        { sheets: 100, total: 935.4 },
        { sheets: 250, total: 1895 },
        { sheets: 500, total: 3247 }
      ]
    }
  },
  cutModes: {
    trim: { setupFee: 0, maxPerSheet: 0.266, minPerSheet: 0.266, minSheets: 1, maxSheets: 500, minCharge: 26.6 },
    pieceTrim: { setupFee: 20, maxPerSheet: 2.5, minPerSheet: 1.2, minSheets: 1, maxSheets: 500, minCharge: 35 },
    digitalContour: { setupFee: 80, maxPerSheet: 45, minPerSheet: 10, minSheets: 1, maxSheets: 500, minCharge: 120 }
  },
  finishModes: {
    none: { setupFee: 0, maxPerSheet: 0, minPerSheet: 0, minSheets: 1, maxSheets: 500, minCharge: 0 },
    perforation: {
      minCharge: 15,
      curve: [
        { sheets: 1, total: 15 },
        { sheets: 5, total: 19 },
        { sheets: 10, total: 24 },
        { sheets: 25, total: 40 },
        { sheets: 50, total: 67 },
        { sheets: 100, total: 119 },
        { sheets: 200, total: 225 },
        { sheets: 500, total: 544 },
        { sheets: 1000, total: 1075 }
      ]
    },
    plotterContour: { setupFee: 90, maxPerSheet: 40, minPerSheet: 10, minSheets: 1, maxSheets: 500, minCharge: 130 }
  }
};
