import xml.etree.ElementTree as ET
import json
import sys

tree = ET.parse('roslynator-report.xml')
root = tree.getroot()

results = []

for diag in root.findall('.//Diagnostic'):
    message = diag.findtext('Message')
    severity = diag.findtext('Severity')
    location = diag.find('Locations/Location')

    if location is not None:
        file_path = location.findtext('Path')
        start_line = int(location.findtext('StartLinePosition/Line') or 1) + 1
        start_column = int(location.findtext('StartLinePosition/Character') or 1) + 1

        result = {
            "ruleId": diag.attrib.get('Id', 'UNKNOWN'),
            "level": severity.lower(),
            "message": {"text": message},
            "locations": [{
                "physicalLocation": {
                    "artifactLocation": {
                        "uri": file_path.replace("\\", "/"),
                        "uriBaseId": "%SRCROOT%"
                    },
                    "region": {
                        "startLine": start_line,
                        "startColumn": start_column
                    }
                }
            }]
        }

        results.append(result)

sarif_log = {
    "version": "2.1.0",
    "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0.json",
    "runs": [{
        "tool": {
            "driver": {
                "name": "roslynator",
                "informationUri": "https://github.com/JosefPihrt/Roslynator",
                "rules": []
            }
        },
        "results": results
    }]
}

with open('roslynator-report.sarif', 'w') as f:
    json.dump(sarif_log, f, indent=2)
