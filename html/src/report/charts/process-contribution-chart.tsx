import { Chart, ChartConfiguration } from "chart.js";
import React, { useEffect, useRef, useState } from "react";

import * as model from "../model";
import { colorOf, IndicatorCombo } from "./charts";

export const ProcessContributionChart = ({ report }: { report: model.Report }) => {
  const indicators = report.indicators;
  if (isEmpty(report.indicators)
    || isEmpty(report.variants)
    || isEmpty(report.processes)) {
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

  const variants = report.variants;

  const datasets = [];
  datasets.push({
    label: "Other",
    backgroundColor: "rgba(121, 121, 121, 0.5)",
    maxBarThickness: 50,
    data: variants.map((variant) => model.getContribution(
      { report, indicator, variant, rest: true })),
  });
  for (let i = 0; i < report.processes.length; i++) {
    const process = report.processes[i];
    datasets.push({
      label: process.name,
      backgroundColor: colorOf(i),
      maxBarThickness: 50,
      data: variants.map(variant => model.getContribution(
        { report, indicator, variant, process }))
    })
  }

  const unit = indicator.impact.referenceUnit || "";

  return {
    type: "bar",
    data: {
      labels: variants.map(variant => variant.name),
      datasets,
    },
    options: {
      responsive: false,
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          title: { display: true, text: unit }
        }
      },
      plugins: {
        legend: { display: true, position: "bottom" },
        tooltip: {
          callbacks: {
            label: (item) => {
              const num = (item.raw as number).toExponential(3);
              return `${num} ${unit} : ${item.dataset.label}`;
            },
          }
        }
      }
    },
  }
}

function isEmpty<T>(xs: T[]): boolean {
  return !xs || xs.length == 0;
}