#!/bin/sh

# Export current path as node path
export NODE_PATH=${PWD}

# Launch test, client, or app
if [ "$1" = "test" ]; then
    node test.js
elif [ "$1" = "client" ]; then
    node client.js
elif [ "$1" = "client-debug" ]; then
    node --debug client.js
elif [ "$1" = "client-debug-brk" ]; then
    node --debug-brk client.js
elif [ "$1" = "debug" ]; then
    node --debug app.js
elif [ "$1" = "debug-brk" ]; then
    node --debug-brk app.js
else
    node app.js
fi