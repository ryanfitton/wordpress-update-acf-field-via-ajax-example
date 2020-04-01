# WordPress AJAX update ACF value example
This repository contains WordPress theme files which provide an example of how to update an ACF database field via AJAX. And to automatically refresh the current field value every 5 seconds.

* Version: `1.0.0`
* Author: [Ryan Fitton](mailto:ryan@ryanfitton.co.uk)
* Author URL: [https://ryanfitton.co.uk](https://ryanfitton.co.uk)


-------------

## Required
* Ensure you have WordPress installed. Tested from WordPress 5.3.2
* Install ACF Pro (Pro required for custom options page)
* Upload the ACF export file `acf-export-2020-03-31.json` into your ACF settings


## Explanation of files
* `tmpl_page_ajax.php` - Page template
* `functions.php` - Functions for Ajax calls
* `ajax.js` - JS Ajax calls
* `libs/js.cookie.min.js` - Used to set Cookies
* `libs/rsvp.min.js` - Allows Promise JS to be supported in IE11

## functions.php
You may already have a `functions.php` file in your theme, if so; do NOT overwrite this repo's file with your existing file.

Instead, copy and paste the contents of this repo's file, to the bottom of your existing theme file.