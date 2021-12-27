#!/bin/zsh

if [ -z "$1" ]
    then
        echo "No version tag was supplied eg: 1.2.4"
        exit 1
fi

CURRENT=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

 if [ $CURRENT != 'master' ]
   then
     echo "Your branch has to be 'master' but is '$CURRENT'"
     exit 1
 fi


sed -i "" -e "s&\"version\":.*&\"version\": \"$1\",&" package.json
git add ./package.json
git commit -m "Version updated to V$1"
git tag -a V$1 -m "Version $1"

ng build -c production

git push
git push --tags
