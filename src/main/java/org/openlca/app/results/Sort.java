package org.openlca.app.results;

import org.openlca.core.results.IResult;
import org.openlca.core.results.ResultItemView;
import org.openlca.util.Strings;

public final class Sort {

	private Sort() {
	}

	public static void sort(IResult result) {
		if (result == null)
			return;

		result.getProcesses().sort((p1, p2) -> {
			String name1 = p1.name;
			String name2 = p2.name;
			return Strings.compare(name1, name2);
		});

		if (result.hasEnviFlows()) {
			result.getFlows().sort((f1, f2) -> {
				String name1 = f1.flow().name;
				String name2 = f2.flow().name;
				return Strings.compare(name1, name2);
			});
		}

		if (result.hasImpacts()) {
			result.getImpacts().sort(
				(i1, i2) -> Strings.compare(i1.name, i2.name));
		}
	}

	public static void sort(ResultItemView items) {
		if (items == null)
			return;

		items.techFlows().sort((tf1, tf2) -> {
			int c = Strings.compare(tf1.process().name, tf2.process().name);
			if (c != 0)
				return c;
			return Strings.compare(tf1.flow().name, tf2.flow().name);
		});

		if (items.hasEnviFlows()) {
			items.enviFlows().sort((ef1, ef2) -> Strings.compare(
				ef1.flow().name, ef2.flow().name));
		}

		if (items.hasImpacts()) {
			items.impacts().sort(
				(i1, i2) -> Strings.compare(i1.name, i2.name));
		}
	}

}
