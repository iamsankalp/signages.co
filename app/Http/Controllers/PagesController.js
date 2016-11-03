'use strict'

const Signage = use('App/Model/Signage');

class PagesController {

	* backdoor(request, response) {
		yield response.sendView('backdoor.dashboard');
	}

	* home(request, response) {
		const signages = yield Signage.all()
		yield response.sendView('home', { signages: signages.toJSON() });
	}

}

module.exports = PagesController
