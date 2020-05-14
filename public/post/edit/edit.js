var imageDiv = $("#image"), 
	tools = $("#tools"),
	rotate = $("#rotate"),
	expand = $("#expand"),
	compress = $("#compress");

var rotated = 0;

window.addEventListener('load', function() {
	document.querySelector('input[type="file"]').addEventListener('change', function() {
		if (this.files && this.files[0]) {
         	imageDiv.css("background-image", "url(" + URL.createObjectURL(this.files[0])) + ")";
         	imageDiv.css("transform", "rotate(0deg)");
      	}
  	});
});

imageDiv.on("mouseenter mouseleave", () => tools.fadeToggle("400"));

tools.on("mouseenter mouseleave", () => {
	$("#rotate").toggleClass('isDisplayed');	
	if(imageDiv.css("backgroundSize") == "contain"){
		$("#expand").toggleClass('isDisplayed');
	} else {
		$("#compress").toggleClass('isDisplayed');
	}
})

rotate.on("click", () => {
	rotated += 90;
	imageDiv.css("transform", "rotate(" + rotated + "deg)");
	// tools.css("transform", "rotate(" + -rotated + "deg)");
})

expand.on("click", () => {
	imageDiv.css("backgroundSize", "cover");
	expand.toggleClass('isDisplayed');
	compress.toggleClass('isDisplayed');
})

compress.on("click", () => {
	imageDiv.css("backgroundSize", "contain");
	expand.toggleClass('isDisplayed');
	compress.toggleClass('isDisplayed');
})



