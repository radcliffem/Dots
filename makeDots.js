var width=10;
var height=10;
var radius = 3;
var boxes = [];
const colors = ["blue", "red"]
var scores = [0,0];
var player = 0;
var classic=false;
var strategy=true;



var canvas = document.getElementById("playCanvas");
var ctx = canvas.getContext("2d");
var horizontal_space = (canvas.width - 6*width)/(width+1);
var vertical_space = (canvas.height-6*height)/(height+1);

document.getElementById("classic_button").onclick=function(){
	initialize(true, false);
}

document.getElementById("classic_strategy_button").onclick=function(){
	initialize(true, true);
}


document.getElementById("strategy_button").onclick=function(){
	initialize(false, true);
}


function initialize(c, s){
	classic=c;
	strategy=s;
	for(e of document.getElementsByClassName("intro")){
		e.style.display="none";
	}
	for(e of document.getElementsByClassName("size")){
		e.style.display="block"
	}
}

document.getElementById("startButton").onclick = function(){
	width = parseInt(document.getElementById("width").value);
	height = parseInt(document.getElementById("height").value);
	
	horizontal_space = (canvas.width - 6*width)/(width+1);
	vertical_space = (canvas.height-6*height)/(height+1);
	
	for(e of document.getElementsByClassName("size")){
		e.style.display="none";
	}
	
	for(e of document.getElementsByClassName("playing")){
		e.style.display = "block";
	}
	
	updateScores();
	drawDots(width,height);
	boxes = [...Array(width-1)].map(e => Array(height-1));
	makeBoxes(width, height);
}

function drawDots(width, height){

	for(var i=0;i<width;i++){
		for(var j=0;j<height;j++){
			var circle = {};
			circle.rad=radius;
			circle.x = (i+1)*(horizontal_space+2*circle.rad)-circle.rad;
			circle.y = (j+1)*(vertical_space+2*circle.rad)-circle.rad;
			ctx.beginPath();
			ctx.arc(circle.x, circle.y,circle.rad,0,2*Math.PI);
			ctx.fillStyle = "black";
			ctx.fill();
			ctx.closePath();
		}
	}
}


function makeBoxes(width, height){
	for(var i=0;i<width-1;i++){
		for(var j=0;j<height-1;j++){
			var box = {};
			box.left=false;
			box.right=false;
			box.top=false;
			box.bottom=false;
			box.value = 1;
			
			if(strategy){
				newVal = Math.random();
				if(newVal<0.1){
					box.value = -1;
					ctx.fillText("-1", (i+1.5)*(horizontal_space+2*radius)-2*radius, (j+1.5)*(vertical_space+2*radius))
				}else if(newVal>0.9){
					box.value = 2;
					ctx.fillText("2", (i+1.5)*(horizontal_space+2*radius)-2*radius, (j+1.5)*(vertical_space+2*radius))
				}
			}
		
		boxes[i][j]=box;
		
		}
	}
}


document.addEventListener("click", makeLine);



function makeLine(){

	const rect = canvas.getBoundingClientRect();
	
	xpos = event.clientX-rect.left;
	ypos = event.clientY-rect.top;
	
	if(ypos>0){
		
		var line_x = horizontal_space+radius;
		var i=0;
		var j=0;

		while(line_x-xpos<-horizontal_space){
			line_x = line_x+horizontal_space+2*radius;
			i=i+1;
		}

		var line_y = vertical_space+radius;
		while(line_y-ypos<-vertical_space){
			line_y = line_y+vertical_space+2*radius;
			j=j+1;
		}


		var left_dist = xpos - line_x;
		var right_dist = line_x+horizontal_space+2*radius - xpos;
		var top_dist = ypos - line_y;
		var bottom_dist = line_y+vertical_space+2*radius - ypos;

		var smallest = Math.min(left_dist, right_dist, top_dist, bottom_dist);

		if(smallest == left_dist){
			makeVertical(i, j);
		}else if(smallest == right_dist){
			makeVertical(i+1, j)
		}else if(smallest == top_dist){
			makeHorizontal(i, j);
		}else{
			makeHorizontal(i, j+1);
		}
	}

}


function makeHorizontal(i, j){
	var test = false;
	if(j!=height-1){
		test = boxes[i][j].top;
	}else{
		test = boxes[i][j-1].bottom;
	}

	if(!test){
		ctx.beginPath();
		ctx.moveTo((i+1)*(horizontal_space+2*radius)-radius,(j+1)*(vertical_space+2*radius)-radius);
		ctx.lineTo((i+2)*(horizontal_space+2*radius)-radius,(j+1)*(vertical_space+2*radius)-radius);
		ctx.stroke();
		
		var changeTurn = true;
		
		if(j!=height-1){
			if(!changeTop(i,j)){
				changeTurn=false;
			};
		}
		if(j!=0){
			if(!changeBottom(i,j-1)){
				changeTurn=false;
			}			
		}
		if(changeTurn){
			player = (player+1)%2;
		}
		document.getElementById("turn").innerText = "It is "+colors[player]+"'s turn."
		
	}
}



function makeVertical(i, j){
	var test = false;
	if(i!=width-1){
		test = boxes[i][j].left;
	}else{
		test = boxes[i-1][j].right
	}
	if(!test){
		ctx.beginPath();
		ctx.moveTo((i+1)*(horizontal_space+2*radius)-radius,(j+1)*(vertical_space+2*radius)-radius);
		ctx.lineTo((i+1)*(horizontal_space+2*radius)-radius,(j+2)*(vertical_space+2*radius)-radius);
		ctx.stroke();

		var changeTurn=true;

		if(i!=width-1){
			if(!changeLeft(i,j)){
				changeTurn=false;
			}
		}
		if(i!=0){
			if(!changeRight(i-1,j)){
				changeTurn=false;
			}
		}
		if(changeTurn){
			player = (player+1)%2;
		}
		document.getElementById("turn").innerText = "It is "+colors[player]+"'s turn."
	}
	
}

function changeTop(i,j){
	boxes[i][j].top = true;
	return checkBox(i,j);
}

function changeBottom(i,j){
	boxes[i][j].bottom =true;
	return checkBox(i,j);
}

function changeLeft(i,j){
	boxes[i][j].left=true;
	return checkBox(i,j);
}

function changeRight(i,j){
	boxes[i][j].right=true;
	return checkBox(i,j);
}

function checkBox(i,j){
	box=boxes[i][j];
	if(box.left & box.right & box.top & box.bottom){		
		ctx.save();
		ctx.translate((i+1)*(horizontal_space+2*radius)-radius, (j+1)*(vertical_space+2*radius)-radius);
		ctx.fillStyle = colors[player];
		scores[player]+=box.value;
		updateScores();
		ctx.fillRect(0,0,horizontal_space+2*radius, vertical_space+2*radius);
		ctx.restore();
		if(classic){
			return false;
		}
	}
	return true;
}


function updateScores(){
	document.getElementById("player_1_score").innerText = scores[1];
	document.getElementById("player_0_score").innerText = scores[0];
}