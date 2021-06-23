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
    try (var db = Derby.fromDataDir("ei22")) {
      var refId = "be27bfeb-6491-45b4-9592-3721a798be31";
      var project = db.get(Project.class, refId);
      var result = ProjectResultData.calculate(project, db);
      var json = Report.initDefault()
        .fill(result)
        .toJson();
      var file = Paths.get("C:/Users/ms/Desktop/call.js");
      Files.writeString(file, "setData(" + json + ")\n");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
