'use strict'

const Validator = use('Validator');
const Signage = use('App/Model/Signage');
const Helpers = use('Helpers');

class SignagesController {

	* show(request, response) {
		yield response.sendView('backdoor.signages');
	}


	* showCreate(request, response) {
		yield response.sendView('backdoor.signages.add');
	}


	* doCreate(request, response) {

		const data = request.all();

    const rules = {
      title: 'required',
      description: 'required',
      creator: 'required',
      language: 'required'
    }

		const messages = {
		  'email': 'Why you no give title?',
		  'description': 'Need the description.',
		  'creator': 'Need the creator for atribution',
		  'language': 'Set language',
		}

		const validation = yield Validator.validate(data, rules);

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
    }

		const thumb = request.file('thumbnail', {
      maxSize: '5mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
		})

		const pdf = request.file('pdf', {
      maxSize: '5mb',
      allowedExtensions: ['pdf']
		})

		const thumbName = `${new Date().getTime()}.${thumb.extension()}`
		const pdfName = `${new Date().getTime()}.${pdf.extension()}`

		const thumbPath = `/images/thumbs/${thumbName}`;
		const pdfPath = Helpers.storagePath('signages') + '/' + pdfName;

		yield thumb.move(Helpers.publicPath()+'/images/thumbs', thumbName);
		yield pdf.move(Helpers.storagePath('signages'), pdfName);

		if (!thumb.moved() ) {
			yield request
      .withAll() 
      .andWith({errors: [{"field":"thumbnail","validation":"match","message":thumb.errors()}]})
      .flash()
    	return response.redirect('back')
		}

		if (!pdf.moved() ) {
			yield request
      .withAll() 
      .andWith({errors: [{"field":"pdf","validation":"match","message":pdf.errors()}]})
      .flash()
    	return response.redirect('back')
		}

		data['thumb'] = thumbPath;
		data['pdf'] = pdfPath;


		// Validation passed, create the signage.
    const signage = new Signage();

    signage.title = request.input('title');
    signage.description = request.input('description');
    signage.creator = request.input('creator');
    signage.language = request.input('language');
    signage.thumb_url = thumbPath;
    signage.pdf_url = pdfPath;

    yield signage.save();

		return response.redirect('/backdoor/signages')
	}

}

module.exports = SignagesController
