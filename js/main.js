/**
 * author: 橙猫猫
 * date: 2023
 */

// 随机刮刮乐图片
const specialImages = ["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9"];
const randomNum = getRandomInt(0, specialImages.length-1);
const fileName = specialImages[randomNum];
if (fileName.charAt(0) == "x") {
    // 横屏图片
    document.getElementById("card").style.height = "180px";
    document.getElementById("scratch").style.height = "180px";
} else {
    // 竖屏图片
    document.getElementById("card").style.width = "180px";
    document.getElementById("scratch").style.width = "180px";
    document.getElementById("scratch").style.marginLeft = "35px";
}

const types = ["hua1", "hua2", "hua3", "hua4", "hua5" ,"hua6", "qizai", "menglan", "abao", "chengmao"];
var count = 60;
var dist = {"hua1":6, "hua2":6, "hua3":6, "hua4":6, "hua5":6, "hua6":6, "qizai":6, "menglan":6, "abao":6, "chengmao":6};

var inc = 90;
var pinc = 90;
var pile = [
    [
        [0,0,1,1,0,0],
        [0,0,0,0,0,0],
        [0,0,1,1,0,0],
        [0,0,1,1,0,0],
        [0,1,1,1,1,0],
        [0,0,0,0,0,0]
    ],
    [
        [0,0,0,1,0,0,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0],
        [0,1,1,1,1,1,0],
        [0,0,1,1,1,0,0],
        [1,1,1,1,1,1,1],
        [0,0,0,1,0,0,0]
    ],
    [
        [0,0,1,1,0,0],
        [0,0,0,0,0,0],
        [0,0,1,1,0,0],
        [0,0,1,1,0,0],
        [0,1,0,0,1,0],
        [0,0,0,0,0,0]
    ],
    [
        [0,0,0,1,0,0,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0],
        [0,1,1,1,1,1,0],
        [0,0,1,1,1,0,0],
        [1,1,1,1,1,1,1],
        [0,0,0,1,0,0,0]
    ]
];

var bg = $("audio")[0];
var bo = $("audio")[1];
var combo = $("audio")[2];
var fail = $("audio")[3];
var win = $("audio")[4];

var startTime = null;
var endTime = null;
var bgStart = "false";
document.addEventListener("click", function() {
    if (bgStart == "false") {
        bgStart = "true";
        startTime = new Date();
        bg.play();
    }
});

// 检查日期
checkDate();

// 刮刮乐弹窗
$("#lucky").modal({
    escapeClose: false,
    clickClose: true,
    showClose: true
});

$(document).ready(function(){
    //initialize

    tilelist = initializeTiles(dist);
    bootstrapLayout(pile,tilelist);
    setGameSize();
    refreshClickability();

    $(".restart").click(function(){
        location.reload();
    });

    $("#shuffle").click(function(){
        shuffleTypes();
    });

    $("#title").click(function(){
        setOneRandomMode();
    });

    $(window).resize(function(){
        setGameSize();
    });
});


function check(type){

    //clear 3 combos
    var i = 0;
    $(".selectedcard").each(function(){
        if (type == $(this).attr("type")){
            i++;
        }

    });
    if (i >= 3){
        $(".selectedcard").each(function(){
            if ($(this).attr("type") == type){
                $(this).remove();
            }
        });
        combo.play();
    } else {
        bo.play();
    }
    
    //check game over
    if ($(".selectedcard").length >= 7){
        $("#over").modal({
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
        fail.play();
    }

    // check win
    if ($(".card").length == 0) {
        $("#win").modal({
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
        endTime = new Date();
        const timeDifference = (endTime - startTime) / 1000;
        console.log(timeDifference);
        if (timeDifference < 90) {
            document.getElementById("shortTime").innerHTML = "居然没有一首歌的时间就通关了！<br>用时" + timeDifference + "秒";
        }
        // bg.pause();
        win.play();
    }
}

function refreshClickability(){

    $(".unselectedcard").each(function(){
        if (!$(this).hasClass("clickable")) {
            $(this).addClass("clickable");
        }
        $(this).find(".shade").hide();
    });

    $(".unselectedcard").each(function(j,e1){

        //get layer
        l = $(e1).parent().attr("layer");

        for (i = 0; i < l; i++){
            //loop through compared elements on layers below
            $("div[layer="+i+"]").children().each(function(k,e2){
                x1 = $(e1).css('left').match(/\d+/)[0];
                y1 = $(e1).css('top').match(/\d+/)[0];
                x2 = $(e2).css('left').match(/\d+/)[0];
                y2 = $(e2).css('top').match(/\d+/)[0];

                if (Math.abs(x1-x2)<inc && Math.abs(y1-y2)<inc){
                   $(e2).removeClass("clickable");
                   $(e2).find(".shade").show();
                }
            }); 
        }
    });

    $(".clickable").off('click').click(function(){
        $(this).appendTo("#stack");
        $(this).removeClass("unselectedcard clickable");
        $(this).css("top", "").css("left","");
        $(this).addClass("selectedcard");

        check($(this).attr("type"));
        //refresh clickability
        refreshClickability();
    });
}

function reset(){
    
}

function bootstrapLayout(pile, tilelist){


    //count tiles
    var c = 0;

    $(".pg").empty();

    for (i=0;i<pile.length;i++)
    {
        e = $('<div layer="'+i+'"></div>');
        $(".pg").append(e);
        //Set offset value Y
        if (pile[i].length==7){
            var offsetY = 0;
        }
        else{
            var offsetY = inc/2;
        }

        for (j=0;j<pile[i].length;j++)
        {
            //Set offset value X
            if (pile[i][j].length==7){
                var offsetX = 0;
            }
            else{
                var offsetX = inc/2;
            }

            for (k=0;k<pile[i][j].length;k++)
            {
                if (pile[i][j][k] == 1){
                    c++;
                    x = offsetX + k * inc;
                    y = offsetY + j * inc;
                    e.append($('<div div class="card unselectedcard" style="top:'+y+'px;left:'+x+'px;"></div>'))
                }
                
            }
        }
    }

    if (c%3 != 0 || c != count){
        alert("Invalid count of tiles.");
    }

    //insert type to tile cards
    $(".unselectedcard").each(function(){
        $(this).attr("type",tilelist.pop());
    });

    $(".card").each(function(){
        $(this).append($('<div class="shade"></div>'))
    });


}

function shuffleTypes(){
    
    var a = new Audio('audio/refresh.mp3');
    a.play();

    var tempTiles = [];

    $(".unselectedcard").each(function(){
        tempTiles.push($(this).attr("type"));
    });

    shuffledTempTiles = shuffle(tempTiles);

    $(".unselectedcard").each(function(){
        $(this).attr("type",shuffledTempTiles.pop());
    });
}

function initializeTiles(dist){
    var tilelist = [];
    for (const [k, v] of Object.entries(dist)){
        for (i=v;i!=0;i--){
            tilelist.push(k);
            dist[k]--;
        }
    }
    shuffledTilelist = shuffle(tilelist)
    return shuffledTilelist;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  
function setGameSize() {

    var w = $(window).width();

    if (w < 720){
        inc = Math.floor(w/8);
    }
    else{
        inc = 90;
    }
    $('#vcontainer').css("width",inc*8+"px");
    $('.card').css("height",(inc-7)+'px').css("width",(inc-7)+'px').css("border-top-left-radius",Math.floor(inc/10)+'px').css("border-top-right-radius",Math.floor(inc/10)+'px').css("border-bottom-right-radius",Math.floor(inc/10)+'px').css("border-bottom-left-radius",Math.floor(inc/10)+'px');
    $('.shade').css("border-top-left-radius",Math.floor(inc/10)+'px').css("border-top-right-radius",Math.floor(inc/10)+'px').css("border-bottom-right-radius",Math.floor(inc/10)+'px').css("border-bottom-left-radius",Math.floor(inc/10)+'px');
    $('.unselectedcard').each(function(){
        l = $(this).css("left").match(/\d+/)[0];
        t = $(this).css("top").match(/\d+/)[0];
        $(this).css("left",Math.floor((l/pinc) * inc)+'px');
        $(this).css("top",Math.floor((t/pinc) * inc)+'px');
    });
    
    $('.pg').css("height",(inc*7)+'px').css("width",(inc*7)+'px');
    $('#stack').css("height",((inc+10)+'px')).css("width",((inc*7)+20)+'px');
    $('#tools').children().css("height",inc*0.8+'px').css("width",inc*0.8+'px');

    pinc = inc;
}

function playclearSound(t){
    var a = new Audio('audio/'+t+'.mp3');
    if (a != undefined ) {
        a.play();
    }
    else{
        clear.play();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
   }

function setOneRandomMode() {
    if  (gameArray.length > 1) {
        const randomInt = getRandomInt(0, gameArray.length-1);
        count = map[gameArray[randomInt]][0];
        dist = map[gameArray[randomInt]][1];
        pile = map[gameArray[randomInt]][2];
        gameArray.splice(randomInt, 1);
        $(".selectedcard").each(function(){
            $(this).remove();
        });
        tilelist = initializeTiles(dist);
        bootstrapLayout(pile,tilelist);
        setGameSize();
        refreshClickability();
        document.getElementById("pandaCount").innerHTML = "本局你发现了: <br>- 少量的花花...";
    }
}

function dateToString() {
    let today = new Date();

    // 提取年、月、日
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始计数，需要+1
    let day = String(today.getDate()).padStart(2, '0');

    // 格式化为 "yyyy.mm.dd" 的形式
    let formattedDate = `${year}.${month}.${day}`;
    console.log(formattedDate);
}

// check if date is 9.10
function checkDate() {
    let todayDate = new Date().setHours(0,0,0,0);
    let douyin100 = new Date(2023, 8, 7).setHours(0,0,0,0);
    let paramsDate = new Date(2023, 8, 10).setHours(0,0,0,0);

    let isDouyin100Day = (todayDate === douyin100);
    let isBirthday = (todayDate === paramsDate);
    if (isBirthday) {
        document.getElementById("bodyStyle").classList.add('body2');
        document.getElementById("stack").classList.add('stack2');
        console.log("今天是阿林的生日🎂");
        document.getElementById("normal").style.display = "none";
        document.getElementById("special").style.display = "block";
    } else if (isDouyin100Day) {
        document.getElementById("bodyStyle").classList.add('body1');
        document.getElementById("stack").classList.add('stack1');
        console.log("今天是抖音♪火苗持续100天");
    } else {
        document.getElementById("bodyStyle").classList.add('body2');
        document.getElementById("stack").classList.add('stack2');
        console.log("今天是普通的一天");
        dateToString();
    }
}

// 关卡1
var count_one = 204;
var dist_one = {"hua1":21, "hua2":18, "hua3": 18, "hua4": 21, "hua5": 21, "hua6": 21, "qizai":21, "menglan":18, "abao":21, "chengmao":24};
var pile_one = [
    [
        [0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0],
        [0,1,1,1,1,1,0],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,1,1,1,0,0],
        [0,0,0,0,0,0,0]
    ],
    [
        [0,0,0,1,0,0,0],
        [0,1,1,1,1,1,0],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,0,1,0,0,0]
    ],
    [
        [0,0,1,1,0,0],
        [0,1,1,1,1,0],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [0,1,1,1,1,0],
        [0,0,1,1,0,0]
    ],
    [
        [0,0,0,0,0,0],
        [0,0,1,1,0,0],
        [0,1,1,1,1,0],
        [1,1,1,1,1,1],
        [0,1,1,1,1,0],
        [0,0,1,1,0,0],
        [0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0],
        [0,1,1,0,1,1,0],
        [0,1,1,0,1,1,0],
        [0,0,1,1,1,0,0],
        [0,0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0],
        [0,1,1,1,1,0],
        [1,1,0,0,1,1],
        [1,1,0,0,1,1],
        [0,1,1,1,1,0],
        [0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,1,1,0,1,1,0],
        [1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ],
    [
        [1,0,0,0,0,0,1],
        [0,1,0,1,0,1,0],
        [0,0,1,0,1,0,0],
        [0,0,1,0,1,0,0],
        [1,0,0,1,0,0,1],
        [0,0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,0,1,0,0],
        [0,0,1,1,1,0,0],
        [1,0,0,0,0,0,1],
        [0,0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0],
        [1,0,0,0,0,1],
        [0,1,0,0,1,0],
        [0,1,0,0,1,0],
        [0,1,1,1,1,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ],
    [
        [1,0,0,0,0,0,1],
        [0,1,1,1,1,1,0],
        [0,1,1,1,1,1,0],
        [1,1,1,0,1,1,1],
        [0,0,1,0,1,0,0],
        [1,0,0,0,0,0,1]
    ],
    [
        [1,0,0,0,0,0,1],
        [0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,0,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0],
        [1,0,0,0,0,0,1]
    ]
];
// 关卡二
var count_pyramid = 138;
var dist_pyramid = {"hua1":15, "hua2":12, "hua3": 12, "hua4": 12, "hua5": 12, "hua6": 12, "qizai":15, "menglan":18, "abao":15, "chengmao":15};
var pile_pyramid= [
    [
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1]
    ],
    [
        [0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,1,1,1,1,1,0],
        [0,1,1,0,1,1,0],
        [0,1,1,1,1,1,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0],
        [0,1,1,1,1,0],
        [0,1,1,1,1,0],
        [0,1,1,1,1,0],
        [0,1,1,1,1,0],
        [0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0],
        [0,0,1,0,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,1,1,0,0],
        [0,0,1,1,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ]
];
// 关卡910
var count_910 = 27;
var dist_910 = {"hua1":3, "hua2":3, "hua3": 3, "hua4": 3, "hua5": 3, "hua6": 0, "qizai":3, "menglan":3, "abao":3, "chengmao":3};
var pile_910 = [
    [
        [1,1,1,0,0,0,0],
        [1,0,1,0,0,0,0],
        [1,1,1,0,1,0,0],
        [0,0,1,0,0,0,0],
        [1,1,1,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ],
    [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,1,0,1,1,1],
        [0,1,0,1,0,1],
        [0,1,0,1,0,1],
        [0,1,0,1,1,1]
    ]
];
// 关卡easy
var count_easy = 9;
var dist_easy = {"hua1":9};
var pile_easy = [
    [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,1,1,1,0,0,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,1,1,0],
        [0,0,0,0,0,0,0]
    ]
];


var gameArray = ["one", "pyramid", "910", "easy"];
var map = {
    "one" : [count_one, dist_one, pile_one],
    "pyramid" : [count_pyramid, dist_pyramid, pile_pyramid],
    "910" : [count_910, dist_910, pile_910],
    "easy" : [count_easy, dist_easy, pile_easy]
}

// 防止刮刮乐图片加载过快
document.getElementById("card").src = "./images/guaguale/" + fileName + ".jpg";