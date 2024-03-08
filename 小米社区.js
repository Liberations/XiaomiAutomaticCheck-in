/*/ 输入密码！
function password_input()
{
    var password = "1314"
    for(var i = 0; i < password.length; i++)
    {
        var p = text(password[i].toString()).findOne().bounds();
        click(p.centerX(), p.centerY());
        sleep(100);
    }
}
 
// 解锁屏幕
function unlock()
{
    if(!device.isScreenOn())
    {
        device.wakeUp();
    }
}

unlock();
*/
//安卓版本高于Android 9
////这里的截图有root权限这里不要 start
if(device.sdkInt>28){
    //等待截屏权限申请并同意
    threads.start(function () {
        packageName('com.android.systemui').text('立即开始').waitFor();
        text('立即开始').click();
    });
}
//申请截屏权限
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit()
}
////这里的截图有root权限这里不要 end

run();//计时
//wxts();
device.wakeUp();//亮屏
//sleep(1000)
//swipe(500,1580,500,958,25);
sleep(800);
curTime = new Date();
date = curTime.getFullYear() + "-" + 0 + (curTime.getMonth() + 1) + "-" + curTime.getDate();
//获取当前日期
sleep(500);
killAPP("小米社区")
sleep(800);
主程序1();

//关闭程序 这里不同机型的强行停止不一样目前适配vivo 小米
function killAPP(name) {
    var packageName = app.getPackageName(name)
    app.openAppSetting(packageName)
    sleep(1000)
    while (true) {
        if (textMatches("结束运行|强行停止").exists()) {
            click("结束运行");
            click("强行停止");
            sleep(1000); 
            while (true) {
                if (textContains("确定").exists()) {
                    !click("确定");
                    sleep(500);
                    break;
                }
                break;
            }
            break;
        }
    }
    back();
}

//打开软件
function 主程序1() {
    launchApp("小米社区");
    log("启动小米社区")
    sleep(5000);
    //back();
    className("android.widget.ImageView").depth("12").desc("签到").findOne().click();
    log("点击签到")
    sleep(10000);
    className("android.widget.TextView").depth("13").textContains("立即签到").findOne().click();
    log("立即签到")
    sleep(5000);
    startRec()
    //killAPP("小米社区");
};



function run() { //声明运行函数
    threads.start(function () {
        startTime = new Date().getTime();

        while (true) {
            runTime();
            sleep(1000);
        }
    });
}

function runTime() {
    var endTime = new Date().getTime();
    var spendTime = Math.floor((endTime - startTime) / 1000);
    //log('已等待%m秒', spendTime);
    let t = 180;
    if (spendTime >= t) {
        console.info("定时已结束");
        launchApp("AutoJs6");
        exit();
    }
}

var startPosX = 305; //滑动拖拽的中点坐标
var startPosY = 1829;//滑动拖拽的中点坐标
var blockWidth = 160;//滑块的宽度
var verImgLeftTop = [195,1065] //验证码图片部分的左上角坐标
var verImgRightBottom = [1227,1698] //验证码图片部分的右下角坐标
/**
 * 开始识别
 */
function startRec() {
    //这里的截图有root的做好换成
    //var img = getScreenImage()
    var img = captureScreen()
    if (img) {
        log("截图成功，进行识别滑块！");
    } else {
        log('截图失败，重新截图');
        return;
    };

    var x = getPointX(img, 0.7);
    console.info("识别结果滑块X坐标：" + x);
    swipe(startPosX, startPosY, x + blockWidth/2, startPosY, 1500);
    sleep(5000);
}


/**
 * 获取缺口位置的x坐标
 * 传入值 img, 识别精度(precision)
 */
function getPointX(img, precision) {
    var xCount = 0; 
    var finnalX = 0;
    for (var x = verImgLeftTop[0]; x < verImgRightBottom[0]; x += 5) {    //横向遍历像素点，间隔5个像素点
        // var row = "";
        var tempCount = 0
        for (var y = verImgLeftTop[1]; y < verImgRightBottom[1]; y += 5) {      //找到黑点最多的y轴
            if (isBlackPoint(x, y, img, precision)) {
                // row +="1";
                tempCount += 1;
            } else {
                // row += "0";
            }
        }
        if (tempCount >= xCount) {
            xCount = tempCount;
            finnalX = x
        }
        // console.log(row);
    }
    return finnalX
}

/**
 * 判断点是否为黑色点
 * 传入值 坐标(x,y), img, 识别精度(precision)
 */
function isBlackPoint(x, y, img, precision) {
    var rgb = images.pixel(img, x, y);    //此时获取到的是ARGB
    var r = (rgb & 0xff0000) >> 16;      //得到R
    var g = (rgb & 0xff00) >> 8;            //得到G
    var b = (rgb & 0xff);                        //得到B
    var criticalValue = 255 * (1 - precision);
    if (r <= criticalValue && g <= criticalValue && b <= criticalValue) {
        return true;
    }
    return false;
}

/**
 * 判断点是否为白色点
 * 传入值 坐标(x,y), img, 识别精度(precision)
 */
function isWhitePoint(x, y, img, precision) {
    var rgb = images.pixel(img, x, y);  //此时获取到的是ARGB
    var r = (rgb & 0xff0000) >> 16;   //得到R
    var g = (rgb & 0xff00) >> 8;        //得到G
    var b = (rgb & 0xff);                    //得到B
    var criticalValue = 255 * precision;
    if (r >= criticalValue && g >= criticalValue && b >= criticalValue) {
        return true;
    }
    return false;
}

/**
 * 使用命令截图，返回imgae对像。
 */
function getScreenImage(){
    shell("screencap /sdcard/tt_screen_cap1.png",true);
    return images.read("/sdcard/tt_screen_cap1.png");
}
