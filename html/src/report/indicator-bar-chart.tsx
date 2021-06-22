import { Chart, ChartConfiguration, ChartData } from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import * as model from "./model";

export const IndicatorBarChart = ({ report }: { report: model.Report }) => {

  const indicators = report.indicators;
  const variants = report.variants;
  if (!variants || variants.length === 0 ||
    !indicators || indicators.length === 0) {
    return <></>;
  }

  // the index of the selected indicator
  const [indicatorIdx, setIndicatorIdx] = useState(0);

  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {

    const config: ChartConfiguration = {
      type: "bar",
      data: chartDataOf(report, indicators[indicatorIdx]),
      options: {
        responsive: false,
      }
    };

    const context2d = canvas.current?.getContext("2d");
    const chart = context2d
      ? new Chart(context2d, config)
      : null;
    return () => chart?.destroy();
  });

  return (
    <div style={{ textAlign: "center" }}>
      <form>
        <fieldset>
          <select value={indicatorIdx} style={{ width: 300 }}
            onChange={(e) => setIndicatorIdx(parseInt(e.target.value, 10))}>
            {indicators.map((indicator, idx) => (
              <option key={indicator.impact.refId} value={idx}>
                {indicator.impact.name}
              </option>
            ))}
          </select>
        </fieldset>
      </form>
      <canvas width="650" height="400" ref={canvas}
        style={{ display: "inline-block" }} />
    </div>
  );
}

function chartDataOf(
  report: model.Report, indicator: model.ReportIndicator): ChartData {
  const results = [];
  const labels = [];
  for (const variant of report.variants) {
    labels.push(variant.name);
    results.push(model.getVariantResult(report, variant, indicator));
  }
  return {
    labels,
    datasets: [{
      data: results,
      label: indicator.impact.name,
      borderColor: "#7b0052",
      backgroundColor: "#7b0052",
      maxBarThickness: 50,
    }],
  };
}
