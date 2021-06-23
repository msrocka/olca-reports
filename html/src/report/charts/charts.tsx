import React, { useEffect, useRef } from "react";
import {
  Report, ReportVariant, ReportIndicator, getVariantResult,
  getNormalizedResult,
} from "../model";
import { Chart, ChartData, ChartConfiguration } from "chart.js";

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

export function staticChartOf(config: ChartConfiguration): JSX.Element {

  const canvas = useRef<HTMLCanvasElement>(null);
  let chart: Chart | null = null;
  useEffect(() => {
    if (chart) {
      return;
    }
    const ctxt = canvas.current.getContext("2d");
    chart = new Chart(ctxt, config);
    return () => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    };
  });

  return (
    <div style={{ textAlign: "center" }}>
      <canvas width="650" height="400" ref={canvas}
        style={{ display: "inline-block" }} />
    </div>
  );
}

export function colorOf(i: number, alpha?: number): string {
  const colors = [
    "229, 48, 57",
    "41, 111, 196",
    "255, 201, 35",
    "82, 168, 77",
    "132, 76, 173",
    "127, 183, 229",
    "255, 137, 0",
    "128, 0, 128",
    "135, 76, 63",
    "252, 255, 100",
    "0, 177, 241",
    "112, 187, 40",
    "18, 89, 133",
    "226, 0, 115",
    "255, 255, 85",
    "218, 0, 24",
    "0, 111, 154",
    "255, 153, 0",
  ];
  let color;
  if (i < colors.length) {
    color = colors[i];
  } else {
    const gen = () => Math.round(Math.random() * 255);
    color = `${gen()}, ${gen()}, ${gen()}`;
  }
  return alpha
    ? `rgba(${color}, ${alpha})`
    : "rgb(" + color + ")"
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

export const IndicatorCombo = ({ indicators, selectedIndex, onChange }: {
  indicators: ReportIndicator[],
  selectedIndex: number,
  onChange: (nextIndex: number) => void,
}) => {

  const options = indicators.map((indicator, idx) => (
    <option key={indicator.impact.refId} value={idx}>
      {indicator.impact.name}
    </option>
  ));

  return (
    <form>
      <fieldset>
        <select
          value={selectedIndex}
          style={{ width: 300 }}
          onChange={e => onChange(parseInt(e.target.value, 10))}>
          {options}
        </select>
      </fieldset>
    </form>
  );
}
