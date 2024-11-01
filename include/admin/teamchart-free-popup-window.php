<?php 


if(!isset($_GET["popup"]))
	return false;
else {

 ?>

<div id="column">

<div id="chart" class="cols">




<?php
	
	if(isset($_GET["id"]))
	echo "<input type='hidden' id='id-chart' value='".$_GET["id"]."'/> ";
?>		

		<h4><?php _e( 'Chart', 'teamchart' ) ?> :</h4>
		<div id="chart-list">
			<ul> 
			<li> <a href="#teamchart" class="button button-primary">Team Chart</a></li>
			</ul>
		</div>
		
		<?php if ($_SESSION['featureleft']) { ?>
				<div class='featurepro left'><div class="closefeature left"></div>
		<a href="http://www.wpcode-united.com/wordpress-plugin/team-chart" target="_blank"><?php _e( 'Manage multiple flow chart with Team Chart pro version, read more.', 'teamchart' ) ?></a>
	</div>
	<?php } ?>
</div>


<?php
	if(isset($_GET["id"]))
	echo "<input type='hidden' id='id-chart' value='".$_GET["id"]."'/> ";
?>		



<div id="team-chart" class="cols">

<?php if ($_SESSION['featurecenter']) { ?>

	<div class='featurepro center'><div class="closefeature center"></div>
		<a href="http://www.wpcode-united.com/wordpress-plugin/team-chart" target="_blank"><?php _e( 'Resize image in one click with pro version, read more.', 'teamchart' ) ?></a>
	</div>
	<?php } ?>

	<div class='start'>
		<?php _e( 'To start, Add a new person in your teamchart.', 'teamchart' ) ?>
	</div>
	
	<div id='chartgraph'>
		<div id="loading"> <?php _e( 'Save', 'teamchart' )?> </div>
<span class='tips'><?php _e( 'Please select or add chart to build it !', 'teamchart' ) ?> </span>
	
	
	<div id="build-chart">
	
	</div>
	</div>
</div>



<div id="person" class="cols hidden">

<?php if ($_SESSION['featureright']) { ?>

	<div class='featurepro right'><div class="closefeature right"></div>
		<a href="http://www.wpcode-united.com/wordpress-plugin/team-chart" target="_blank"><?php _e( 'Apply reponsives themes with pro version, read more.', 'teamchart' ) ?></a>
	</div>
<?php } ?>
<a href="#" class="button button-primary button-hero upload-button" id="save-chart">
<?php _e( 'Insert chart', 'teamchart' ) ?> 
</a><br/>
<hr/>
<p>
		<form id="add-new-person" class="add-person">
		<label><?php _e( 'Picture', 'teamchart' ) ?> * :</label><br/>
		<a href="#" class="custom_media_upload picture">
		<?php _e( 'Upload or choose picture', 'teamchart' ) ?> 
		</a>
		<input type="text" name="media" id="media-upload-hidden" required>

<br/>
		
		<label><?php _e( 'Name', 'teamchart' ) ?> * :</label><br/>
		<input type="text" name="name" id="new-person" placeholder="<?php _e( 'Enter name...', 'teamchart' ) ?>" required/>
		<label><?php _e( 'Position', 'teamchart' ) ?> :</label><br/>
		<input type="text" name="position" id="job" placeholder="<?php _e( 'Enter position…', 'teamchart' ) ?>"/>
		<label>Description :</label><br/>
		<textarea name="description" id="description" rows="5"></textarea>
	
		<input type="submit" class="button" id="submit-person" value="<?php _e( 'Add person', 'teamchart' ) ?>"/>
		</form>
</p>
<hr/>
<h4><?php _e( 'Search person', 'teamchart' ) ?> :</h4>
	<div id="person-list">
	</div>
</div>



</div>
</div>

<script>
jQuery(document).ready(function() {

	init ();
	
});
</script>

<?php 

}
?>