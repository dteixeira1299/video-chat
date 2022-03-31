#!/bin/sh
USERNAME=$1

if [ ! -z "$USERNAME" ]
then
    # Generate build file
    npm run build
    mv ./build ./video
    tar cvzf client.tar.gz video

    scp client.tar.gz $USERNAME@10.0.0.206:/incoming/

    # Clean after deploy process
    rm -rf video
    rm -rf client.tar.gz
else
    echo "Necessary to add username parameter!"
    exit 1
fi