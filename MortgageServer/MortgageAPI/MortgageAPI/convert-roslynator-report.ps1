$inputFile = "roslynator-report.xml"
$outputFile = "roslynator-report.html"

if (!(Test-Path $inputFile)) {
    Write-Host "`u274C File not found: $inputFile"
    exit
}

try {
    [xml]$xml = Get-Content $inputFile -Raw
} catch {
    Write-Host "`u274C Failed to load XML. Error: $_"
    exit
}

$html = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Roslynator Code Smell Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 40px;
            background-color: #f5f7fa;
            color: #2c3e50;
        }
        h1, h2 {
            color: #34495e;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 5px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
            margin-bottom: 40px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #f0f2f5;
            font-weight: 600;
            color: #34495e;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .diagnostic {
            background-color: #fff;
            border-left: 5px solid #3498db;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 15px 20px;
            margin-bottom: 15px;
            border-radius: 8px;
        }
        .severity {
            font-weight: bold;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }
        .severity::before {
            content: "\26A0";
            margin-right: 8px;
            font-size: 16px;
        }
        .severity.Error::before { content: "\274C"; color: #e74c3c; }
        .severity.Info::before { content: "\2139"; color: #3498db; }
        .severity.Warning::before { content: "\26A0"; color: #f39c12; }
        .filepath {
            font-size: 0.9em;
            color: #777;
            margin-top: 4px;
        }
        a {
            color: #007acc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Roslynator Code Smell Report</h1>
    <h2>Summary</h2>
    <table>
        <tr><th>ID</th><th>Title</th><th>Count</th><th>Help Link</th></tr>
"@

foreach ($diag in $xml.Roslynator.CodeAnalysis.Summary.Diagnostic) {
    $id = $diag.Id
    $title = $diag.Title
    $count = $diag.Count
    $link = $diag.HelpLink
    $html += "<tr><td>$id</td><td>$title</td><td>$count</td><td><a href='$link' target='_blank'>Link</a></td></tr>`n"
}

$html += "</table>`n"

foreach ($project in $xml.Roslynator.CodeAnalysis.Projects.Project) {
    $projectName = $project.Name
    $html += "<h2>Project: $projectName</h2>`n"

    foreach ($diag in $project.Diagnostics.Diagnostic) {
        $id = $diag.Id
        $message = $diag.Message
        $filePath = $diag.FilePath
        $severity = $diag.Severity
        $line = $diag.Location.Line
        $char = $diag.Location.Character

        $severityClass = $severity -replace '\s', ''
        $html += "<div class='diagnostic'>"
        $html += "<div class='severity $severityClass'>[$id] $message</div>"
        $html += "<div class='filepath'>File: $filePath - Line: $line, Char: $char</div>"
        $html += "</div>`n"
    }
}

$html += @"
</body>
</html>
"@

$html | Out-File -Encoding UTF8 $outputFile
Write-Host "HTML report generated at: $outputFile"