<?php 
	/**
	 * Template Name: Ajax counter update
	 *
	 * This is a generic page template
	 */
?>

<?php get_header(); ?>

	<!-- Message -->
	<div id="message_notice"></div>

	
	<!-- Ajax content -->
	<div id="ajax_content_wrapper">

		<!-- Display value -->
		<div id="counter">
			Current count: <span><?php echo esc_html( get_field('counter_val', 'options_counter') ); ?></span>
		</div>


		<!-- /*---------------------------------------------------------*/ -->


		<form method="POST">
			<input type="submit" name="submit" id="submit" value="Submit">
		</form>

	</div>


<?php get_footer(); ?>