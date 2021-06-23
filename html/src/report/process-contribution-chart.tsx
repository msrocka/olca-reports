import { Chart, ChartConfiguration } from "chart.js";
import React, { useEffect, useRef, useState } from "react";

import * as model from "./model";
import { IndicatorCombo } from "./indicator-combo";

export const ProcessContributionChart = ({ report }: { report: model.Report }) => {
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
    const indicator = indicators[indicatorIdx];
    const config = configOf(report, indicator);
    const context2d = canvas.current?.getContext("2d");
    const chart = context2d
      ? new Chart(context2d, config)
      : null;
    return () => chart?.destroy();
  });

  return (
    <div style={{ textAlign: "center" }}>
      <IndicatorCombo
        indicators={indicators}
        selectedIndex={indicatorIdx}
        onChange={setIndicatorIdx} />
      <canvas width="650" height="400" ref={canvas}
        style={{ display: "inline-block" }} />
    </div>
  );

}

function configOf(report: model.Report, indicator: model.ReportIndicator):
  ChartConfiguration {

  return {
    type: "bar",

  }

}
