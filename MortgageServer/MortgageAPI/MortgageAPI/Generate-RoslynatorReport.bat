@echo off
setlocal

REM Path to the PowerShell script (same folder assumed)
set PS_SCRIPT=convert-roslynator-report.ps1

REM Check if the PowerShell script exists
if not exist %PS_SCRIPT% (
    echo PowerShell script not found: %PS_SCRIPT%
    pause
    exit /b
)

REM Run the PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"

REM Open the generated report in the default browser
start roslynator-report.html

endlocal
