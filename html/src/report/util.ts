import { Report } from "./model";

export function isEmpty<T>(xs: T[]): boolean {
  return !xs || xs.length == 0;
}

export function hasResults(report: Report): boolean {
  if (!report
    || isEmpty(report.variants)
    || isEmpty(report.indicators)
    || isEmpty(report.results)) {
    return false;
  }
  return true;
}
