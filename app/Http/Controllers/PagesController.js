'use strict'

class PagesController {

	* backdoor(request, response) {
		yield response.sendView('backdoor.dashboard');
	}

}

module.exports = PagesController
