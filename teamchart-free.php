<?php
/*
Plugin Name: Team Chart Free
Plugin URI: http://www.wpcode-united.com/wordpress-plugin/team-chart
Description: Team Chart is a plugin that helps you to create flow chart easily. Upload images, description and organize members with drag’n drop.
Author: WPCode United
Version: 1.0.4
Author URI: http://www.wpcode-united.com
*/


require_once(plugin_dir_path(__FILE__)."/include/admin/teamchart-free-admin.php");
require_once(plugin_dir_path(__FILE__)."/include/template/teamchart-free-template.php");
require_once(plugin_dir_path(__FILE__)."/include/admin/teamchart-free-admin-ajax.php");
           

global $team_chart_free_version;
$team_chart_free_version = "1.0.4";

function team_chart_install_free() {
	
   require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
   
   global $wpdb;
   global $team_chart_free_version;
   
	// Database PERSON
   $table_name_person = $wpdb->prefix . "team_chart_person";
      
   $sql = "CREATE TABLE $table_name_person (
  id mediumint(9) NOT NULL AUTO_INCREMENT,
  name tinytext NOT NULL,
  job tinytext NOT NULL,
  description text NULL,
  mediaid VARCHAR(150) DEFAULT '' NOT NULL,
  UNIQUE KEY id (id)
    )  CHARACTER SET utf8
	;";
   dbDelta( $sql );
   
   
   // Database CHART
   $table_name_chart = $wpdb->prefix . "team_chart";      
   $sql = "CREATE TABLE $table_name_chart (
  id mediumint(9) NOT NULL AUTO_INCREMENT,
  name tinytext NOT NULL,
  theme mediumint(9) DEFAULT '1' NULL,
  UNIQUE KEY id (id)
    ) CHARACTER SET utf8
	;";
   dbDelta( $sql );
      
	if($wpdb->insert($table_name_chart,array('name'=>'teamchart','theme'=>"1"))===FALSE){
		echo "Error SQL.";
	}

   
   // Database CHART-PERSON
   $table_name_assoc = $wpdb->prefix . "team_chart_assoc";
     
  $sql = "CREATE TABLE $table_name_assoc (
  idchart mediumint(9) NOT NULL,
  idperson mediumint(9) NOT NULL,
  parent mediumint(9) DEFAULT '-1' NULL,
  pos mediumint(9) NULL,
  UNIQUE KEY (idchart, idperson)
    ) CHARACTER SET utf8
	;";
   dbDelta( $sql );
   
 
   add_option( "team_chart_free_version", $team_chart_free_version );
}


register_activation_hook( __FILE__, 'team_chart_install_free' );



function team_chart_uninstall_free() {

        global $wpdb;
        
        if ( !is_plugin_active('teamchart/teamchart.php') ) {
        // Drop TABLE assoc
        $table_name_assoc = $wpdb->prefix . "team_chart_assoc";
        $wpdb->query("DROP TABLE IF EXISTS $table_name_assoc");
        
        // Drop TABLE chart
        $table_name_person = $wpdb->prefix . "team_chart_person";
        $wpdb->query("DROP TABLE IF EXISTS $table_name_person");
        
     	// Drop TABLE person
        $table_name_chart = $wpdb->prefix . "team_chart";
        $wpdb->query("DROP TABLE IF EXISTS $table_name_chart");
        }
       
}

register_deactivation_hook( __FILE__ , 'team_chart_uninstall_free' );



/**
 *  Trad function
 */
 
add_action('init', 'teamchart_trad_free');
function teamchart_trad_free()
{
	load_plugin_textdomain('teamchart', false, dirname ( plugin_basename( __FILE__ ))."/locale/");
}


/**
 *  Session Feature
 */
 
 function register_session(){
        if( !session_id()){
            session_start();
            if (!isset($_SESSION['close'])){
            	$_SESSION['featureleft']=true;
				$_SESSION['featurecenter']=true;
				$_SESSION['featureright']=true;
            	}
		}
    }

add_action('init','register_session');

function reset_session() {
    session_destroy();
}
add_action('wp_logout', 'reset_session');


        function generateFilename_free( $file, $w, $h ){
                $info = pathinfo($file);
                $dir = $info['dirname'];
                $ext = $info['extension'];
                $name = wp_basename($file, ".$ext");
                $suffix = "{$w}x{$h}";
                $destfilename = "{$dir}/{$name}-{$suffix}.{$ext}";
                
                return $destfilename;
        }



/**
 *  Shortcode Frontend
 */
function teamchart_shortcode_free( $atts ) {
	
	
	
	extract( shortcode_atts( array(
		'id' => 'teamchart'
	), $atts ) );

	ob_start();

	
	/*
		1. Repertorié les styles
		2. Charger les CSS requis
		3. Ajouter un param "theme" à chaque chart	
	*/
	
	$classtheme="defaut";
	
	global $wpdb;
	
	$table_name = $wpdb->prefix . "team_chart";
	$classtheme = $wpdb->get_row( "SELECT theme FROM ".$table_name." WHERE id='".$id."'");
	

	switch($classtheme->theme){
	 case '1':$prefixtheme="default";break;	
	 case '2':$prefixtheme="circle";break;	
	 case '3':$prefixtheme="nature";break;	
	}
	
	switch($classtheme->theme){
	 case '1':wp_enqueue_style( 'theme-default', plugin_dir_url(__FILE__).'asset/style/theme-default.css' );break;	
	 case '2':wp_enqueue_style( 'theme-circle', plugin_dir_url(__FILE__).'asset/style/theme-circle.css' );break;	
	 case '3':wp_enqueue_style( 'theme-nature', plugin_dir_url(__FILE__).'asset/style/theme-nature.css' );break;	
	}
	
	
	
		
	// Ajout script
	
	wp_enqueue_style( 'colorbox-css', plugin_dir_url(__FILE__).'asset/style/colorbox.css' );
	wp_enqueue_script( 'colorbox-js', plugin_dir_url(__FILE__).'asset/js/jquery.colorbox.js',array('jquery'),"2.1.5",true);
	add_action('wp_footer','colorbox_script_free');
	
	// Read Chart
	
	
	include(plugin_dir_path(__FILE__)."/include/template/default/teamchart-free-theme-default.php");

	// save and return the content that has been output

$content = ob_get_clean();
return $content;
}
add_shortcode( 'teamchart', 'teamchart_shortcode_free' );




function colorbox_script_free() {
	?>
	<script type="text/javascript">
	jQuery(document).ready(function() {
		
		
		
		
		jQuery('#teamchart-free-div .person').click(function(){
			
			
			var obj = jQuery(this);
			var classtheme = obj.parentsUntil("#teamchart-free-div").parent().attr('class');
			var name = obj.find(".name").children("p").html();
			var job = obj.find(".Job").html();
			var photo = obj.find(".imagefull").html();
			var desc = obj.find(".description").html();
			
			var $content = "<div class='person-fancybox "+classtheme+"'><div class='photo'>"+photo+"</div><div class='text'><h2>"+name+"</h2><h4>"+job+"</h4><p>"+desc+"</p></div></div>";

			jQuery.colorbox({ 
						html : $content,
						transition	: "fade",
						maxWidth	: 660,
						maxHeight	: 310,
						opacity		: 0.5,
						close		: " ",
						width		: "80%",
						height		: "90%",
						'onComplete': function() {
                 			  jQuery("#colorbox").addClass(classtheme);
                 			// jQuery(".fancybox-overlay").addClass(classtheme);
                 			  
       					}
				    	  
	 		});
	 		
	 	return false;	
	 	
	 	});	
	 			
	});
	</script>
	
	<?php

		
	
}


?>