@echo off
echo Starting Self-Love Salon Website Server...
echo.
echo Finding your computer IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    for /f "tokens=1-4 delims=. " %%b in ("%%a") do (
        if not "%%e"=="" (
            set IP=%%b.%%c.%%d.%%e
        )
    )
)

if defined IP (
    echo.
    echo ========================================
    echo     WEB SERVER RUNNING
    echo ========================================
    echo.
    echo Access your website at:
    echo   http://%IP%:8000
    echo.
    echo On your phone, open:
    echo   http://%IP%:8000/index.html
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    echo.
    python -m http.server 8000
) else (
    echo Could not find IP address
    pause
)
