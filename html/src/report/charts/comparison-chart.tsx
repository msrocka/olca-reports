import { ChartConfiguration, ChartData } from "chart.js";
import React, { useEffect, useRef } from "react";
import { getNormalizedResult, getVariantResult, Report, ReportIndicator, ReportVariant } from "../model";
import { colorOf, staticChartOf } from "./charts";

type CompProps = {
  report: Report,
  type: "bar" | "radar",
  normalized?: boolean,
};
/** A bar or radar chart that compares all indicator values of all */
export const ComparisonChart = (props: CompProps) => {
  const { report, type } = props;
  const indicators = report.indicators;
  const variants = report.variants;
  if (!variants || variants.length === 0 ||
    !indicators || indicators.length === 0) {
    return null;
  }

  const config: ChartConfiguration = {
    type,
    data: _comparisonData(props, variants, indicators),
    options: {
      responsive: false,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  };

  /*
  if (type === "bar") {
    config.options.scales = {
      xAxes: { maxBarThickness: 50 },
      yAxes: {
        ticks: {
          beginAtZero: true,
          callback: (value: any) => props.normalized
            ? scientific(value) : `${value}%`,
        },
      },
    };
    config.options.tooltips = {
      callbacks: {
        label: (item) => {
          const value = parseFloat(item.value);
          const s = props.normalized
            ? scientific(value)
            : `${Math.round(value)}%`;
          return `${item.label}: ${s}`;
        },
      },
    };
  }

  if (type === "radar") {
    config.options.scale = {
      ticks: {
        beginAtZero: true,
        display: false,
      },
    };
  }
  */

  return staticChartOf(config);
};


function _comparisonData(p: CompProps, variants: ReportVariant[],
  indicators: ReportIndicator[]): ChartData {
  const maxvals = p.normalized ? null : _maxIndicatorValues(
    p.report, variants, indicators);
  return {
    labels: indicators.map((i) => i.impact.name),
    datasets: variants.map((v, index) => {
      return {
        label: v.name,
        borderColor: colorOf(index),
        backgroundColor: colorOf(index, p.type === "radar" ? 0.2 : null),
        data: indicators.map((i) => {
          if (p.normalized) {
            return getNormalizedResult(p.report, v, i);
          }
          const result = getVariantResult(p.report, v, i);
          return 100 * result / maxvals[i.impact.refId];
        }),
      };
    }),
  };
}

/** Returns the maximum indicator values in a map: indicator ID -> max. */
function _maxIndicatorValues(report: Report, variants: ReportVariant[],
  indicators: ReportIndicator[]): Record<string, number> {
  type NMap = Record<string, number>;
  const maxvals: NMap = indicators.reduce((m: NMap, indicator) => {
    let max: number = variants.reduce((m: number, variant) => {
      const result = Math.abs(
        getVariantResult(report, variant, indicator));
      return Math.max(result, m);
    }, 0);
    max = max === 0 ? 1 : max;
    m[indicator.impact.refId] = max;
    return m;
  }, {});
  return maxvals;
}
