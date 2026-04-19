window.PRINT_CALC_DATA = {
  sheetProfiles: {
    paper: {
      label: "Папір",
      stockWidth: 330,
      stockHeight: 450,
      printWidth: 310,
      printHeight: 420,
      cutMargin: 0,
      gapX: 0,
      gapY: 0
    },
    film: {
      label: "Плівка",
      stockWidth: 330,
      stockHeight: 488,
      printWidth: 310,
      printHeight: 420,
      cutMargin: 0,
      gapX: 0,
      gapY: 0
    }
  },
  printModes: {
    blank: {
      label: "Без друку",
      mode: "none",
      floorPerSheet: 0,
      tiers: []
    },
    bw1: {
      label: "Чорно-білий односторонній",
      floorPerSheet: 0.693,
      curve: [
        { sheets: 1, total: 2 },
        { sheets: 3, total: 6 },
        { sheets: 5, total: 11 },
        { sheets: 10, total: 22 },
        { sheets: 15, total: 33 },
        { sheets: 20, total: 44 },
        { sheets: 25, total: 54 },
        { sheets: 50, total: 78 },
        { sheets: 100, total: 122 },
        { sheets: 150, total: 162 },
        { sheets: 200, total: 196 },
        { sheets: 225, total: 211 },
        { sheets: 250, total: 225 },
        { sheets: 275, total: 238 },
        { sheets: 300, total: 249 },
        { sheets: 325, total: 258 },
        { sheets: 375, total: 284 },
        { sheets: 400, total: 301 },
        { sheets: 425, total: 318 },
        { sheets: 450, total: 335 },
        { sheets: 475, total: 352 },
        { sheets: 500, total: 369 },
        { sheets: 600, total: 437 },
        { sheets: 700, total: 506 },
        { sheets: 800, total: 574 },
        { sheets: 900, total: 643 },
        { sheets: 1000, total: 710 },
        { sheets: 1100, total: 778 },
        { sheets: 1200, total: 847 },
        { sheets: 1300, total: 915 },
        { sheets: 1400, total: 983 },
        { sheets: 1500, total: 1051 },
        { sheets: 1600, total: 1119 },
        { sheets: 1700, total: 1188 },
        { sheets: 1800, total: 1256 },
        { sheets: 1900, total: 1324 },
        { sheets: 2000, total: 1392 },
        { sheets: 2100, total: 1460 },
        { sheets: 2200, total: 1529 },
        { sheets: 2300, total: 1596 },
        { sheets: 2400, total: 1665 },
        { sheets: 2500, total: 1733 }
      ]
    },
    color1: {
      label: "Повноколірний односторонній",
      floorPerSheet: 6.415,
      curve: [
        { sheets: 1, total: 23 },
        { sheets: 3, total: 70 },
        { sheets: 5, total: 99 },
        { sheets: 10, total: 147 },
        { sheets: 15, total: 195 },
        { sheets: 20, total: 242 },
        { sheets: 25, total: 289 },
        { sheets: 50, total: 517 },
        { sheets: 100, total: 935 },
        { sheets: 150, total: 1304 },
        { sheets: 200, total: 1624 },
        { sheets: 225, total: 1765 },
        { sheets: 250, total: 1894 },
        { sheets: 275, total: 2011 },
        { sheets: 300, total: 2116 },
        { sheets: 325, total: 2208 },
        { sheets: 375, total: 2447 },
        { sheets: 400, total: 2608 },
        { sheets: 425, total: 2768 },
        { sheets: 450, total: 2927 },
        { sheets: 475, total: 3087 },
        { sheets: 500, total: 3247 },
        { sheets: 600, total: 3886 },
        { sheets: 700, total: 4526 },
        { sheets: 800, total: 5166 },
        { sheets: 900, total: 5806 },
        { sheets: 1000, total: 6445 },
        { sheets: 1100, total: 7084 },
        { sheets: 1200, total: 7724 },
        { sheets: 1300, total: 8364 },
        { sheets: 1400, total: 9003 },
        { sheets: 1500, total: 9642 },
        { sheets: 1600, total: 10282 },
        { sheets: 1700, total: 10922 },
        { sheets: 1800, total: 11562 },
        { sheets: 1900, total: 12201 },
        { sheets: 2000, total: 12840 },
        { sheets: 2100, total: 13480 },
        { sheets: 2200, total: 14120 },
        { sheets: 2300, total: 14759 },
        { sheets: 2400, total: 15399 },
        { sheets: 2500, total: 16038 }
      ]
    }
  },
  cutModes: {
    trim: {
      label: "Без порізки",
      fixedCharge: 0,
      pricePerSheet: 0,
      minCharge: 0
    },
    pieceTrim: {
      label: "Порізка поштучно",
      minWidth: 31,
      minHeight: 31,
      fixedCharge: 0,
      pricePerSheet: 0,
      minCharge: 26,
      baseCurveScaleBy: "sheets",
      baseCurve: [
        { quantity: 1, total: 26 },
        { quantity: 3, total: 26 },
        { quantity: 5, total: 26 },
        { quantity: 10, total: 26 },
        { quantity: 15, total: 26 },
        { quantity: 20, total: 26 },
        { quantity: 25, total: 26 },
        { quantity: 50, total: 26 },
        { quantity: 100, total: 26 },
        { quantity: 150, total: 39 },
        { quantity: 200, total: 53 },
        { quantity: 225, total: 59 },
        { quantity: 250, total: 66 },
        { quantity: 275, total: 72 },
        { quantity: 300, total: 79 },
        { quantity: 325, total: 85 },
        { quantity: 375, total: 99 },
        { quantity: 400, total: 105 },
        { quantity: 425, total: 112 },
        { quantity: 450, total: 118 },
        { quantity: 475, total: 125 },
        { quantity: 500, total: 131 },
        { quantity: 600, total: 158 },
        { quantity: 700, total: 184 },
        { quantity: 800, total: 210 },
        { quantity: 900, total: 237 },
        { quantity: 1000, total: 263 },
        { quantity: 1100, total: 289 },
        { quantity: 1200, total: 315 },
        { quantity: 1300, total: 342 },
        { quantity: 1400, total: 368 },
        { quantity: 1500, total: 394 },
        { quantity: 1600, total: 421 },
        { quantity: 1700, total: 447 },
        { quantity: 1800, total: 473 },
        { quantity: 1900, total: 499 },
        { quantity: 2000, total: 526 },
        { quantity: 2100, total: 552 },
        { quantity: 2200, total: 578 },
        { quantity: 2300, total: 605 },
        { quantity: 2400, total: 631 },
        { quantity: 2500, total: 657 }
      ],
      densityPricing: {
        metric: "inverseAreaLog",
        freeItemsPerSheet: 9999,
        base: 0,
        exponent: 1,
        runPerSheet: 0,
        runExponent: 1,
        sheetGrowth: "linear"
      },
      densityBuckets: [
        { minLongSide: 260, maxLongSide: 340, minItemsPerSheet: 7, maxItemsPerSheet: 7, total: 79 },
        { minLongSide: 260, maxLongSide: 340, minItemsPerSheet: 8, maxItemsPerSheet: 15, total: 53 },
        { maxItemsPerSheet: 4, total: 26 },
        { minItemsPerSheet: 5, maxItemsPerSheet: 6, total: 39 },
        { minItemsPerSheet: 7, maxItemsPerSheet: 8, total: 53 },
        { minItemsPerSheet: 9, maxItemsPerSheet: 15, total: 66 },
        { minItemsPerSheet: 16, total: 79 }
      ],
        smallItemRunPricing: {
          materialKeys: ["paperSlits", "upmMatte"],
          fullRateMaxArea: 1200,
          taperMaxArea: 2500,
          thresholdItemsPerUsedSheet: 23,
          ratePerExtraItem: 14.3,
          materialOverrides: {
            upmMatte: {
              fullRateMaxArea: 2500,
              taperMaxArea: 4000,
              thresholdItemsPerUsedSheet: 20,
              ratePerExtraItem: 33.7
            }
          }
        },
      mediumRunSheetPricing: {
        materialKeys: ["paperSlits"],
        maxSheets: 6,
        thresholdItemsPerSheet: 34,
        ratePerMissingItemPerSheet: 0
      },
      elongatedShapePricing: {
        materialKeys: ["paperSlits"],
        minAspectRatio: 1.7,
        maxLongSide: 140,
        exponent: 1.5,
        sheetExponent: 1.2,
        multiplier: 0.19,
        printModeFactors: {
          color1: 1,
          bw1: 0.63,
          blank: 0.55
        }
      },
      longNarrowRunPricing: {
        materialKeys: ["paperSlits"],
        minLongSide: 180,
        shortSideLimit: 50,
        shortSideBypassThreshold: 40,
        longSideSoftCap: 260,
        upperLongRangeLimit: 340,
        upperLongRangeShortSideBypass: 44,
        sheetDivisor: 12,
        maxSheetFactor: 15,
        baseShortSide: 60,
        printModeFactors: {
          blank: 1,
          bw1: 1.2,
          color1: 2.1
        }
      },
      veryLongFormatPricing: {
        materialKeys: ["paperSlits"],
        minLongSide: 340,
        minShortSide: 45,
        shortSideLimit: 70,
        baseShortSide: 44,
        basePerSheet: 1,
        ratePerMmPerSheet: 0.21,
        longSideReference: 300,
        longSideDecayExponent: 1.15,
        printModeFactors: {
          blank: 0.5,
          bw1: 0.65,
          color1: 1
        }
      },
      longFormat300NarrowPricing: {
        materialKeys: ["paperSlits"],
        minLongSide: 260,
        maxLongSide: 340,
        minShortSide: 44,
        shortSideLimit: 44,
        ratePerSheet: 0.5
      },
      minimumByArea: [
        { maxArea: 3000, total: 79 },
        { maxArea: 10000, total: 68 }
      ]
    },
    digitalContour: {
      label: "Фігурна порізка (по контуру)",
      minWidth: 7,
      minHeight: 7,
      fixedCharge: 5.9,
      pricePerMeter: 9.71,
      pricePerMeterFormula: {
        scaleBy: "quantity",
        floorPerMeter: 9.71,
        maxPerMeter: 10.87,
        curveFactor: 11014,
        exponent: 1.99
      },
      defaultMarginMm: 2,
      contourLengthMode: "averageWithBleed",
      contourLengthMultiplier: 1,
      minCharge: 17
    }
  },
  finishModes: {
    none: {
      label: "Без покриття",
      mode: "none",
      fixedCharge: 0,
      pricePerSheet: 0,
      minCharge: 0
    },
    glossLam: {
      label: "Одностороння глянцева ламінація",
      fixedCharge: 0,
      pricePerSheet: 0,
      curve: [
        { sheets: 1, total: 22 },
        { sheets: 3, total: 37 },
        { sheets: 5, total: 52 },
        { sheets: 10, total: 92 },
        { sheets: 15, total: 131 },
        { sheets: 20, total: 171 },
        { sheets: 25, total: 210 },
        { sheets: 50, total: 406 },
        { sheets: 100, total: 799 },
        { sheets: 150, total: 1192 },
        { sheets: 200, total: 1584 },
        { sheets: 225, total: 1781 },
        { sheets: 250, total: 1977 },
        { sheets: 275, total: 2174 },
        { sheets: 300, total: 2370 },
        { sheets: 325, total: 2567 },
        { sheets: 375, total: 2960 },
        { sheets: 400, total: 3156 },
        { sheets: 425, total: 3352 },
        { sheets: 450, total: 3549 },
        { sheets: 475, total: 3745 },
        { sheets: 500, total: 3941 },
        { sheets: 600, total: 4728 },
        { sheets: 700, total: 5513 },
        { sheets: 800, total: 6299 },
        { sheets: 900, total: 7084 },
        { sheets: 1000, total: 7870 },
        { sheets: 1100, total: 8656 },
        { sheets: 1200, total: 9442 },
        { sheets: 1300, total: 10227 },
        { sheets: 1400, total: 11012 },
        { sheets: 1500, total: 11799 },
        { sheets: 1600, total: 12584 },
        { sheets: 1700, total: 13370 },
        { sheets: 1800, total: 14155 },
        { sheets: 1900, total: 14941 },
        { sheets: 2000, total: 15727 },
        { sheets: 2100, total: 16513 },
        { sheets: 2200, total: 17298 },
        { sheets: 2300, total: 18083 },
        { sheets: 2400, total: 18869 },
        { sheets: 2500, total: 19655 }
      ],
      minCharge: 0
    },
    matteLam: {
      label: "Одностороння матова ламінація",
      fixedCharge: 0,
      pricePerSheet: 0,
      curve: [
        { sheets: 1, total: 22 },
        { sheets: 3, total: 38 },
        { sheets: 5, total: 55 },
        { sheets: 10, total: 97 },
        { sheets: 15, total: 139 },
        { sheets: 20, total: 181 },
        { sheets: 25, total: 222 },
        { sheets: 50, total: 430 },
        { sheets: 100, total: 847 },
        { sheets: 150, total: 1264 },
        { sheets: 200, total: 1681 },
        { sheets: 225, total: 1889 },
        { sheets: 250, total: 2098 },
        { sheets: 275, total: 2307 },
        { sheets: 300, total: 2515 },
        { sheets: 325, total: 2723 },
        { sheets: 375, total: 3141 },
        { sheets: 400, total: 3349 },
        { sheets: 425, total: 3557 },
        { sheets: 450, total: 3766 },
        { sheets: 475, total: 3974 },
        { sheets: 500, total: 4182 },
        { sheets: 600, total: 5017 },
        { sheets: 700, total: 5851 },
        { sheets: 800, total: 6684 },
        { sheets: 900, total: 7518 },
        { sheets: 1000, total: 8352 },
        { sheets: 1100, total: 9186 },
        { sheets: 1200, total: 10020 },
        { sheets: 1300, total: 10854 },
        { sheets: 1400, total: 11687 },
        { sheets: 1500, total: 12522 },
        { sheets: 1600, total: 13356 },
        { sheets: 1700, total: 14189 },
        { sheets: 1800, total: 15023 },
        { sheets: 1900, total: 15857 },
        { sheets: 2000, total: 16691 },
        { sheets: 2100, total: 17525 },
        { sheets: 2200, total: 18359 },
        { sheets: 2300, total: 19192 },
        { sheets: 2400, total: 20026 },
        { sheets: 2500, total: 20861 }
      ],
      minCharge: 0
    },
    softTouch: {
      label: "Одностороння soft touch",
      fixedCharge: 0,
      pricePerSheet: 0,
      curve: [
        { sheets: 1, total: 28 },
        { sheets: 3, total: 56 },
        { sheets: 5, total: 84 },
        { sheets: 10, total: 156 },
        { sheets: 15, total: 227 },
        { sheets: 20, total: 299 },
        { sheets: 25, total: 370 },
        { sheets: 50, total: 725 },
        { sheets: 100, total: 1436 },
        { sheets: 150, total: 2148 },
        { sheets: 200, total: 2859 },
        { sheets: 225, total: 3215 },
        { sheets: 250, total: 3571 },
        { sheets: 275, total: 3927 },
        { sheets: 300, total: 4282 },
        { sheets: 325, total: 4638 },
        { sheets: 375, total: 5350 },
        { sheets: 400, total: 5706 },
        { sheets: 425, total: 6061 },
        { sheets: 450, total: 6418 },
        { sheets: 475, total: 6773 },
        { sheets: 500, total: 7129 },
        { sheets: 600, total: 8552 },
        { sheets: 700, total: 9975 },
        { sheets: 800, total: 11398 },
        { sheets: 900, total: 12821 },
        { sheets: 1000, total: 14244 },
        { sheets: 1100, total: 15668 },
        { sheets: 1200, total: 17091 },
        { sheets: 1300, total: 18513 },
        { sheets: 1400, total: 19936 },
        { sheets: 1500, total: 21360 },
        { sheets: 1600, total: 22783 },
        { sheets: 1700, total: 24206 },
        { sheets: 1800, total: 25629 },
        { sheets: 1900, total: 27052 },
        { sheets: 2000, total: 28475 },
        { sheets: 2100, total: 29898 },
        { sheets: 2200, total: 31321 },
        { sheets: 2300, total: 32744 },
        { sheets: 2400, total: 34167 },
        { sheets: 2500, total: 35591 }
      ],
      minCharge: 0
    }
  },
  materials: {
    paperSlits: {
      sheetCost: 10.393,
      profile: "paper",
      curve: [
        { sheets: 1, total: 11 },
        { sheets: 3, total: 32 },
        { sheets: 5, total: 52 },
        { sheets: 10, total: 104 },
        { sheets: 15, total: 156 },
        { sheets: 20, total: 208 },
        { sheets: 25, total: 260 },
        { sheets: 50, total: 520 },
        { sheets: 100, total: 1040 },
        { sheets: 150, total: 1559 },
        { sheets: 200, total: 2079 },
        { sheets: 225, total: 2339 },
        { sheets: 250, total: 2599 },
        { sheets: 275, total: 2858 },
        { sheets: 300, total: 3118 },
        { sheets: 325, total: 3378 },
        { sheets: 375, total: 3898 },
        { sheets: 400, total: 4157 },
        { sheets: 425, total: 4417 },
        { sheets: 450, total: 4677 },
        { sheets: 475, total: 4937 },
        { sheets: 500, total: 5197 },
        { sheets: 600, total: 6236 },
        { sheets: 700, total: 7275 },
        { sheets: 800, total: 8314 },
        { sheets: 900, total: 9353 },
        { sheets: 1000, total: 10393 },
        { sheets: 1100, total: 11432 },
        { sheets: 1200, total: 12471 },
        { sheets: 1300, total: 13510 },
        { sheets: 1400, total: 14550 },
        { sheets: 1500, total: 15589 },
        { sheets: 1600, total: 16628 },
        { sheets: 1700, total: 17667 },
        { sheets: 1800, total: 18706 },
        { sheets: 1900, total: 19746 },
        { sheets: 2000, total: 20785 },
        { sheets: 2100, total: 21824 },
        { sheets: 2200, total: 22863 },
        { sheets: 2300, total: 23903 },
        { sheets: 2400, total: 24942 },
        { sheets: 2500, total: 25981 }
      ]
    },
    waterproof: {
      sheetCost: 32.8,
      profile: "film",
      allowedFinishes: ["none"],
      cutAliases: {
        pieceTrim: "trim"
      },
      referenceCutAllowlist: ["trim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "digitalContour"]
    },
    upmMatte: {
      sheetCost: 55.83,
      profile: "film",
      sheetProfileOverride: {
        stockWidth: 297,
        stockHeight: 420,
        printWidth: 297,
        printHeight: 420,
        cutMargin: 0,
        gapX: 0,
        gapY: 0
      },
        allowedFinishes: ["none"],
        referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
        disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"],
        baseAdjustments: [
          {
            minArea: 9000,
            maxArea: 12000,
            minItemsPerSheet: 8,
            maxItemsPerSheet: 10,
            minSheets: 10,
            maxSheets: 20,
            maxAspectRatio: 1.15,
            printDiscounts: {
              blank: 160,
              bw1: 172,
              color1: 185
            }
          }
        ],
        cutOverrides: {
          pieceTrim: {
            minWidth: 7,
            minHeight: 7,
            simpleBucketPricing: {
            buckets: [
              { maxItemsPerSheet: 2, total: 26 },
              { maxItemsPerSheet: 6, total: 34 },
              { maxItemsPerSheet: 12, total: 48 },
              { maxItemsPerSheet: 24, total: 66 },
              { maxItemsPerSheet: 50, total: 86 },
              { total: 106 }
            ],
            sheetSurcharges: [
              { minSheets: 10, total: 10 },
              { minSheets: 25, total: 18 },
              { minSheets: 50, total: 28 },
              { minSheets: 100, total: 42 }
            ],
            aspectSurcharges: [
              { minAspectRatio: 1.7, total: 12 },
              { minAspectRatio: 2.2, total: 24 }
            ]
          }
        },
          digitalContour: {
            simpleContourPricing: {
              longNarrowBuckets: [
                { minAspectRatio: 3, maxItemsPerSheet: 12, baseTotal: 50, ratePerSheet: 12 }
              ],
              balancedMediumBuckets: [
                { minArea: 9000, maxArea: 12000, minItemsPerSheet: 8, maxItemsPerSheet: 10, maxAspectRatio: 1.15, total: 2 },
                { minArea: 5000, maxArea: 12000, minItemsPerSheet: 12, maxItemsPerSheet: 24, maxAspectRatio: 1.6, total: 2 }
              ],
              mediumFormatBuckets: [
                { minArea: 5000, maxArea: 15000, maxItemsPerSheet: 24, baseTotal: 30, ratePerSheet: 6 }
            ],
            largeFormatBuckets: [
              { minArea: 50000, maxItemsPerSheet: 2, baseTotal: 26, ratePerSheet: 3 },
              { minArea: 30000, maxItemsPerSheet: 4, baseTotal: 40, ratePerSheet: 1.2 },
              { minArea: 20000, maxItemsPerSheet: 6, baseTotal: 58, ratePerSheet: 0.8 }
            ],
            base: 24,
            ratePerMeter: 1.2,
            densitySurcharges: [
              { minItemsPerSheet: 30, total: 12 },
              { minItemsPerSheet: 50, total: 20 }
            ],
            minTotal: 35
          }
        }
      },
      curve: [
        { sheets: 1, total: 57 },
        { sheets: 5, total: 282 },
        { sheets: 10, total: 563 },
        { sheets: 25, total: 1407 },
        { sheets: 50, total: 2814 },
        { sheets: 100, total: 5627 },
        { sheets: 250, total: 14107 },
        { sheets: 500, total: 28240 },
        { sheets: 1000, total: 56507 }
      ],
      printOverrides: {
        bw1: {
          floorPerSheet: 0,
          curve: [
            { sheets: 1, total: 10 },
            { sheets: 5, total: 52 },
            { sheets: 10, total: 83 },
            { sheets: 25, total: 133 },
            { sheets: 50, total: 212 },
            { sheets: 100, total: 359 },
            { sheets: 250, total: 696 },
            { sheets: 500, total: 1170 },
            { sheets: 1000, total: 2291 }
          ]
        },
        color1: {
          floorPerSheet: 0,
          curve: [
            { sheets: 1, total: 23 },
            { sheets: 5, total: 97 },
            { sheets: 10, total: 145 },
            { sheets: 25, total: 286 },
            { sheets: 50, total: 511 },
            { sheets: 100, total: 925 },
            { sheets: 250, total: 1874 },
            { sheets: 500, total: 3212 },
            { sheets: 1000, total: 6375 }
          ]
        }
      }
    },
    ritramaWhite: {
      sheetCost: 30.454,
      profile: "film",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"]
    },
    ritramaClear: {
      sheetCost: 30.454,
      profile: "film",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    woodstock: {
      sheetCost: 28.613,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    kraft: {
      sheetCost: 30.009,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    tintoretto: {
      sheetCost: 27.357,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    sirio: {
      sheetCost: 32.451,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    silver: {
      sheetCost: 28.264,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    embossed: {
      sheetCost: 26.38,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    snow: {
      sheetCost: 32.242,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    jade: {
      sheetCost: 34.545,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    antiquaWhite: {
      sheetCost: 27.078,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    antiquaIvory: {
      sheetCost: 27.078,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    },
    acquerello: {
      sheetCost: 27.357,
      profile: "paper",
      allowedFinishes: ["none"],
      cutAliases: { pieceTrim: "trim" },
      sameSizeReferenceQuantityMode: "ceiling",
      referenceCutAllowlist: ["trim", "pieceTrim", "digitalContour"],
      disableReferenceApproximationForCuts: ["trim", "pieceTrim", "digitalContour"]
    }
  }
};
