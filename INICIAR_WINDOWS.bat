@echo off
cd /d "%~dp0"
py -3 start_server.py
if errorlevel 1 python start_server.py
pause
