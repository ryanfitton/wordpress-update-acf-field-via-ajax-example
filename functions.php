<?php 
	/*************************
	 	This code goes the theme's functions.php file
	 *************************/

	 

	/***********************
		ACF Option Pages
	***********************/
	if( function_exists('acf_add_options_page') ) {
		//AJAX Counter options ACF Page
		acf_add_options_sub_page(array(
			'page_title'    => 'Ajax counter options',
			'menu_title'    => 'Ajax counter options',
			'parent_slug'   => 'options-general.php',
			'post_id'       => 'options_counter'          //Required to have fields for each page seperate
		));
	}



	/***********************
		Ajax Counter - Enqueue files
	***********************/
	function enqueue_ajax_form_script() {
		/*Load the script*/
		wp_enqueue_script(
			'rsvp',																	//Handle: rsvp
			get_template_directory_uri() . '/rsvp.min.js',							//Load 'rsvp.min.js'
			array( 'jquery' )														//Depends on jQuery
		);

		wp_enqueue_script(
			'ajax_counter',															//Handle: ajax_counter
			get_stylesheet_directory_uri() . '/ajax.js',							//Load 'ajax.js'
			array( 'rsvp' )															//Depends on rsvp
		);

		wp_enqueue_script(
			'jquery_cookie',														//Handle: jquery_cookie
			//'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',	//Load 'js.cookie.min.js'
			get_template_directory_uri() . '/js.cookie.min.js',
			array( 'jquery' )														//Depends on jQuery
		);
		
		/*Localise the scripts*/
			//For default options set in ACF Options page
			wp_localize_script('ajax_counter', 'script_localise', array(	//Name in JS: 'script_localise'
				//Setup variables
				'cookie_name' 		=> 'test_cookie_ajax',
				'cookie_duration' 	=> '60',
				'content_wrapper' 	=> 'ajax_content_wrapper',
				'content_messages' 	=> 'message_notice',

				//Default
				'ajaxurl' => admin_url('admin-ajax.php'),
				'nonce' => wp_create_nonce("nonce"),

				//For Counter Increase
				'action_counter_increase' => 'counter_increase',			//Action in JS: 'wp_ajax_counter_increase', Function: 'ajax_counter_increase'

				//For Counter Current Value
				'action_counter_current' => 'counter_current',				//Action in JS: 'wp_ajax_counter_current', Function: 'ajax_counter_current'
			));

	}
	add_action( 'wp_enqueue_scripts', 'enqueue_ajax_form_script' );



	/***********************
		Ajax Counter Increase - Update counter
	***********************/
	function ajax_counter_increase() {
		
		/*
			Nonce Security check
		*/
		if ( ! wp_verify_nonce( $_POST['nonce'], 'nonce' ) ) {
			wp_send_json_error();
		}


		//Get current field value
		$get_field_value = get_field('counter_val', 'options_counter');


		//If current field is found
		if ( $get_field_value != '' ) {

			//Increase the value by 1
			$increase_value = 1;


			//New value
			$new_value = $get_field_value + $increase_value;

			//Update post meta value with new value
			if ( update_field( 'counter_val', $new_value, 'options_counter') ) {

				//Data to return via JSON
				$success = array(
					'value' =>  esc_html( $new_value ),
				);

			} else {
				$error = array( 'value' => "Value could not be updated" );	
			}

		} else {
			$error = array( 'value' => "Cannot retrieve value" );	
		}


		/*
			Return Data
		*/
		//If Error
		if ( !empty($error) ) {
			wp_send_json_error($error);
		
		//If success
		} elseif ( !empty($success) ) {
			wp_send_json_success( $success );
		
		//Catch all
		} else {
			wp_send_json_error();
		}


		die();
	}
	//Action: 'counter_increase' posted in AJAX, runs this function: 'ajax_counter_increase'
	add_action('wp_ajax_counter_increase', 'ajax_counter_increase');		//Run for Admin users
	add_action('wp_ajax_nopriv_counter_increase', 'ajax_counter_increase');	//Run for Non-Admin users



	/***********************
		Ajax Counter Current Value - get current counter value
	***********************/
	function ajax_counter_current() {
		
		/*
			Nonce Security check
		*/
		if ( ! wp_verify_nonce( $_POST['nonce'], 'nonce' ) ) {
			wp_send_json_error();
		}


		//Get current field value
		$get_field_value = get_field('counter_val', 'options_counter');


		//If current field is found
		if ( $get_field_value != '' ) {

			//Data to return via JSON
			$success = array(
				'value' => esc_html( $get_field_value ),
			);

		} else {
			$error = array( 'value' => "Cannot retrieve value" );
		}


		/*
			Return Data
		*/
		//If Error
		if ( !empty($error) ) {
			wp_send_json_error($error);

		//If success
		} elseif ( !empty($success) ) {
			wp_send_json_success( $success );

		//Catch all
		} else {
			wp_send_json_error();
		}


		die();
	}
	//Action: 'counter_current' posted in AJAX, runs this function: 'ajax_counter_current'
	add_action('wp_ajax_counter_current', 'ajax_counter_current');			//Run for Admin users
	add_action('wp_ajax_nopriv_counter_current', 'ajax_counter_current');	//Run for Non-Admin users
?>