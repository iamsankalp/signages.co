var signages = document.querySelectorAll('.listing');

Array.prototype.forEach.call(signages, function(signage, i){

	var downloadBtn = signage.querySelectorAll('.listing-download')[0];

	var title = signage.querySelectorAll('.listing-title')[0].innerHTML;
	var lang = signage.dataset.lang;

	var langCode = null;	

	switch(lang) {
    case "en":
        langCode = 1;
        break;
    case "hi":
        langCode = 2;
        break;
    case "gu":
        langCode = 3;
        break;
    default:
        langCode = 1;
	}

	downloadBtn.onclick = function(event){
		event.preventDefault();
		ga('send', 'event', 'Signage', 'Download', title, langCode);
	};
	
});


var makersModal = document.getElementById("makersModal");
makersModal.onclick = function (event) {
	ga('send', 'event', 'About', 'click', 'Makers Modal');
}
