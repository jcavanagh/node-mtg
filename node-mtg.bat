@echo off

REM Export current path as node path
set NODE_PATH=%CD%

REM Launch test, client, or app
IF "%1" EQU "test" (
    node test.js
) ELSE (
    IF "%1" EQU "client" (
        node client.js
    ) ELSE (
        IF "%1" EQU "client-debug" (
            node --debug client.js
        ) ELSE (
            IF "%1" EQU "debug" (
                node --debug app.js
            ) ELSE (
                node app.js
            )
        )
    )
)