---
title: "部署个别变动文件到服务器"
date: 2017-12-15 22:16:08
series: ["database"]

---

持续集成是个好东西, 但有些老项目因为各种原因用不了.
维护这样的老项目, 往往是改动某个文件, 然后上传到测试/生产服务器, over. 这样的工作不胜其烦而且容易出错,
今天终于抽时间写了一个小工具, 来做这个事情.

思路如下:
1.  使用 svn diff -r 3265:HEAD --summarize 生成 svn 两个 commit 之间的文件变动信息, 像下面这个样子.
```bash
± |user-edit ✓| → svn diff -r 3265:HEAD --summarize
M       WebRoot/jsp/right/userInfoUpdate.jsp
M       src/com/action/right/UserInfoAction.java
M       src/com/action/right/UserAction.java
M       src/com/hibernate/UserInfo.java
M       src/com/services/right/IUserInfoService.java
M       src/com/services/right/UserInfoServiceImpl.java
M       src/com/jpa/notify/NotifyDaoImpl.java
M       src/com/jpa/right/IUserInfoDao.java
M       src/com/jpa/right/UserInfoDaoImpl.java
A       docs/sql/userInfo.sql
A       sync_to_sever.sh

```
上面这个输出有两部分, M 或 A 表示修改或新增, 我叫它 action; 后面的是文件路径, 我叫它 local file.

2. 根据 action 和 local file 文件类型, 找到 copy 的源和目的路径.

3. 使用 ssh master 模式, 用 scp 将变动的文件从本地拷贝到远程.

详细代码见下面.

```bash
#!/bin/bash

# this script sync changed files to server

username="username"
hostname="remote.example.com"
remote_war_path="/your_deploye_path/example.war"

revision_from="$1"
revision_to="$2"
summarize_file="/tmp/sync_to_server.$1-$2"

svn diff -r $1:$2 --summarize  > $summarize_file

# https://www.ibm.com/developerworks/community/blogs/IBMzOS/entry/20150502?lang=en
# use ssh master mode. so later scp resue the ssh conection.
ssh -M -N -f ${username}@${hostname}

function copy_jsp {
    local local_file=$1
    # rm begining WebRoot
    local remote_file=${local_file#*WebRoot}
    scp  $local_file ${username}@${hostname}:${remote_war_path}$remote_file
}

function copy_java {
    local local_file=$1
    local_file=${local_file/.java/.class}
    local_file=${local_file#*src}
    # rm begining src
    local remote_file="/WEB-INF/classes"${local_file#*src}
    scp  build/classes$local_file ${username}@${hostname}:${remote_war_path}$remote_file
}

function copy_xml {
    local local_file=$1
    if [[ $local_file == "WebRoot/"* ]]; then
        remote_file=${local_file#*WebRoot}
    elif [[ $local_file == "src/"* ]]; then
        local_file=${local_file#*src}
        # rm begining WebRoot
        remote_file="/WEB-INF/classes"${local_file#*src}
    fi
    scp  build/classes$local_file ${username}@${hostname}:${remote_war_path}$remote_file
}

function process_line {
    local line=$1
    local action=`echo $line | awk '{print $1}'`
    local path=`echo $line | awk '{print $2}'`

    if [[ $action == "M" ]] || [[ $action == "A" ]]; then
        if [[ ${path} == *.jsp ]]; then
            copy_jsp ${path}
        elif [[ ${path} == *.java ]]; then
            copy_java ${path}
        elif [[ ${path} == *.xml ]]; then
            copy_xml ${path}
        else
            echo "SKIP $path"
        fi
    else
        echo "TODO action==$action"
    fi
}

while read LINE
do
      process_line "${LINE}"
done  < ${summarize_file}

ssh -o ControlMaster=no ${username}@${hostname} -O exit
```
也可以在 https://github.com/feitian124/collection/blob/master/sync_to_sever.sh 里找到它.
