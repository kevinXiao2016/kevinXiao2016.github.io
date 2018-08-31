---
title: 【Linux】Centos7关闭firewall防火墙，改用iptables
categories:
  - Linux
tags:
  - Linux
keyword:
  - iptables firewall
date: 2018-08-31 09:37:31
updated: 2018-08-31 09:37:31
---
关闭firewall防火墙，改用iptables
<!-- more -->

## 1、关闭默认的firewall

```cmd
systemctl stop firewalld.service    #停止firewall
systemctl disable firewalld.service #禁止firewall开机启动
firewall-cmd --state    #查看默认防火墙状态（关闭后显示notrunning，开启后显示running）
```

## 2、开启iptables

```cmd
yum install iptables    #（根据centOS7的版本和内核，有些版本已经装过，可以跳过此命令）
yum install iptables-services
service iptables restart
chkconfig iptables on 或者 systemctl enable iptables.service开机自启</span>
```

## 3、编辑防火墙文件

```cmd
vim /etc/sysconfig/iptables
```
开启21,22,80,3306端口

```cmd
<span style="font-size:18px;"># sampleconfiguration for iptables service 
# # you can edit thismanually or use system-config-firewall 
# # please do not askus to add additional ports/services to this default configuration 
*filter 
:INPUT ACCEPT [0:0] 
:FORWARD ACCEPT [0:0] 
:OUTPUT ACCEPT [0:0] 
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT 
-A INPUT -p icmp -j ACCEPT 
-A INPUT -i lo -j ACCEPT 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 21 -j ACCEPT 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT 
-A INPUT -j REJECT --reject-with icmp-host-prohibited 
-A FORWARD -j REJECT --reject-with icmp-host-prohibited 
COMMIT </span>
```

## 4、查看iptables

```cmd
iptables -L -n
```

