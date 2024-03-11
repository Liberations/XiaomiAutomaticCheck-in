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
const package = "com.xiaomi.vipaccount";
var startPosX = 305; //滑动拖拽的中点坐标
var startPosY = 1829;//滑动拖拽的中点坐标
var blockWidth = 160;//滑块的宽度
var verImgLeftTop = [195, 1065] //验证码图片部分的左上角坐标
var verImgRightBottom = [1227, 1698] //验证码图片部分的右下角坐标
var firsBlockEndX = 445;//第一个滑块最右边的X坐标
var swipeTryCount = 0;//尝试签到的次数

//安卓版本高于Android 9
////这里的截图有root权限这里不要 start
if (device.sdkInt > 28) {
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
浏览帖子()
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

function 浏览帖子() {
    do {
        killAPP("小米社区")
        sleep(1000);

        launchApp("小米社区");
        toastLog("等待广告");
        sleep(6000);
        toastLog("开始操作");
    } while (viewPost() === false);
}

//打开软件
function 主程序1() {
    killAPP("小米社区")
    sleep(1000);
    launchApp("小米社区");
    log("启动小米社区")
    sleep(6000);
    //back();
    className("android.widget.ImageView").depth("12").desc("签到").findOne().click();
    log("点击签到")
    sleep(10000);
    if (text("已签到").exists()) {
        toastLog("已签到，不再签到");
        killAPP("小米社区")
        return
    }
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

/**
 * 开始识别
 */
function startRec() {
    //这里的截图有root的做好换成
    //var img = getScreenImage()
    var img = captureScreen()
    //var img = automator.takeScreenshot()
    if (img) {
        log("截图成功，进行识别滑块！");
    } else {
        log('截图失败，重新截图');
        return;
    };

    var x = getPointX(img, 0.7);
    console.info("识别结果滑块X坐标：" + x);
    swipe(startPosX, startPosY, x + blockWidth / 2, startPosY, 1300);
    sleep(5000);
    if (text("已签到").exists()) {
        swipeTryCount = 0;
        toastLog("已签到，不再签到");
        killAPP("小米社区")
        return
    } else {
        swipeTryCount++
        if (swipeTryCount > 3) {
            toastLog("滑动失败")
            return
        }
        startRec()
    }
}


/**
 * 获取缺口位置的x坐标
 * 传入值 img, 识别精度(precision)
 */
function getPointX(img, precision) {
    var xCount = 0;
    var finnalX = 0;
    for (var x = firsBlockEndX; x < verImgRightBottom[0]; x += 5) {    //横向遍历像素点，间隔5个像素点
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
function getScreenImage() {
    shell("screencap /sdcard/tt_screen_cap1.png", true);
    return images.read("/sdcard/tt_screen_cap1.png");
}

function viewPost() {
    let firstPostText;
    toastLog("开始查找第 1 个非视频帖子");
    while (true) {
        let firstPostChild;
        let counter;
        for (counter = 0; counter < 3; counter++) {
            try {
                firstPostChild = id(`${package}:id/content_view`)
                    .depth(15)
                    .find()
                    .filter(function (ui) {
                        return ui.bounds().width() > 0; // 存在相同 id 的情况，所以要排除
                    })[0]
                    .child(1) // 屏幕第 1 个帖子 (LinearLayout)
                    .children();
                break;
            } catch (error) {
                if (id(`${package}:id/single_banner`).exists()) {
                    id(`${package}:id/close`).findOne().click();
                    toastLog("已关闭弹窗");
                }
                toastLog(error);
                sleep(2000);
                if (text("重新加载").exists()) {
                    click("重新加载");
                    toastLog("点击 重新加载");
                    sleep(5000);
                }
            }
        }
        if (counter == 3) {
            toastLog("超过最大重试次数，没有找到帖子，结束运行");
            return false;
        }

        // 找到第 1 个非视频帖子，视频帖子不计算积分
        if (
            firstPostChild.length >= 3 &&
            firstPostChild[1].className() == "android.widget.TextView" &&
            firstPostChild[2].className() == "android.view.ViewGroup"
        ) {
            firstPostText = firstPostChild[1];
            break;
        }
        toastLog("向下滑动查找非视频帖子");
        const x = device.width / 2,
            y = (device.height / 4) * 3;
        swipe(x, y, x, y - 500, 500);
    }

    // 点击文字部分进入帖子
    toastLog("点击进入帖子");
    toastLog(firstPostText.text());
    click(firstPostText.bounds().centerX(), firstPostText.bounds().centerY());

    // 浏览和点赞
    toastLog("开始浏览帖子");
    sleep(15000);
    // className("android.widget.Button").textStartsWith("点赞").findOne().click();
    // sleep(1000);
    back();
    sleep(1000);
    back();
    toastLog("浏览和点赞结束");
    return true;
}
