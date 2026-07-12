let time = 15

const timer = document.getElementById("timer");

if(timer){

setInterval(function(){

let minutes=Math.floor(time/60);

let seconds=time%60;

seconds=seconds<10?"0"+seconds:seconds;

timer.innerHTML="Time Left : "+minutes+":"+seconds;

if(time<=0){

document.forms[0].submit();

}

time--;

},1000);

}

document.querySelectorAll(".option").forEach(option=>{

option.addEventListener("click",()=>{

document.querySelectorAll(".option").forEach(o=>o.classList.remove("selected"));

option.classList.add("selected");

});

});