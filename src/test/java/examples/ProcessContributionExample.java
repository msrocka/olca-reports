package examples;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.ThreadLocalRandom;

import org.openlca.app.editors.projects.reports.model.Report;
import org.openlca.app.editors.projects.reports.model.ReportComponent;
import org.openlca.app.editors.projects.reports.model.ReportSection;
import org.openlca.app.editors.projects.results.ProjectResultData;
import org.openlca.core.database.Derby;
import org.openlca.core.model.Project;
import org.openlca.core.model.descriptors.ProcessDescriptor;
import org.openlca.julia.Julia;

public class ProcessContributionExample {

  public static void main(String[] args) {
    Julia.load();

    try (var db = Derby.fromDataDir("ei22")) {

      // calculate a project result
      var refId = "be27bfeb-6491-45b4-9592-3721a798be31";
      var project = db.get(Project.class, refId);
      var result = ProjectResultData.calculate(project, db);

      // prepare a report with a single section
      var report = new Report();
      var section = new ReportSection();
      section.title = "Process contributions";
      section.text = "Some process contributions ...";
      section.componentId = ReportComponent.PROCESS_CONTRIBUTION_CHART
        .id();
      report.sections.add(section);

      // add n top contributors for each project variant
      int n = Math.max((int) 10.0 / project.variants.size(), 1);
      var impacts = result.items().impacts();
      var rand = ThreadLocalRandom.current();
      for (var variant : project.variants ) {
        var r = result.result().getResult(variant);
        for (int i = 0; i < n; i++) {
          var impactIdx = rand.nextInt(0, impacts.size());
          var impact = impacts.get(impactIdx);
          ProcessDescriptor next = null;
          double contribution = 0;
          for (var techFlow : r.techIndex()) {
            if (!(techFlow.process() instanceof ProcessDescriptor))
              continue;
            var process = (ProcessDescriptor) techFlow.process();
            if (report.processes.contains(process))
              continue;
            double c = r.getDirectImpactResult(techFlow, impact);
            if (c > contribution) {
              next = process;
              contribution = c;
            }
          }
          if (next != null) {
            report.processes.add(next);
          }
        }
      }

      // write the report
      var json = report.fillWith(result)
        .toJson();
      var file = Paths.get("C:/Users/ms/Desktop/call_procs.js");
      Files.writeString(file, "setData(" + json + ")\n");

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

}
