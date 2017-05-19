---
title: html5+常用功能
date: 2017-05-19 18:09:53
categories:
	- course
tags:
	- html5+
	- native.js
---
这篇博文介绍了html5+在webApp开发中经常使用的功能模块
<!--more-->
## 获取wifi信息 ##

 1. 获取wifi的IP
``` javascript
function getOnuIp() {
    if(mui.os.android) {
        var Context = plus.android.importClass("android.content.Context");
        var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");
        var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo");

        var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
        var wifiInfo = wifiManager.getConnectionInfo();
        var ipAddress = wifiInfo.getIpAddress();
        if(ipAddress == 0) return "未连接wifi";
        return((ipAddress & 0xff) + "." + (ipAddress >> 8 & 0xff) + "." + (ipAddress >> 16 & 0xff) + "." + (ipAddress >> 24 & 0xff));
    } else if(mui.os.ios) {
        mui.toast("ios暂未获");
    }
}
```

 2. 获取wifi的网关
```javascript
function getOnuIp() {
    if(mui.os.android) {
        var Context = plus.android.importClass("android.content.Context");
        var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");
        var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo");
        var DhcpInfo=plus.android.importClass("android.net.DhcpInfo");
        var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
        var dhcpInfo = wifiManager.getDhcpInfo()
        var begin=dhcpInfo.toString().indexOf("gateway");
        var end=dhcpInfo.toString().indexOf("netmask");
        var ipAddress = dhcpInfo.toString().substring(begin+7,end).trim();  
        if(ipAddress == 0) return "未连接wifi";
        return ipAddress;
//        return((ipAddress & 0xff) + "." + (ipAddress >> 8 & 0xff) + "." + (ipAddress >> 16 & 0xff) + "." + (ipAddress >> 24 & 0xff));
    } else if(mui.os.ios) {
        var WifiManager = plus.ios.importClass("WifiManager");
        var wifiManager = new WifiManager();
        var gateWay = wifiManager.defaultGateWay();
        return gateWay;
    }
}
```

## 软键盘 ##

 1. 强制打开全键盘
```javascript
//弹出软键盘，搜索框获得焦点
var nativeWebview, imm, InputMethodManager;
var initNativeObjects = function() {
    if(mui.os.android) {
        var main = plus.android.runtimeMainActivity();
        var Context = plus.android.importClass("android.content.Context");
        InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
        imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
    } else {
        nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
    }
};
var showSoftInput = function() {
    if(mui.os.android) {
        imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
    } else {
        nativeWebview.plusCallMethod({
            "setKeyboardDisplayRequiresUserAction": false
        });
    }
    setTimeout(function() {
        //此处可写具体逻辑设置获取焦点的input
        var inputElem = document.querySelector('input');
        inputElem.focus();
    }, 200);
};
var showSoftInput2 = function() {
    var nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
    if(mui.os.android) {
        //强制当前webview获得焦点
        plus.android.importClass(nativeWebview);
        nativeWebview.requestFocus();
        imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
    } else {
        nativeWebview.plusCallMethod({
            "setKeyboardDisplayRequiresUserAction": false
        });
    }
    setTimeout(function() {
        //此处可写具体逻辑设置获取焦点的input
        var inputElem = document.querySelector('input');
        inputElem.select();
    }, 200);
};
```
 2. 关闭软键盘
```javascript
document.activeElement.blur(); //隐藏软键盘 
```
## 两次点击退出 ##
```javascript
//首页返回键处理  
//处理逻辑：2秒内，连续两次按返回键，则退出应用  
//首次按键，提示‘再按一次退出应用’  
if(!first) {
    first = new Date().getTime();
    mui.toast('再按一次退出应用');
    setTimeout(function() {
        first = null;
    }, 2000);
    return false;
} else {
    if(new Date().getTime() - first < 2000) {
        plus.runtime.quit();
    }
}
```
## 注销关闭其他窗口 ##
```javascript
/*监听注销按钮*/
document.getElementById("logoutBtn").addEventListener("tap", function() {
    var btnArray = ['是', '否'];
    mui.confirm('您确定退出?', '', btnArray, function(e) {
        if(e.index == 0) {
            // 获取所有Webview窗口
            var launchWebview = plus.webview.getLaunchWebview();
            var curr = plus.webview.currentWebview();
            var wvs = plus.webview.all();
            for(var i = 0, len = wvs.length; i < len; i++) {
                //关闭除setting页面和首页外的其他页面
                if(wvs[i].getURL() == curr.getURL() || wvs[i].getURL() == launchWebview.getURL())
                    continue;
                plus.webview.close(wvs[i]);
            }
            //清除已存储的账号信息
            myStorage.removeItem('ONU.token.username');
            myStorage.removeItem('ONU.token.password');
            myStorage.removeItem('ONU.token.autoLogin');
            myStorage.removeItem('isLogin');
            //注销静默登录的定时器
            //clearInterval('backLoading()');
            //打开login页面后再关闭setting页面
            launchWebview.show();
            curr.close();
        }
    })
});
```
