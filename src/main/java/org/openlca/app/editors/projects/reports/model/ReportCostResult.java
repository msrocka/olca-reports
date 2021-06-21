package org.openlca.app.editors.projects.reports.model;

import java.util.Objects;

import org.openlca.core.model.Currency;
import org.openlca.core.model.ProjectVariant;

class ReportCostResult {

  private final String variant;

  private final String currency;

  private final double value;

  private ReportCostResult(String variant, String currency, double value) {
    this.variant = variant;
    this.currency = currency;
    this.value = value;
  }

  static ReportCostResult of(
    ProjectVariant variant, Currency currency, double value) {
    var v = variant == null || variant.name == null
      ? ""
      : variant.name;
    var c = currency == null
      ? "?"
      : Objects.requireNonNullElseGet(currency.code,
      () -> Objects.requireNonNullElse(currency.name, "?"));
    return new ReportCostResult(v, c, value);
  }

  String variant() {
    return variant;
  }

  String currency() {
    return currency;
  }

  double value() {
    return value;
  }

}
