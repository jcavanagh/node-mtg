#!/bin/sh

# Export current path as node path
export NODE_PATH=${PWD}

# Launch test or app
if [ "$1" = "test" ]; then
    node test.js
else
    node app.js
fi