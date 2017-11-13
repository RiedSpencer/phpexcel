//将一些常用的js函数进行封装[方便查看就不进行压缩]

/**
 * 得到min到max的随机数，num为小数的位数
 * @param min
 * @param max
 * @param num
 */
function round(min, max, num) {
    if (!arguments[2]) num = 0;//默认为整数
    if (!arguments[1]) max = 1;//默认到1;
    return (Math.random() * max / 2 + min).toFixed(num);
}

/**
 * 根据时间戳进行日期的格式化
 * @param strtime
 * @param format
 * @returns {Date}
 */
function formatDate(format, strtime) {
    if (!arguments[0]) format = "Y-m-d H:i:s";
    if (!arguments[1]) strtime = (new Date()).valueOf();
    var date = new Date(strtime);
    var year = date.getFullYear();
    str = format.replace(/Y/, year);
    var mon = date.getMonth();
    str = str.replace("m", mon);
    var day = date.getDay();
    str = str.replace("d", day);
    var hour = date.getHours();
    str = str.replace("H", hour);
    var min = date.getMinutes();
    str = str.replace("i", min);
    var second = date.getSeconds();
    str = str.replace("s", second);
    return str;
}


/**
 * 进行表单必须字段不为空验证,邮箱验证，手机号码验证,身份证号码验证
 * @param formid
 */
function check(formid) {
    var formobj = document.getElementById(formid);
    var requireelems = formobj.getElementsByClassName("required");
    //进行表单的必需元素循环判断
    if (requireelems.length > 0) {

        for (i = 0; i < requireelems.length; i++) {

            if (!requireelems[i].value) {
                console.log("必填字段不能为空");
                return false;
            }
        }

    }

    //邮箱验证
    var mailelems = formobj.getElementsByClassName("email");
    if (mailelems.length > 0) {

        var preg = /^([0-9a-zA-Z_\.\-])+\@(([0-9a-zA-Z\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        for (j = 0; j < mailelems.length; j++) {
            if (!preg.test(mailelems[j].value)) {
                console.log("邮箱格式错误");
                return false;
            }

        }
    }

    //手机号码段，第二位数为  3,4,5,7,8
    var mobelems = formobj.getElementsByClassName("mob");
    if (mobelems.length > 0) {

        var mobpreg = /^1+([3|4|5|7|8]{1})+([0-9]{9})$/;

        for (k = 0; k < mobelems.length; k++) {

            if (!mobpreg.test(mobelems[k].value)) {
                console.log("手机号码格式有误");
                return false;
            }

        }
    }

    //身份证号码验证
    var idcardelems = formobj.getElementsByClassName("idcard");
    if (idcardelems.length > 0) {
        for (l = 0; l < idcardelems.length; l++) {

            //首先判断身份证的长度

            if(idcardelems[l].value.length!=18){
                console.log("身份证长度有误");
                console.log("length");
                return false;
            }

            //前面6位数字
            var areacode = idcardelems[l].value.substring(0, 6);
            var numpreg = /^([1-9]{1})+([0-9]{5})$/;
            if (!numpreg.test(areacode)) {
                console.log("身份证地区代码有误");
                console.log("area");
                return false;
            }

            //年份为19或者20
            var yearcode = idcardelems[l].value.substring(6,10);
            var year = new Date().getFullYear();
            if (yearcode < 1900 || yearcode > year){
                console.log("身份证年份有误");
                console.log("year");
                return false;
            }

            var moncode = idcardelems[l].value.substring(10, 12);
            if (moncode < 1 || moncode > 12){
                console.log("身份证月份有误");
                console.log("month");
                return false;
            }

            var daycode = idcardelems[l].value.substring(12, 14);
            if (moncode < 1 || moncode > 31){
                console.log("身份证日期有误");
                console.log("day");
                return false;
            }

            //顺序码为纯数字
            var seqcode = idcardelems[l].value.substring(14, 17);
            var seqpreg = /^([1-9]{3})$/;
            if (!seqpreg.test(seqcode)) {
                console.log("身份证顺序码有误");
                console.log("sequence");
                return false;
            }

            //最后进行校验码的判断
            var verycode = idcardelems[l].value.substring(17, 18);
            var veryreg = /^([0-9X]{1})$/;
            if (!veryreg.test(verycode)) {
                console.log("身份证校验码有误");
                console.log("verycode");
                return false;
            }

            var idcard = idcardelems[l].value;

            var cardreg = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
            var veryreg = [1,0,"X",9,8,7,6,5,4,3,2];
            var value = 0;


            //最后的校验码进行公式验证
            for(m=0;m<17;m++){

                value = value+(idcard[m]*cardreg[m]);
            }
            console.log(value);
            var verycode1 = veryreg[value%11];
            if(verycode1 != verycode){
                console.log("身份证校验码有误");
                console.log("not match");
                return false;
            }

            console.log("true");

        }
    }

}

//数字验证 （只能输入数字）
function isNum () {
    var k = event.keyCode;   //48-57是大键盘的数字键，96-105是小键盘的数字键，8是退格符←
    if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k== 8)){
        return true;
    } else {
        return false;
    }
}

//英文验证(只能输入英文)

function isEn(){
    var k = event.keyCode;   //a-z的ascii为65-90，大小写一致，8是退格符←
    if ((k <= 90 && k >= 65) ||  (k== 8)){
        return true;
    } else {
        return false;
    }
}

/**
 * 进行string类型数据的截取
 * @param str
 * @param len
 * @returns string
 */
function substr(str,len){
    var arr = str.split("");
    var string = "";
    for(var i=0;i<len;i++){
	if(arr[i])
             string = string+arr[i];
        else
	     break;
    }
    return string;
}

//通过url得到相应的参数
function geturlparam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}


//将数组进行个数分组
function split(arr,num){
    var returnarr = [];
    var index = 0;
    while(index<arr.length){
        returnarr.push(arr.slice(index,index+=parseInt(num)));
    }
    return returnarr;
}







