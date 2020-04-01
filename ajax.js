jQuery(function ($) {

	//Promise polyfill
	//var RSVP = require('rsvp');	//Using the RSVP library for Promise functions in IE11: https://github.com/tildeio/rsvp.js/ and https://developers.google.com/web/fundamentals/primers/promises

	//Globals
	var increase_amount = false;


	// JS
	window.Counter = {

        /**
         * init - Runs first
         *
         */
		init: function () {

			this.cookie = script_localise.cookie_name;							//The name of the cookie to be set/checked
			this.cookie_duration = parseInt(script_localise.cookie_duration);	//The duration of the cookie

			this.content_wrapper = jQuery("#" + script_localise.content_wrapper);
			this.content_messages = jQuery("#" + script_localise.content_messages);


			/* Disable standard form submissions on form submit button */
			this.content_wrapper.find('form').submit(function (event) {
				event.preventDefault();
			});


			/* Debugging */
			Cookies.remove(this.cookie);


			/* Run functions dependant on Cookie */
			cookie = Cookies.get(this.cookie);

			//If no cookie is set, continue displaying the interactive elements
			if (typeof cookie === 'undefined') {

				//Every 5 seconds, execute 'ajax_counter_current' function
				window.setInterval(function () {
					Counter.ajax_counter_current();
				}, 5000);

				//Run once
				Counter.form_submission();


			//Else, cookie is set. Display message stating no form submissions can be made
			} else {

				//Set error message
				Counter.status_message('alert-error', 'You have already submitted the form.', this.content_messages);

				//Hide the content wrapper
				this.content_wrapper.hide();

			}

		},



		/* AJAX functions ---------------------------------------------------- */

		/**
         * ajax_counter_increase
		 * Increase the counter via AJAX
         * =====================================================================
         */
		ajax_counter_increase: function (increase_value) {

			/* Create Variables */
			var increase_value = increase_value;

			if (increase_value < 1) {
				increase_value = false;
			}

			/* Run AJAX via Promise - https://www.taniarascia.com/how-to-promisify-an-ajax-call/ */
			return new RSVP.Promise(function (resolve, reject) {
				jQuery.ajax({
					type: "POST",
					async: true,
					url: script_localise.ajaxurl,			//URL from functions.php
					data: {
						action: script_localise.action_counter_increase,		//Action name
						increase_value: increase_value,
						nonce: script_localise.nonce
					},

					//On success
					success: function (data) {

						//Set data to repsonse variable
						response = data;

						resolve(data)
						//resolve(data.data['value'])

						//console.log(data.data['value']);
						//return data.data['value'];
						console.log("done");
					},

					//On error
					error: function (xhr, status) {
						//console.log("'ajax_counter_increase' error.");
						reject("'ajax_counter_increase' error.")
					},

					//On completion of AJAX call
					complete: function (xhr, status) {
						//console.log("'ajax_counter_increase' complete.");
					}
				});
			});

		},



		/**
         * ajax_counter_current
		 * Retrieve the current value of the counter via AJAX
         * =====================================================================
         */
		ajax_counter_current: function () {

			/* Run AJAX */
			jQuery.ajax({
				type: "POST",
				url: script_localise.ajaxurl,						//URL from functions.php
				data: {
					action: script_localise.action_counter_current,					//Action name
					nonce: script_localise.nonce
				},

				//On success
				success: function (data) {
					Counter.callback_refresh_counter_current_value(data);			//Run the update function to display current up-to-date value in HTML
				},

				//On error
				error: function (xhr, status) {
					console.log("'ajax_counter_current' error.");
				},

				//On completion of AJAX call
				complete: function (xhr, status) {
					//console.log("'ajax_counter_current' completed.");
				}
			});

		},



		/* Callbacks ---------------------------------------------------- */

		/**
         * callback_refresh_counter_current_value
		 * Retrieve the current counter value and update HTML
         * =====================================================================
         */
		callback_refresh_counter_current_value: function (response) {

			//If success
			if (response.success === true) {
				//Update the HTML content of Div ID '#counter'
				$('#counter span').html(response.data['value']);

			//Else, failure
			} else if (response.success === false) {
				//console.log("failure");
			}

		},



		/* Page functions ---------------------------------------------------- */

		/**
		 * statusMessages
		 * The status messages to be displayed, either success or error
		 * 		type = either 'success' or 'error'
		 * 		text = the text to display
		 * 		element = in which element to display
		 * =====================================================================
		 */
		status_message: function (type, text, element) {
			var element = jQuery(element);

			element.html('<div class="alert ' + type + '">' + text + '</div>');
		},



		/**
         * form_submission
		 * Submission of the form
         * =====================================================================
         */
		form_submission: function () {

			/* Create Variables */
			var cookie = this.cookie;	//Cookie to be set
			var cookie_duration = this.cookie_duration		//Cookie duration
			var content_wrapper = this.content_wrapper;		//The content wrapper
			var content_messages = this.content_messages;	//The content message


			/* On submission of form */
			content_wrapper.find('form').submit(function (event) {

				/* Reset the amount to increase */
				increase_amount = 0;


				/* Run AJAX call to increase the counter */
				Counter.ajax_counter_increase(increase_amount).then(function (value) {

					//If success
					if (response.success === true) {
						//console.log("'ajax_counter_increase' complete.");

						/* Get the lastest counter value - refresh */
						Counter.ajax_counter_current();

						/* Set cookie for completion of form */
						Cookies.set(cookie, cookie, { expires: cookie_duration });

						/* Set success message */
						Counter.status_message('alert-success', 'Thankyou for submitting.' + answer_feedback, content_messages);

						content_wrapper.find('form').trigger("reset");


					//Else, failure
					} else if (response.success === false) {
						//console.log("'ajax_counter_increase' error.");

						/* Set error message */
						Counter.status_message('alert-error', 'Unable to submit.', content_messages);
					}

				});

			});

		},

	}


	$(function () {
		Counter.init();	//Run init
	});

});
