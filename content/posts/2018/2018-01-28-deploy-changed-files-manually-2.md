---
title: "部署个别变动文件到服务器2"
date: 2018-01-28 22:16:08
tags: ["devops", "shell"]
categories: ["work"]
---

在上一篇文章中, 我写了基于 svn 的将变动按 war 包目录提取的文章 https://www.jianshu.com/p/a2ec55f0da0a ,
这篇文章我做了一些优化, 使得脚本能处理 C R U D 等大部分情况, 不能处理的部分也会有合理的输出.
下面假设你的项目是标准的  eclipse java web 项目. 下面两个脚本配合, 可以将变动很方便的同步到测试环境部署,值得一提的是 rsync 非常非常快.

get_changes.sh 
```sh
#!/bin/bash

# 这个脚本分析 svn diff -r commit1:commit2 --summarize 的输出, 找到两个 commit 间变动的文件,
# 按文件原有的目录结构 和 war 包的目录结构, 放到放在一个目录中.  
# 然后, 可以直接将该目录中的内容拖到 war 包中以实现快速准备 war 包; 或上传到测试服务器以实现部署

# 支持 新增, 修改; 删除不支持, 需手动删除.

if [[ $# != 2 ]]; then
    echo "get changes from  between < oldCommit > and < newCommit> , for example:"
    echo "./get_changes.sh 3330 HEAD"
    exit 1
fi

base_path="/home/develop/get_changes"

if [[ ! -d "$base_path" ]]; then  
    mkdir -p "$base_path"
fi
echo "clean ${base_path} ..."
rm -rf ${base_path}/*

revision_from="$1"
revision_to="$2"

war_path="${base_path}/war"
docs_path="${base_path}/docs"
change_log="${base_path}/log"
summarize_file="${base_path}/summarize.${revision_from}-${revision_to}"

svn diff -r $1:$2 --summarize | sort  > ${summarize_file}

# create folder structure as per war package
function my_mkdir {
    local line=$1
    local middle_path=""
    local last_path=""
    local path=""
    if [[ $line == "src/"* ]]; then
        # rm left, keep right
        middle_path="/WEB-INF/classes"
        last_path=${line#src}
        last_path=`dirname ${last_path}`
        path=${war_path}${middle_path}${last_path}
        if [[ ! -d "$path" ]]; then  
            mkdir -p "$path"
        fi
    elif [[ $line == "WebRoot/"* ]]; then
        # rm left, keep right
        last_path=${line#WebRoot}
        last_path=`dirname ${last_path}`
        path=${war_path}${last_path}
        if [[ ! -d "$path" ]]; then  
            mkdir -p "$path"  
        fi
    elif [[ $line == "docs/"* ]]; then
        # rm left, keep right
        last_path=${line#docs}
        last_path=`dirname ${last_path}`
        path=${docs_path}${last_path}
        if [[ ! -d "$path" ]]; then  
            mkdir -p "$path"  
        fi
    else
        echo "====== SKIP  my_mkdir $line"
    fi
}

# copy changed files to folders created by my_mkdir
function my_copy {
    local line=$1
    local prefix_from=""
    local prefix_to=""
    local path=""
    if [[ $line == "src/"* ]]; then
        prefix_from="build/classes"
        prefix_to=${war_path}"/WEB-INF/classes"
        # rm left, keep right
        path=${line#src}
        path=${path/.java/.class}
        cp ${prefix_from}${path} ${prefix_to}${path}
    elif [[ $line == "WebRoot/"* ]]; then
        prefix_to=${war_path}
        path=${line#WebRoot}
        cp $line ${prefix_to}${path}
    elif [[ $line == "docs/"* ]]; then
        prefix_to=${docs_path}
        path=${line#docs}
        cp $line ${prefix_to}${path}
    else
        if [[ -d "$line" ]]; then  
            echo "====== SKIP COPy,  is folder: $line"
        else
            cp $line $base_path
        fi
    fi
}

function process_line {
    local line=$1
    local action=`echo $line | awk '{print $1}'`
    local path=`echo $line | awk '{print $2}'`

    if [[ $action == "A" ]]; then
        my_mkdir $path
        my_copy $path
        # if add a folder, it is an separate line in svn diff summarize
        if [[ -d ${path} ]]; then
            echo "====== TODO may  need create remote folder: $line"
        fi
    elif [[ $action == "D" ]]; then
        echo "====== TODO  $line"
    elif [[ $action == "M" ]]; then
        my_mkdir $path
        my_copy $path
    else
        echo "====== TODO  $line"
    fi
}

while read LINE
do
      process_line "${LINE}"
done  < ${summarize_file}

echo "see changes info in $base_path :"
cat ${summarize_file}
```
![Snipaste_2018-01-28_10-40-34.png](http://upload-images.jianshu.io/upload_images/7460010-5f6fb6824b7ccec7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```sh
#!/bin/bash
# rsync 使用详解
# https://www.cnblogs.com/f-ck-need-u/p/7220009.html

# 这个脚本使用 get_changes.sh 的结果, 将变动的文件同步到测试环境. 

# 支持 新增, 修改; 删除不支持, 需手动删除.

local_path="/home/develop/get_changes/war/"
remote_user="your_user"
remote_ip="your_ip"
remote_path="your_deploy_war_path"

rsync -avz  "$local_path" "${remote_user}@${remote_ip}:${remote_path}"

```
