var bgmStart = "false";

$(function () {
    setTimeout(function () {
        $('.step1').animate({
            opacity:"1",
            top:"15%"
        },2000);
    },6000);
})

document.addEventListener("click", function() {
    if (bgmStart == "false") {
        var bgm = new Audio('audio/2.mp3');
        bgmStart = "true";
        bgm.play();
    }
    
    // 隐藏戳我
    document.getElementById("step1").style.display = "none";
    document.getElementById("photo_box").style.display = "none";

    setTimeout(function () {
        $('.name').animate({
            opacity:"1",
            top:"7%"
        },2000);
        $('.content').animate({
            opacity:"1",
            top:"15%"
        },2000);

    },1000);
    setTimeout(function () {
        $('.happy').animate({
            opacity:"1",
            top:"15%"
        },2000);

    },1000);
});
