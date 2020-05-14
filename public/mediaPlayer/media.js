var theme = [];

for (var i = 97; i <= 102; i++) {
	var keyCode = {
		a: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/bubbles.mp3'],
				preload: true,
				html5: true
			})
		},
		b: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/clay.mp3'],
				preload: true,
				html5: true
			})
		},
		c: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/confetti.mp3'],
				preload: true,
				html5: true
			})
		},
		d: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/corona.mp3'],
				preload: true,
				html5: true
			})
		},
		e: {
			sound: new Howl({
				src: [
					'/post/show/audio/' +
						String.fromCharCode(i).toUpperCase() +
						'/dotted-spiral.mp3'
				],
				preload: true,
				html5: true
			})
		},
		f: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/flash-1.mp3'],
				preload: true,
				html5: true
			})
		},
		g: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/flash-2.mp3'],
				preload: true,
				html5: true
			})
		},
		h: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/flash-3.mp3'],
				preload: true,
				html5: true
			})
		},
		i: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/glimmer.mp3'],
				preload: true,
				html5: true
			})
		},
		j: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/moon.mp3'],
				preload: true,
				html5: true
			})
		},
		k: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/pinwheel.mp3'],
				preload: true,
				html5: true
			})
		},
		l: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/piston-1.mp3'],
				preload: true,
				html5: true
			})
		},
		m: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/piston-2.mp3'],
				preload: true,
				html5: true
			})
		},
		n: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/piston-3.mp3'],
				preload: true,
				html5: true
			})
		},
		o: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/prism-1.mp3'],
				preload: true,
				html5: true
			})
		},
		p: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/prism-2.mp3'],
				preload: true,
				html5: true
			})
		},
		q: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/prism-3.mp3'],
				preload: true,
				html5: true
			})
		},
		r: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/splits.mp3'],
				preload: true,
				html5: true
			})
		},
		s: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/squiggle.mp3'],
				preload: true,
				html5: true
			})
		},
		t: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/strike.mp3'],
				preload: true,
				html5: true
			})
		},
		u: {
			sound: new Howl({
				src: [
					'/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/suspension.mp3'
				],
				preload: true,
				html5: true
			})
		},
		v: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/timer.mp3'],
				preload: true,
				html5: true
			})
		},
		w: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/ufo.mp3'],
				preload: true,
				html5: true
			})
		},
		x: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/veil.mp3'],
				preload: true,
				html5: true
			})
		},
		y: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/wipe.mp3'],
				preload: true,
				html5: true
			})
		},
		z: {
			sound: new Howl({
				src: ['/post/show/audio/' + String.fromCharCode(i).toUpperCase() + '/zig-zag.mp3'],
				preload: true,
				html5: true
			})
		}
	};
	theme.push(keyCode);
}

var Timer = function(callback, delay) {
	var timerId,
		start,
		remaining = delay;

	this.pause = function() {
		window.clearTimeout(timerId);
		remaining -= Date.now() - start;
	};

	this.resume = function() {
		start = Date.now();
		window.clearTimeout(timerId);
		timerId = window.setTimeout(callback, remaining);
	};

	this.resume();
};

function canvasControlling_PostRoute(song, tool, alert, onPlaying, view, theme) {
	var circles = [],
		sounds = [],
		keys = song.sounds,
		effectsCores = song.effects,
		themeCores = song.theme,
		timeCores = song.time,
		pausePos = 0;

	tool.onKeyDown = async function(event) {
		if (event.key == 'enter') {
			alert.fadeToggle('slow');
			onPlaying = !onPlaying;
			(function playSounds(i) {
				if (onPlaying) {
					setTimeout(function() {
						playSound(i);
						i++; 
						pausePos++;
						if (i == timeCores.length - 1) {
							setTimeout(() => {
								alert.fadeToggle('1000');
								onPlaying = !onPlaying;
								pausePos = 0;
							}, 2000);
						}
						if (i < timeCores.length - 1) {
							playSounds(i);
						}
					}, timeCores[i + 1] - timeCores[i]);
				}
			})(pausePos);
		}
	};

	view.onFrame = function(event) {
		for (var i = 0; i < circles.length; i++) {
			if (onPlaying) {
				circles[i].scale(0.95);
				circles[i].fillColor.hue += 1;
				if (circles[i].area < 1) {
					circles[i].remove();
					circles.splice(i, 1);
				}
			}
		}
	};

	function playSound(i) {
		if (effectsCores[i] != undefined) {
			const newCircle = new Path.Circle({
				center: new Point(effectsCores[i].center[1], effectsCores[i].center[2]),
				radius: effectsCores[i].radius,
				fillColor: effectsCores[i].fillColor,
				blendMode: effectsCores[i].blendMode
			});
			circles.push(newCircle);
			theme[themeCores[i]][keys[i]].sound.play();
		}
	}
}

function canvasControlling_DiscoveryRoute(){
		
}

export default theme;
export { Timer, canvasControlling_PostRoute };