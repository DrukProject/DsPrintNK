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
    upmMatte: {
      sheetCost: 28.18,
      profile: "film",
      printOverrides: {
        color1: {
          minCharge: 51.22,
          curve: [
            { sheets: 1, total: 51.22 },
            { sheets: 3, total: 152.86 },
            { sheets: 5, total: 236.5 },
            { sheets: 13, total: 535.06 },
            { sheets: 25, total: 979.9 },
            { sheets: 50, total: 1899.4 },
            { sheets: 100, total: 3699.4 },
            { sheets: 175, total: 6327.9 },
            { sheets: 250, total: 8846.4 },
            { sheets: 500, total: 17176.4 }
          ]
        }
      }
    },
    ritramaClear: { sheetCost: 28.9, profile: "film" },
    ritramaWhite: {
      sheetCost: 28.45,
      profile: "film",
      printOverrides: {
        color1: {
          minCharge: 24.95,
          curve: [
            { sheets: 1, total: 24.95 },
            { sheets: 2, total: 50.5 },
            { sheets: 3, total: 76.05 },
            { sheets: 5, total: 108.15 },
            { sheets: 13, total: 201.55 },
            { sheets: 25, total: 339.15 },
            { sheets: 50, total: 616.9 },
            { sheets: 125, total: 1383.15 },
            { sheets: 250, total: 2434.9 },
            { sheets: 375, total: 3271.65 },
            { sheets: 500, total: 4353.4 }
          ]
        }
      }
    },
    waterproof: {
      sheetCost: 29.3,
      profile: "film",
      printOverrides: {
        color1: {
          minCharge: 27.1,
          curve: [
            { sheets: 1, total: 27.1 },
            { sheets: 2, total: 53.8 },
            { sheets: 3, total: 80.5 },
            { sheets: 5, total: 115.9 },
            { sheets: 13, total: 220.5 },
            { sheets: 25, total: 376.9 },
            { sheets: 50, total: 691.4 },
            { sheets: 125, total: 1569.9 },
            { sheets: 250, total: 2809.4 },
            { sheets: 375, total: 3832.9 },
            { sheets: 500, total: 5101.4 }
          ]
        }
      }
    },
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
        { sheets: 125, total: 1132.65 },
        { sheets: 184, total: 1553.64 },
        { sheets: 218, total: 1760.38 },
        { sheets: 250, total: 1934.9 },
        { sheets: 425, total: 2854.65 },
        { sheets: 500, total: 3353.4 }
      ]
    }
  },
  cutModes: {
    trim: { setupFee: 0, maxPerSheet: 0.266, minPerSheet: 0.266, minSheets: 1, maxSheets: 500, minCharge: 26.6 },
    pieceTrim: {
      minCharge: 26.6,
      formatMinimums: [
        { maxArea: 7000, total: 113 },
        { maxArea: 10000, total: 100 },
        { maxArea: 15000, total: 87 }
      ],
      curve: [
        { sheets: 1, total: 26.6 },
        { sheets: 500, total: 26.6 }
      ]
    },
    digitalContour: { setupFee: 80, maxPerSheet: 45, minPerSheet: 10, minSheets: 1, maxSheets: 500, minCharge: 120 }
  },
  finishModes: {
    none: { setupFee: 0, maxPerSheet: 0, minPerSheet: 0, minSheets: 1, maxSheets: 500, minCharge: 0 },
    glossLam: {
      minCharge: 35,
      curve: [
        { sheets: 1, total: 35 },
        { sheets: 5, total: 42 },
        { sheets: 10, total: 52 },
        { sheets: 25, total: 82 },
        { sheets: 50, total: 128 },
        { sheets: 100, total: 214 },
        { sheets: 200, total: 398 },
        { sheets: 500, total: 945 },
        { sheets: 1000, total: 1860 }
      ]
    },
    matteLam: {
      minCharge: 40,
      curve: [
        { sheets: 1, total: 40 },
        { sheets: 5, total: 48 },
        { sheets: 10, total: 59 },
        { sheets: 25, total: 92 },
        { sheets: 50, total: 142 },
        { sheets: 100, total: 236 },
        { sheets: 200, total: 438 },
        { sheets: 500, total: 1035 },
        { sheets: 1000, total: 2035 }
      ]
    },
    softTouch: {
      minCharge: 48,
      curve: [
        { sheets: 1, total: 48 },
        { sheets: 5, total: 58 },
        { sheets: 10, total: 72 },
        { sheets: 25, total: 112 },
        { sheets: 50, total: 172 },
        { sheets: 100, total: 286 },
        { sheets: 200, total: 528 },
        { sheets: 500, total: 1245 },
        { sheets: 1000, total: 2445 }
      ]
    }
  }
};
