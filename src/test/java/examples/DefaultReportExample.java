package examples;

import java.nio.file.Files;
import java.nio.file.Paths;

import org.openlca.app.editors.projects.reports.model.Report;
import org.openlca.app.editors.projects.results.ProjectResultData;
import org.openlca.core.database.Derby;
import org.openlca.core.model.Project;
import org.openlca.julia.Julia;

public class DefaultReportExample {

  public static void main(String[] args) {
    Julia.load();
    try (var db = Derby.fromDataDir("ei2")) {
      var refId = "f5f2ab4e-ebbc-47c2-b4a7-06bd65f193e1";
      var project = db.get(Project.class, refId);
      var result = ProjectResultData.calculate(project, db);
      var json = Report.initDefault()
        .fill(result)
        .toJson();
      var file = Paths.get("C:/Users/Win10/Desktop/call.js");
      Files.writeString(file, "setData(" + json + ")\n");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
