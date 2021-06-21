package org.openlca.app.editors.projects.reports;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.openlca.app.editors.projects.reports.model.Report;
import org.openlca.app.editors.projects.reports.model.ReportBuilder;
import org.openlca.app.editors.projects.results.ProjectResultData;
import org.openlca.core.database.Derby;
import org.openlca.core.model.Project;
import org.openlca.core.results.ProjectResult;
import org.openlca.julia.Julia;

public class Main {

  public static void main(String[] args) {
    Julia.load();
    try (var db = Derby.fromDataDir("ei22")) {
      var refId = "be27bfeb-6491-45b4-9592-3721a798be31";
      var project = db.get(Project.class, refId);
      var result = ProjectResult.calculate(project, db);
      var resultData = ProjectResultData.of(project, result, db);
      var report = Report.initDefault();
      ReportBuilder.of(resultData).fill(report);
      var json = new GsonBuilder()
        .setPrettyPrinting()
        .create()
        .toJson(report);
      System.out.println(json);
    }
  }
}
