'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('home')

Route.on('/submit').render('submit')

// Authentication Routes
Route.get('/login', 'AuthController.showLogin')
Route.post('/login', 'AuthController.doLogin')

Route.get('/register', 'AuthController.showSignup')
Route.post('/register', 'AuthController.doSignup')



Route.group('GauredRoutes', () => {

	Route.get('/logout', 'AuthController.doLogout')

	// Backdoor Routes
	Route.get('/backdoor', 'PagesController.backdoor')

	Route.get('/signages', 'SignagesController.show')

}).middleware('guard')



