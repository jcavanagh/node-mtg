@echo off

REM Export current path as node path
set NODE_PATH=%CD%

REM Launch test or app
if "%1" EQU "test" (
    node test.js
) ELSE (
    node app.js
)