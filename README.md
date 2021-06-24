# A redesign of the report API for openLCA 2.x

There is a new result view for projects in openLCA 2. It is then possible to
create a report from this result view. The report editor and report html view
is in principle the same as in openLCA 1.10, but the internal mechanisms
changed:

* the report is created from a calculated result,
* model data like variant or parameter descriptions are stored and taken from
  the database instead from a report in the workspace,
* static report data can be saved to and loaded from report templates
