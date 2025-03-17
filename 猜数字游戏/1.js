var randNum = (Math.random()*100)+1;
var mes1 = "";
function guess(){
    var inputNum = parseInt(document.getElementById("inputNum").value);
    if(inputNum>100||inputNum<1){
        mes1="不在数字范围内"
        document.getElementById("mes1").innerHTML = mes1;
    }
    else if(inputNum>randNum)
        mes1 = "太大了";
    else if(inputNum<randNum)
        mes1 = "太小了";
    else
        mes1 = "恭喜你！猜对了！";
    document.getElementById("mes1").innerHTML = mes1;
}
function newGame(){
    randNum = (Math.random()*100)+1;
}