'use strict'

class Guard {

  * handle (request, response, next) {

		const isLoggedIn = yield request.auth.check()

		if (!isLoggedIn) {
		  response.redirect('/login')
		}

    yield next
  }

}

module.exports = Guard