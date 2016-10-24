/**
 * Tracking Events for signages.co
 *
 * Lang Codes for reference:-
 *  English = en = 1
 *  Hindi = hi = 2
 *  Gujrati = gu = 3
 */


var signages = document.querySelectorAll('.listing');

Array.prototype.forEach.call(signages, function(signage){

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

	downloadBtn.onclick = function(){
		ga('send', 'event', 'Signage', 'Download', title, langCode);
	};

});


var makersModal = document.getElementById("makersModalTrigger");
makersModal.onclick = function () {
	ga('send', 'event', 'About', 'click', 'Makers Modal');
};

//Filter grids
$('.filters .btn').click(function() {
	var filter = $(this).data("group");
	filterList(filter);
	console.log (filter);
	$(this).addClass('active').parent().siblings().children().removeClass('active');
	function filterList(value) {
		var list = $(".listing");
		$(list).fadeOut("fast");
		if (value == "all") {
		$(".signages-list").find("li article").each(function (i) {
			$(this).fadeIn("fast").show();
		});
		} else {
		//Notice this *=" <- This means that if the data-category contains multiple options, it will find them
		//Ex: data-category="Cat1, Cat2"
		$(".signages-list").find("li article[data-lang*=" + value + "]").each(function (i) {
			$(this).fadeIn("fast");
		});
		}
	}
});

