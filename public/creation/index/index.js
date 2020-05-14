import theme from '/mediaPlayer/media.js'
//---------------------------//
// LOADING
//---------------------------//
const loading = $("#loading"),
	  myCanvas = $("canvas"),
	  mainContainer = $(".container");

setTimeout(() => {
	loading.fadeOut("slow", () => {
		mainContainer.fadeIn("slow");
	})
}, 3000);

//---------------------------//
// INTERFACE
//---------------------------//
var hasAccount = false,
	start = false,
	stop = false;

var body = $("body"),
	intro = $("#intro"),
	replay = $("#replay-btn"),
	save = $("#save-btn"),
	discard = $("#discard-btn");

if(hasAccount == true){
	$(".navbar").hide();
}

body.on("keydown", function(event) {
	/* Act on the event */
	if(event.which == 13){
		start = !start;
		if(start == false){
			$("#utilities").addClass('ulti-btns-toggle');
		} else {
			intro.fadeOut("slow");
			$("#utilities").fadeIn("slow");
			$("#utilities").removeClass('ulti-btns-toggle');
		}
	}
});

//---------------------------//
// SAVE SONG, REPLAY SONG
//---------------------------//
var startTime = Date.now();
var keys = [],
	effectsCores = [],
	themeCores = [],
	timeCores = [];

paper.install(window);

window.onload = () => {
	paper.setup('myCanvas');
	var tool = new Tool();
	var circles = [],
		currentTheme = 0;
	var start = false,
		stop = false;
	
	const random = (min, max) => Math.floor(Math.random() * (max - min) + min);

	const randomRgb = () => 'rgb(' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ')';

	const circleFactory = () => {
		var center = new Point(random(0, 1200), random(0, 900)),
			radius = random(50, 500),
			fillColor = randomRgb(),
			blendMode = "multiply";
				
		var newCircle = new Path.Circle({
			center: center,
			radius: radius,
			fillColor: fillColor,
			blendMode : blendMode
		})
		
		effectsCores.push({
			center: center,
			radius: radius,
			fillColor: fillColor,
			blendMode : blendMode
		});
		return newCircle;
	}

	tool.onKeyDown = (event) => {
		if(event.key == "enter") {
			start = !start;
			if(start == true){
				startTime = Date.now();
			}
		}
		if (start){
			if (event.key == 'space') {
				currentTheme += 1;
				if (currentTheme == 6) {
					currentTheme = 0;
				}
			}
			if (theme[currentTheme][event.key]){
				save.parent().attr("href", "/new");
				var newCircle = circleFactory();
				circles.push(newCircle);
				keys.push(event.key);
				timeCores.push(Date.now() - startTime);
				themeCores.push(currentTheme);
				theme[currentTheme][event.key].sound.play();
			}
		}
	};
	
	view.onFrame = (event) => {
		for(var i = 0; i < circles.length; i++){
			circles[i].scale(0.95);
			circles[i].fillColor.hue += 1;
			if(circles[i].area < 1){
				circles[i].remove();
				circles.splice(i, 1);
			}
		}
	};
	
// 	REPLAY SONG
	replay.on("click", () => {
		start = true;
		intro.fadeOut("slow");
		for(var i = 0; i < timeCores.length; i ++){
			playSound(i);
		}
	})
	
	save.on("click", function(){
		postSong();
	});
	
	let playSound = ((i) => {
		var onePlay = setTimeout(() => {
			var newCircle = new Path.Circle({
				center: effectsCores[i].center,
				radius: effectsCores[i].radius,
				fillColor: effectsCores[i].fillColor,
				blendMode: effectsCores[i].blendMode
			}) 
			circles.push(newCircle);
			theme[themeCores[i]][keys[i]].sound.play();
		}, timeCores[i]);
		return onePlay;
	})
	
	let postSong = (() => {
		return axios.post("/new/song", 
			{
				sounds: keys,
				theme: themeCores,
				effects: effectsCores,
				time: timeCores
			}) .then(res => {
				
			}), (error) => {
				console.log(error);
			}
	})
};

//---------------------------//
// DISCARD SONG
//---------------------------//
discard.on("click", () => {
	save.parent().attr("href", "/");
	keys.length = 0;
	effectsCores.length = 0;
	themeCores.length = 0;
	timeCores.length = 0;
})