'use strict'

const Validator = use('Validator');
const Signage = use('App/Model/Signage');
const Helpers = use('Helpers');

class SignagesController {

	* show(request, response) {
		const signages = yield Signage.all()
		yield response.sendView('backdoor.signages', { signages: signages.toJSON() });
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


	* showEdit(request, response) {
		const id = request.param('id');
		const signage = yield Signage.find(id)
		yield response.sendView('backdoor.signages.edit', { signage: signage.toJSON() });
	}


	* doEdit(request, response) {

		const id = request.param('id');

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

	 const thumbExists = (thumb.size > 0) ? true : false;
	 const pdfExists = (pdf.size > 0) ? true : false;

	 const thumbImgPath = null;
	 const pdfFilePath = null;

	 if (thumbExists) {
			const thumbName = `${new Date().getTime()}.${thumb.extension()}`
			const thumbPath = `/images/thumbs/${thumbName}`;
			thumbImgPath = thumbPath;
			yield thumb.move(Helpers.publicPath()+'/images/thumbs', thumbName);
			if (!thumb.moved() ) {
				yield request
	      .withAll() 
	      .andWith({errors: [{"field":"thumbnail","validation":"match","message":thumb.errors()}]})
	      .flash()
	    	return response.redirect('back')
			}
	 }

	 if (pdfExists) {
			const pdfName = `${new Date().getTime()}.${pdf.extension()}`
			const pdfPath = Helpers.storagePath('signages') + '/' + pdfName;
			pdfFilePath = pdfPath;
			yield pdf.move(Helpers.storagePath('signages'), pdfName);
			if (!pdf.moved() ) {
				yield request
			  .withAll() 
			  .andWith({errors: [{"field":"pdf","validation":"match","message":pdf.errors()}]})
			  .flash()
				return response.redirect('back')
			}
	 }

		// Validation passed, create the signage.
    const signage = yield Signage.find(id);

    signage.title = request.input('title');
    signage.description = request.input('description');
    signage.creator = request.input('creator');
    signage.language = request.input('language');
    signage.thumb_url = thumbImgPath || signage.thumb_url;
    signage.pdf_url = pdfFilePath || signage.pdf_url;

    yield signage.save();

		return response.redirect('/backdoor/signages')

	}


	* doDelete(request, response) {
		const id = request.param('id');
		const signage = yield Signage.find(id)
		yield signage.delete()
		return response.redirect('/backdoor/signages')
	}

}

module.exports = SignagesController
