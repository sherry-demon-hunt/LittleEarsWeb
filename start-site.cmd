@echo off
setlocal

cd /d "%~dp0"

set "PORT=8000"
set "URL=http://localhost:%PORT%/"

echo Starting Little Ears Website at %URL%
echo.
echo Keep this window open while you are viewing the site.
echo Press Ctrl+C in this window to stop the local server.
echo.

start "" "%URL%"
python -m http.server %PORT%
