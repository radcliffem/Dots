var width=10;
var height=10;
var radius = 3;
var boxes = [];

document.getElementById("startButton").onclick = function(){
	width = parseInt(document.getElementById("width").value);
	height = parseInt(document.getElementById("height").value);
	for(e of document.getElementsByClassName("intro")){
		e.style.display="none";
	}
	drawDots(width,height);
	makeBoxes(width, height);
}

function drawDots(width, height){
	var canvas = document.getElementById("playCanvas")
	var ctx = canvas.getContext("2d");
	var horizontal_space = (canvas.width - 2*radius*width)/(width+1)
	var vertical_space = (canvas.height-2*radius*height)/(height+1)
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
			box.x = i;
			box.y = j;
			box.left=false;
			box.right=false;
			box.top=false;
			box.bottom=false;
			box.value = 1;
			boxes.push(box);
		}
	}
}


document.addEventListener("click", makeLine);

function makeLine(){
	
	var canvas = document.getElementById("playCanvas")
	var ctx = canvas.getContext("2d");
	var horizontal_space = (canvas.width - 6*width)/(width+1)
	var vertical_space = (canvas.height-6*height)/(height+1)
	const rect = canvas.getBoundingClientRect();
	
	xpos = event.clientX-rect.left;
	ypos = event.clientY-rect.top;
	
	
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


function makeHorizontal(i, j){
	var canvas = document.getElementById("playCanvas")
	var ctx = canvas.getContext("2d");
	var horizontal_space = (canvas.width - 6*width)/(width+1)
	var vertical_space = (canvas.height-6*height)/(height+1)
	
	ctx.beginPath();
	ctx.moveTo((i+1)*(horizontal_space+2*radius)-radius,(j+1)*(vertical_space+2*radius)-radius);
	ctx.lineTo((i+2)*(horizontal_space+2*radius)-radius,(j+1)*(vertical_space+2*radius)-radius);
	ctx.stroke();
}



function makeVertical(i, j){
	var canvas = document.getElementById("playCanvas")
	var ctx = canvas.getContext("2d");
	var horizontal_space = (canvas.width - 6*width)/(width+1)
	var vertical_space = (canvas.height-6*height)/(height+1)
	
	ctx.beginPath();
	ctx.moveTo((i+1)*(horizontal_space+2*radius)-radius,(j+1)*(vertical_space+2*radius)-radius);
	ctx.lineTo((i+1)*(horizontal_space+2*radius)-radius,(j+2)*(vertical_space+2*radius)-radius);
	ctx.stroke();
	
}
