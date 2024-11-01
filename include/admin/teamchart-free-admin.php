<?php 



add_filter( 'media_buttons_context', 'popup_admin_free');
add_image_size('cropped', 182, 182, true);


wp_enqueue_script('jquery');
//wp_enqueue_script('media-upload');

function popup_admin_free(){
	
	
	// Import CSS
	wp_enqueue_style( 'lightbox', plugins_url('asset/style/style.css', dirname(dirname(__FILE__))) );
	wp_enqueue_style( 'colorbox-css', plugins_url('asset/style/colorbox.css', dirname(dirname(__FILE__))) );
	
	
	// Import JS
	wp_enqueue_script( 'colorbox-js', plugins_url('asset/js/jquery.colorbox.js', dirname(dirname(__FILE__))),array('jquery'),"2.1.5",true);
	wp_enqueue_script('jquery-ui-core');
	wp_enqueue_script('jquery-ui-draggable');
	wp_enqueue_script('jquery-ui-droppable');
	wp_enqueue_script( 'jquery-chart-js', plugins_url('asset/js/jquery.jOrgChart.js', dirname(dirname(__FILE__))) ,array('jquery'),"1.0.0",true);
	wp_enqueue_script('teamchart-free-popup', plugins_url('asset/js/teamchart-free-popup.js', dirname(dirname(__FILE__))),array('jquery'),"1.0.0",true);
	wp_localize_script('teamchart-free-popup', 'teamchart_popup_vars', array(
			'deleteconfirm' => __('Are you sure to delete this person ?', 'teamchart'),
			'deletechart' => __('Delete this chart ?', 'teamchart'),
			'yes' => __('Yes', 'teamchart'),
			'no' => __('No', 'teamchart'),
			'tips' => __('Please select or add chart to build it !', 'teamchart'),
			'loading' => __('loading', 'teamchart'),
			'updateperson' => __('Update person', 'teamchart'),
			'updateform' => __('Update', 'teamchart'),
			'mediabutton' => __('Upload or choose picture', 'teamchart'),
			'addperson' => __('Add person', 'teamchart')
		)
	);

	
	// Ajout script
	add_action('admin_footer','popup_admin_script_free');
	

	
	$script_fancy=plugin_dir_url(dirname(dirname(__FILE__))).'asset/js/jquery.colorbox.js';	
	$flag_upload_iframe_src = plugin_dir_url(dirname(dirname(__FILE__)))."include/admin/teamchart-free-popup-window.php?popup=true&id=1";

	$button = '<a href="'.$flag_upload_iframe_src.'" class="button various fancybox.ajax" id="add_team_chart"><span style="margin:0 5px;">'.__('Add Team Chart','teamchart').'</span></a>';
	return $button;
}




function popup_admin_script_free() {
	?>
	<script type="text/javascript">
	jQuery(document).ready(function() {
		jQuery(".various").colorbox({
			maxWidth	: 1200,
			maxHeight	: 1200,
			width		: "80%",
			height		: "90%",
			close		: " ",
			opacity		: 0.7
			});		
	});
	</script>
	
	<?php

		
	
}

		
		
function shortcodeMCE_free(){
add_filter('mce_external_plugins', "add_custom_tinymce_plugin_free");
add_filter('tiny_mce_before_init', "myformatTinyMCE_free" );
}

add_action('init', 'shortcodeMCE_free');

	


	//include the tinymce javascript plugin
    function add_custom_tinymce_plugin_free($plugin_array) {
       $plugin_array['teamchart'] = 	plugins_url('asset/js/editor_plugin.js', dirname(dirname(__FILE__)));
        return $plugin_array;
    }

	//include the css file to style the graphic that replaces the shortcode
    function myformatTinyMCE_free($in)
    {
        $in['content_css'] .= ",".plugins_url('asset/style/editor-style.css', dirname(dirname(__FILE__)));
         return $in;
    }






?>