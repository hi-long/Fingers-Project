import {validateNickname} from '/mediaPlayer/validation.js';

$(document).scroll(function () {
	var $nav = $(".navbar");
	$nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
});

$("#back-btn").attr("href", "/" + $("span").text());
$("#forward-btn").attr("href", "/");

// ----------------- //
// CHANGE BETWEEN PROFILE AND PASSWORD SETTING
// ----------------- //
var profile = $(".profile"),
	password = $(".password");

$(".profile-enter").click(() => {
	password.fadeOut('400', () => {
		profile.fadeIn("400");
	});
})

$(".password-enter").click(() =>{
	profile.fadeOut('400', () => {
		password.fadeIn("400");
		password.css("display", "flex");
	});
})

// ----------------- //
// IMAGE DIV AND TOOLS
// ----------------- //
var imageDiv = $("#image-preview"), 
	tools = $("#tools"),
	rotate = $("#rotate"),
	expand = $("#expand"),
	compress = $("#compress"),
	rotated = 0;

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

// ----------------- //
// CHECKING EXIST NICKNAME
// ----------------- //
const nicknameInput = $("#nickname");
console.log(validateNickname(nicknameInput));

// ----------------- //
// CHANGE PASSWORD
// ----------------- //
const currentPasswordInput = $("#currentPassword"),
	  newPasswordInput = $("#newPassword"),
	  confirmationInput = $("#newPasswordConfirmation"),
	  confirmationMessage = $("#confirmation-message"),
	  submitBtn = $("#password-submit");

if(newPassword == "" || currentPasswordInput.val() == ""){
	submitBtn.attr('disabled', true);
}

confirmationInput.on("input", () => {
	let newPassword = newPasswordInput.val(),
		confirmation = confirmationInput.val();
	if(confirmation != newPassword ){
		confirmationMessage.html("Not match !").css("color", "darkcyan");
		submitBtn.attr('disabled', true);
	} 
	if(confirmation == newPassword){
		confirmationMessage.html("");
		submitBtn.attr('disabled', false);
	}
})
