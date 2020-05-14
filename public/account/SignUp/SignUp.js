import {validateEmail, validatePassword, validateNickname} from '/mediaPlayer/validation.js';

var body = $("body"),
	signUpDiv = $("#sign-up"),
	signUpForm = $("#sign-up-form"),
	next = $("#next"),
	userInfoDiv = $("#user-info");

var optionsOpen = false;

// ------------------//
// USER DIV
// ------------------//

var imageDiv = $("#image-preview"), 
	tools = $("#tools"),
	rotate = $("#rotate"),
	expand = $("#expand"),
	compress = $("#compress"),
	backBtn = $("#back-btn");

var rotated = 0;

window.addEventListener('load', function() {
	document.querySelector('input[type="file"]').addEventListener('change', function() {
		console.log("Uploaded!")
		if (this.files && this.files[0]) {
         	imageDiv.css("background-image", "url(" + URL.createObjectURL(this.files[0])) + ")";
         	imageDiv.css("transform", "rotate(0deg)");
         	imageDiv.onload = imageIsLoaded;
      	}
  	});
});

imageDiv.on("mouseenter mouseleave", () => {
	tools.fadeToggle("400");
})

tools.on("mouseenter mouseleave", () => {
	$("#rotate").toggleClass('isDisplayed');	
	if(imageDiv.css("backgroundSize") == "contain"){
		$("#expand").toggleClass('isDisplayed');
	} else {
		$("#compress").toggleClass('isDisplayed');
	}
})

rotate.on("click",  () => {
	rotated += 90;
	imageDiv.css("transform", "rotate(" + rotated + "deg)");
	tools.css("transform", "rotate(" + -rotated + "deg)");
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

backBtn.on("click", () => {
	userInfoDiv.toggleClass("user-info-show");
	signUpForm.toggleClass("form-hide");
	body.css("backgroundImage", "url('https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')");
})

// ----------------- //
// VALIDATION
// ----------------- //
// EMAIL
const emailInput = $("#email");
const emailValidMessage = $("#email-valid-message"); 

// NICKNAME
const nicknameInput = $("#nickname");

// PASSWORD
const passwordInput = $("#password");
const confirmation = $("#confirmation");
const passwordValidMessage = $("#password-valid-message");
const submitBtn = $("button"); 

validateEmail(emailInput, emailValidMessage);
validateNickname(nicknameInput);
validatePassword(passwordInput, confirmation, passwordValidMessage);

// $('#email, #password, #confirmation').on("input", () => {
// 	validateEmail(emailInput, emailValidMessage);
// 	validateNickname(nicknameInput);
// 	validatePassword(passwordInput, confirmation, passwordValidMessage);
// 	console.log(emailValidMessage.text() + " " + passwordInput.text() + " " + confirmation.text());
// 	if(emailValidMessage == "" && passwordInput.text() == confirmation.text()) {
// 		submitBtn.removeAttr("disabled");
// 	} else {
// 		submitBtn.attr("disabled", true);
// 	}
// })