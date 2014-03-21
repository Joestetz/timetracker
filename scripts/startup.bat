@echo off

set BASE_DIR=%~dp0

echo Starting Web Server
start cmd /k node %BASE_DIR%..\server\app.js

echo Starting Karma
start cmd /k %BASE_DIR%test.bat