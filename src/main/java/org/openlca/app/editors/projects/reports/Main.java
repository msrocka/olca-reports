package org.openlca.app.editors.projects.reports;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

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
    try (var db = Derby.fromDataDir("ei2")) {
      var refId = "f5f2ab4e-ebbc-47c2-b4a7-06bd65f193e1";
      var project = db.get(Project.class, refId);
      var result = ProjectResult.calculate(project, db);
      var resultData = ProjectResultData.of(project, result, db);
      var report = Report.initDefault();
      ReportBuilder.of(resultData).fill(report);
      var json = new GsonBuilder()
        .setPrettyPrinting()
        .create()
        .toJson(report);
      var file = Paths.get("C:/Users/Win10/Desktop/call.js");
      Files.writeString(file, "setData(" + json + ")\n");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
