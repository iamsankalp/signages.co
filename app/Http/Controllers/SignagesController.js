'use strict'

class SignagesController {

	* show(request, response) {
		yield response.sendView('backdoor.signages');
	}

	* create(request, response) {
		yield response.sendView('backdoor.signages.add');
	}

}

module.exports = SignagesController
