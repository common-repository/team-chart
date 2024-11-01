<?php 


global $wpdb;
$table_name = $wpdb->prefix . "team_chart_person, ".$wpdb->prefix . "team_chart_assoc";
$myrows = $wpdb->get_results("SELECT p.id, p.name, p.job, p.description, p.mediaid, a.parent, a.pos FROM ".$wpdb->prefix."team_chart_person p
INNER JOIN  ".$wpdb->prefix."team_chart_assoc a
ON p.id = a.idperson
 AND a.idchart = $id 
 ORDER BY a.parent ASC, a.pos ASC");

  $nbparent=0;
      foreach ($myrows as $row)
 	 {
 	 	if ($row->parent == -1){
 	 		// parents + enfants
 	 		 $trigparent[$nbparent]=count_children_free($myrows,$row->id);
 	 		 $nbparent++; 	 	 
 	 	
 	 	}
 	 }
 	 
// parents + enfants

/*

	--> Créer un LI vide
	--> $parentenfant

*/
	$parentenfant=false;

if ($trigparent[1])
	$parentenfant=true;


 	 
echo "<div id='teamchart-free-div' class='$prefixtheme'><ul id='chart'>".build_chart_free($myrows,-1,0,0,$nbparent,$parentenfant)."</ul></div>";

?>
