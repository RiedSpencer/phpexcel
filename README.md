# phpexcel
php+phpexcel+sqlite+spec


关于phpexcel进行表格的下载和上传处理小插件说明

1、首先安装phpstudy，或者直接已经部署好了php和服务器环境
2、启动服务器，并且需要配置虚拟域名或者直接localhost
3、在浏览器运行excel.html就相当于index.html

采用的是sqlite进行数据保存的办法，所以文件夹里面会有一个data.db的文件，如果不小心误删的话，可以运行db.php，但是要把下面的代码注释去掉，创建一个 ANTABLE 表，用来保存excel和表格名字，因为excel表格的名字中文居多
字段名是保存在表格的首行，如果只需要数据，应该从第二条数据开始
