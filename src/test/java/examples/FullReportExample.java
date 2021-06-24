package examples;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import gnu.trove.map.hash.TLongIntHashMap;
import org.openlca.app.editors.projects.reports.model.Report;
import org.openlca.app.editors.projects.reports.model.ReportComponent;
import org.openlca.app.editors.projects.reports.model.ReportSection;
import org.openlca.app.editors.projects.results.ProjectResultData;
import org.openlca.core.database.Derby;
import org.openlca.core.model.Project;
import org.openlca.core.model.descriptors.ProcessDescriptor;
import org.openlca.julia.Julia;
import org.openlca.util.Pair;

public class FullReportExample {

  public static void main(String[] args) {
    Julia.load();
    try (var db = Derby.fromDataDir("ei2")) {

      // calculate a project
      var projectId = "f5f2ab4e-ebbc-47c2-b4a7-06bd65f193e1";
      var project = db.get(Project.class, projectId);
      var result = ProjectResultData.calculate(project, db);

      // generate a report with all components
      var report = new Report();
      for (var comp : ReportComponent.values()) {
        var id = comp.id();
        var section = new ReportSection();
        section.index = report.sections.size();
        section.title = id;
        section.text = "Test of component with id=" + id;
        section.componentId = id;
        report.sections.add(section);
      }

      // add the top contributors
      var processes = topContributorsOf(result);
      report.processes.addAll(processes);

      // write the JS call to some file
      var json = report.fillWith(result)
        .toJson();
      var jsCall = "setData(" + json + ")";
      var file = Paths.get("C:/Users/Win10/Desktop/full_report.js");
      Files.writeString(file, jsCall);

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static List<ProcessDescriptor> topContributorsOf(
    ProjectResultData data) {

    var processes = data.items().processes();
    var ranking = new TLongIntHashMap();
    for (var impact : data.items().impacts()) {
      for (var variant : data.project().variants) {
        var result = data.result().getResult(variant);
        var sorted = processes.stream()
          .map(p -> Pair.of(p, result.getDirectImpactResult(p, impact)))
          .sorted(Comparator.comparingDouble(p -> p.second))
          .collect(Collectors.toList());

        double lastVal = 0;
        int r = 0;
        for (var pair : sorted) {
          if (pair.second == 0)
            continue;
          if (Math.abs(pair.second - lastVal) > 1e-9) {
            r++;
          }
          ranking.put(pair.first.id, ranking.get(pair.first.id) + r);
        }
      }
    }

    return processes.stream()
      .filter(p -> p instanceof ProcessDescriptor)
      .map(p -> (ProcessDescriptor) p)
      .sorted((p1, p2) -> {
        int r1 = ranking.get(p1.id);
        int r2 = ranking.get(p2.id);
        return Integer.compare(r2, r1);
      }).limit(5)
      .collect(Collectors.toList());
  }
}
