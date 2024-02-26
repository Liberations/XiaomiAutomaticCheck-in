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

//关闭程序
function killAPP(name) {
    var packageName = app.getPackageName(name)
    app.openAppSetting(packageName)
    sleep(1000)
    while (true) {
        if (text("结束运行").exists()) {
            click("结束运行");
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
    sleep(1000);
    className("android.widget.TextView").depth("18").indexInParent("0").findOne().click();
    sleep(15000);
    back();
    className("android.widget.ImageView").depth("12").desc("签到").findOne().click();
    sleep(10000);
    className("android.view.View").depth("13").textContains("立即签到").findOne().click();
    sleep(10000);
    if (!images.requestScreenCapture()) {
        log('请求失败');
        exit();
    }
    sleep(2000);
    var pictures = images.clip(captureScreen(),0,0,device.width,device.height/2);
    //左上角x y 和宽高
    images.save(pictures, "/sdcard/Pictures/pictures.png", "png", 100);
    var img = images.read("/sdcard/Pictures/pictures.png");
    var g = images.grayscale(img);
    var result = images.threshold(g, 112, 155);
    images.save(result, "/sdcard/Pictures/result.png", "png", 100);
    var image = images.read("/sdcard/Pictures/result.png");
    var width = image.getWidth();
    var height = image.getHeight();
    var path = "/sdcard/Pictures/test.txt";
    for (let i = 1; i < height; i += 3) {
        var s = "";
        for (let j = 1; j < width; j += 3) {
            var number = images.pixel(image, j, i);
            var color = colors.toString(number);
            log(color)

            var ss = color == "#9B9B9B" ? 1 : 0;
            s += ss;
        }
        files.append(path, s + "\n");
    }
    var arr = files.read(path).split("\n");
    var len = -1;
    for (let i = 0; i < arr.length; i++) {
        var index = arr[i].indexOf("100000000000000000000000000000000000001");
        if (index > -1) {
            len = index * 3 + 60;
            //60为滑块中心，*3是前面以3为循环
            //log(len);
            break;
        }
    }
    if (len > -1) {
        continuousSwipe(270, 1240, len, 1240, 1000);
    } else {
        log("计算失败");
    }
    //随机滑动
    function continuousSwipe(x1, y1, x2, y2, duration) {
        var steps = 100; // 滑动步数
        var dx = (x2 - x1) / steps;
        var dy = (y2 - y1) / steps;
        var stepDuration = duration / steps; // 每步持续时间

        // 定义手势路径
        var path = [];
        for (var i = 0; i <= steps; i++) {
            var moveX = x1 + dx * i + random(0, 5); // 在x方向加入随机性
            var moveY = y1 + dy * i + random(-8, 8); // 在y方向加入随机性
            path.push([moveX, moveY, stepDuration]);
        }

        // 模拟手势操作
        gesture.apply(null, [duration].concat(path));
    }
    sleep(1000);

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