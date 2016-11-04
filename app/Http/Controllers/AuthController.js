'use strict'

const Validator = use('Validator');
const User = use('App/Model/User');
const Hash = use('Hash');

class AuthController {

	* showLogin(request, response) {
		yield response.sendView('auth.login');
	}


	* showSignup(request, response) {
		yield response.sendView('auth.register');
	}


	* doLogin(request, response) {

		const userData = request.only('email', 'password')

    const rules = {
      email: 'required|email',
      password: 'required',
    }

		const messages = {
		  'email.required': 'Why you no give email?',
		  'password.min': 'Password should be atleast 6 characters long.',
		  'password.required': 'Give password maccha!'
		}

    const validation = yield Validator.validate(userData, rules, messages);

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      return response.redirect('back')
    }


	    const email = request.input('email')
	    const password = request.input('password');
	    

			try {
			  yield request.auth.attempt(email, password)
			} catch (e) {
				yield request
        .withAll() 
        .andWith({errors: [{"field":"password","validation":"match","message":"Incorrect credentials"}]})
        .flash()
      	return response.redirect('back')
			}

			return response.redirect('/')


	}


* doSignup(request, response) {

	const userData = request.only('email', 'password')

  const rules = {
    email: 'required|email|unique:users',
    password: 'required|min:6|max:30',
  }

	const messages = {
	  'email.required': 'Why you no give email?',
	  'password.min': 'Password should be atleast 6 characters long.',
	  'password.required': 'Give password maccha!'
	}

  const validation = yield Validator.validate(userData, rules, messages);

  if (validation.fails()) {
    yield request
      .withAll()
      .andWith({errors: validation.messages()})
      .flash()
    response.redirect('back')
  }

  // Validation passed, create the user.
  const user = new User();

  user.email = request.input('email');
  user.password = yield Hash.make(request.input('password'));

  yield user.save();
  yield request.auth.login(user);

  response.redirect('/');
}


	* doLogout(request, response) {
		yield request.auth.logout();
		response.redirect('/');
	}

}

module.exports = AuthController
