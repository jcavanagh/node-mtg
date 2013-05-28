#!/bin/sh

# Export current path as node path
export NODE_PATH=${PWD}

# Launch test, client, or app
if [ "$1" = "test" ]; then
    node test.js
elif [ "$1" = "client" ]; then
    node client.js
else
    node app.js
fi