import $ from 'jquery';
import jQuery from 'jquery';

window.$ = $;
window.jQuery = jQuery;

console.log('Admin.js');

$('.js-delete-signage').on('click', function(event) {
	event.preventDefault();
	$('#deleteSignageForm').attr('action', $(this).data('delete-link'));
	$('#deleteSignageModal').modal()
})