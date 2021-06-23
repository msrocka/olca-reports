export type Report = {
  title: string;
  withNormalisation: boolean;
  withWeighting: boolean;
  sections?: ReportSection[];
  processes?: ProcessDescriptor[];

  variants?: ReportVariant[];
  parameters?: ReportParameter[];
  indicators?: ReportIndicator[];
  results?: ReportImpactResult[];
  addedValues?: ReportCostResult[];
  netCosts?: ReportCostResult[];
};

export type Descriptor = {
  refId: string;
  name: string;
  description?: string;
};

export type ImpactDescriptor = Descriptor & {
  referenceUnit?: string;
};

export type ProcessDescriptor = Descriptor;

export type ParameterRedef = {
  name: string;
  description?: string;
  value: number;
};

export type ReportParameter = {
  redef: ParameterRedef;
  context?: Descriptor;
  variantValues: Record<string, number>;
};

export type ReportIndicator = {
  impact: ImpactDescriptor;
  normalisationFactor?: number;
  weightingFactor?: number;
};

export type ReportSection = {
  index: number;
  title: string;
  text: string;
  componentId?: string;
};

export type ReportVariant = {
  name: string;
  description?: string;
};

export type ReportImpactResult = {
  indicatorId: string;
  variantResults?: VariantResult[];
};

export type VariantResult = {
  variant: string;
  totalAmount: number;
  contributions?: Record<string, number>;
};

export type ReportCostResult = {
  variant: string;
  currency: string;
  value: number;
};

export function getVariantResult(
  report: Report, variant: ReportVariant, indicator: ReportIndicator): number {
  if (!report.results) {
    return 0;
  }
  for (const result of report.results) {
    if (result.indicatorId !== indicator.impact?.refId || !result.variantResults) {
      continue;
    }
    for (const vr of result.variantResults) {
      if (vr.variant === variant.name) {
        return vr.totalAmount || 0;
      }
    }
  }
  return 0;
}

export const getNormalizedResult = (r: Report, v: ReportVariant,
  i: ReportIndicator): number => {
  const result = getVariantResult(r, v, i);
  if (result === 0 || !i.normalisationFactor) {
    return 0;
  }
  return result / i.normalisationFactor;
};

export const getSingleScore = (r: Report, v: ReportVariant,
  i: ReportIndicator): number => {
  const n = getNormalizedResult(r, v, i);
  if (n === 0 || !i.weightingFactor) {
    return 0;
  }
  return n * i.weightingFactor;
};

export function scientific(n: number): string {
  if (!n) {
    return "0";
  }
  return n.toExponential(5);
}
