#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
sudo npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist
echo 'www.jdkhome.com' > CNAME

git init
git remote add origin https://github.com/jdkhome/jdkhome.github.io.git
git add .
git commit -m "deploy"
git push -f origin master

cd ../
rm -rf dist