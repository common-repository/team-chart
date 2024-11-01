
	
	function init () {
		
		jQuery( "#loading" ).hide();
		jQuery( document ).ajaxStart(function() {
		  jQuery( "#loading" ).show();
		});
		
		jQuery( document ).ajaxComplete(function() {
		   jQuery( "#loading" ).hide();
		});
		
var data = { type: 'graphchart', action: 'graphchart',chartid : 1};
					jQuery.ajax({type: "POST", url: ajaxurl, data: data,
					
					beforeSend:function(){						
						jQuery(".tips").html("<div id='loading'>"+teamchart_popup_vars.loading+"...</div>");	
						jQuery(".start").addClass('hidden');	
					 },
					
					success:function(response){
						jQuery(".tips").addClass('hidden');
						
						jQuery("#person").removeClass('hidden');
						
						if(response!=""){
							jQuery("#team-chart").prepend('<ul id="org" style="display:none;"></ul>');
							jQuery("#org").html(response);
							
						}
						else {
						jQuery(".start").removeClass('hidden');	
						}
						
						// Read insert data js
						jQuery('#org li').each(function(){
							person= new Object();
							person["id"]=jQuery(this).data('id');
							person["name"]=jQuery(this).data('name');
							person["job"]=jQuery(this).data('job');
							person["description"]=jQuery(this).data('description');
							person["media-id"]=jQuery(this).data('mediaid');
							person["media-url"]=jQuery(this).data('mediaurl');
							person["parent"]=jQuery(this).data('parent');
							person["pos"]=jQuery(this).data('pos');	
							persons[jQuery(this).data('id')]=person;
						});
						graphChart();	
						UpdatePersonList();
				     }});
		
		
		
		
} // END INIT();
		

	
	
	function UpdatePersonList(){
		var data = { type: 'teamchart_person', action: 'teamchart_person',chartid : 1};
		jQuery.ajax({type: "POST", url: ajaxurl, data: data,
		beforeSend:function(){						
						jQuery("#person-list").html("<div id='loading'>"+teamchart_popup_vars.loading+"...</div>");	
						
						
					 },	
		success:function(response){
			jQuery("#person-list").html(response);
			
			/*  DELETE PERSON FROM DATABASE  */
			jQuery('.person .delete').click(function(){				
				if (confirm(teamchart_popup_vars.deleteconfirm)){
					console.log("delete");	
					
					var data = { type: 'deleteperson', action: 'deleteperson',idperson : jQuery(this).parent().data('id')}		
					jQuery(this).parent().unbind('click');								
					jQuery(this).parent().remove();	

				
						
					jQuery.ajax({
						type: "POST",
						url: ajaxurl,
						data: data
					});	
					
					
				}
		
			});
			
			
			
			/*  ADD PERSON IN CHART  */
			jQuery('.person').click(function(){		
				
				jQuery(this).unbind('click');
				jQuery(".start").addClass('hidden');				
				person= new Object();			
				person["id"]=jQuery(this).data('id');
				person["name"]=jQuery(this).data('name');
				person["job"]=jQuery(this).data('job');
				person["description"]=jQuery(this).data('description');
				person["media-id"]=jQuery(this).data('mediaid');
				person["media-url"]=jQuery(this).data('mediaurl');
				person["parent"]=null;
				person["pos"]=null;				
				persons[person["id"]]=person;
				
				jQuery(this).remove();
				
				
				if(document.getElementById("org") == null)
				{
					jQuery("#team-chart").prepend('<ul id="org" style="display:none;"></ul>');
				}
				
				// Add node in Chart
				if (jQuery("#org li").is('#first')){
				jQuery("#org li#first ul:last").append('<li data-id="'+person["id"]+'">'+person["name"]+'<div class="imgnode"><img src="'+person["media-url"]+'"/></div></li>');
				}
				else{
				jQuery("#org").append('<li id="first" data-id="'+person["id"]+'">'+person["name"]+'<div class="imgnode"><img src="'+person["media-url"]+'"/></div><ul></ul></li>');
				}
									
				updatePosition();
				addDB(jQuery(this).data('id'));
	
				return false;	
			});
		}});
	}
	
	
	/**
	* Action to upload or choose picture
	**/	
		jQuery('body').on('click','.custom_media_upload',function() {
			
		    var send_attachment_bkp = wp.media.editor.send.attachment;

		    wp.media.editor.send.attachment = function(props, attachment) {
				
				jQuery('.custom_media_upload').removeClass("picture");
				jQuery('#media-upload-hidden').val('attachment.id');
				jQuery('.custom_media_upload').html("<img class='custom_media_image' src='"+attachment.url+"' data-id='"+attachment.id+"'/>");
		        /*
		        $('.custom_media_url').val(attachment.url);
		        $('.custom_media_id').val(attachment.id);
				*/
		        wp.media.editor.send.attachment = send_attachment_bkp;
		    }
		
		    wp.media.editor.open();
		
		    return false;       
		});


		
		
	/**
	* Action to Add Person or Update person
	* "idchart" give ID to new person
	* "editing_tmp" temp var to update person
	* "persons" object with all person in the chart
	**/		
	var idchart=1;// IMPORTANT
	var editing_tmp;
	var persons=new Object();
	var person=new Object();
	
	jQuery('body').on('submit','.add-person',function() {
			
		if (jQuery(this).attr('id')=="add-new-person"){
			
			person= new Object();
			person["name"]=jQuery("#new-person").val();
			person["job"]=jQuery("#job").val();
			person["description"]=jQuery("#description").val();
			person["media-id"]=jQuery('.custom_media_image').attr('data-id');
			person["media-url"]=jQuery('.custom_media_image').attr('src');
			person["parent"]=null;
			person["pos"]=null;				
			
			addNewPerson(person);
			
		}
		else if (jQuery(this).attr('id')=="update-person"){
			updatePerson();
		}
		resetFields();			
	
		return false;
	
	});
	
	

	function graphChart(){
		
		jQuery(".jOrgChart").remove();
			jQuery("#org").jOrgChart({
	            chartElement : '#build-chart',
	            dragAndDrop  : function() {
       		     updatePosition();
       		     updateDB();
     	 		 }
	        });
	}
	
	
	// Reset Fields
	function resetFields(){
		jQuery("#new-person").val("");
		jQuery("#job").val("");
		jQuery("#description").val("");
		jQuery('.custom_media_upload').addClass("picture").html(teamchart_popup_vars.mediabutton);
		jQuery('#media-upload-hidden').val("");
	}
		
	function addNewPerson(persondata){
		// Save data
		person= new Object();
		person=persondata;
		jQuery(".start").addClass('hidden');
			
		// submit Data
		var personsValues = person;	
		var data = { type: 'save', action: 'iajax_save',chartid : 1, persons: personsValues };
		jQuery.ajax({
			 type: "POST",
			 url: ajaxurl,
			 data: data,
			 beforeSend:function(){
			 // Do action
			 },
			 success:function(idperson){ 
			 	person["id"]=idperson;			 	
				persons[idperson]=person;	
				
				
				if(document.getElementById("org") == null)
				{
					jQuery("#team-chart").prepend('<ul id="org" style="display:none;"></ul>');
				}
				
										
				// Add node in Chart
				if (jQuery("#org li").is('#first')){
					if (jQuery("#org li#first ul:last").length!=0)
						jQuery("#org li#first ul:last").append('<li data-id="'+idperson+'">'+person["name"]+'<div class="imgnode"><img src="'+person["media-url"]+'"/></div></li>');
					else
						jQuery("#org li#first").append('<ul><li data-id="'+idperson+'">'+person["name"]+'<div class="imgnode"><img src="'+person["media-url"]+'"/></div></li></ul>');
				}
				else {
					jQuery("#org").append('<li id="first" data-id="'+idperson+'">'+person["name"]+'<div class="imgnode"><img src="'+person["media-url"]+'"/></div><ul></ul></li>');
				}	
				updatePosition();
				graphChart();   
				updateDB();								
			 }
		});		
		
		
		

		
	
	}
	
	function updatePerson(){
		
		persons[editing_tmp]["name"]=jQuery("#new-person").val();
		persons[editing_tmp]["job"]=jQuery("#job").val();
		persons[editing_tmp]["description"]=jQuery("#description").val();
		persons[editing_tmp]["media-id"]=jQuery('.custom_media_image').attr('data-id');
		persons[editing_tmp]["media-url"]=jQuery('.custom_media_image').attr('src');
		
		// CLONE LES ENFANT et les réinjecter
		var clone=jQuery('li[data-id="'+editing_tmp+'"]').clone().children("ul").html();		
		
		jQuery('li[data-id="'+editing_tmp+'"]').html(persons[editing_tmp]["name"]+'<div class="imgnode"><img src="'+persons[editing_tmp]["media-url"]+'"/></div><ul>'+clone+'</ul>');
		
		
		
		
		/*
		Database Persist		
		*/
		
		var personsValues = persons[editing_tmp];	
		var data = { type: 'updateperson', action: 'iajax_save', persons: personsValues };
		jQuery.ajax({
			 type: "POST",
			 url: ajaxurl,
			 data: data,
			 beforeSend:function(){
			   updatePosition();
			   graphChart();   
			   
			 },
			 success:function(){ 
				
				
				updateDB();
				
				jQuery('#submit-person').val(teamchart_popup_vars.addperson);
				jQuery('.add-person').attr('id',"add-new-person"); 								
			 }
		});	
		
	}
	
	
	// Read position of person
	function updatePosition(){
		var tmpparent=null;
		var pos=0;
		jQuery('#org li').each(function(){		
			persons[jQuery(this).data("id")]["parent"]=jQuery(jQuery(this)).parent().parent().data('id');
			if((typeof persons[jQuery(this).data("id")]["parent"])=='undefined'){ 
				persons[jQuery(this).data("id")]["parent"]="-1"; 
			}
			persons[jQuery(this).data("id")]["pos"]=pos;
			pos++;						
		});
		if(jQuery('#org li').length==0){
			jQuery('#org').remove();
			jQuery(".start").removeClass('hidden');
		}
		
	}
	
	function updateDB(){

		var personsValues = persons;	
		var data = { type: 'updatepos', action: 'iajax_save',chartid : 1, persons: personsValues };
		jQuery.ajax({type: "POST", url: ajaxurl, data: data,success:function(){}});
	}
	
	function addDB($idperson){
		graphChart(); 
		var data = { type: 'addperson', action: 'iajax_save',chartid : 1, personid: $idperson };
		jQuery.ajax({type: "POST", url: ajaxurl, data: data,success:function(){
		
		updateDB();

		
		}});
	}
	
	
	function deleteDB($idperson,$parent){
		
		
		
		
		var personsValues = new Object();	
		person_id= new Object();
		person_id["id"]=$idperson;
		personsValues[$idperson]=person_id;		
		
		
		//console.log("#org li[data-id='"+$idperson+"'] li");
		
		jQuery("#org li[data-id='"+$idperson+"'] li").each(function(){
			person_id= new Object();
			person_id["id"]=jQuery(this).data('id');
			personsValues[jQuery(this).data('id')]=person_id;
			
		});
		
		
	  jQuery("#org li[data-id='"+$idperson+"']").remove();
		
			updatePosition();
			graphChart();
					
	  	
		var data = { type: 'delete', action: 'iajax_save',chartid : 1, persons: personsValues };
		jQuery.ajax({type: "POST", url: ajaxurl, data: data,
		beforeSend:function(){
			jQuery('body').on("click","a.trash",DeleteAction);
		},
		success:function(){				
				
				UpdatePersonList();	
		}});
		
	}
	
	
	/**
	* CLICK on EDIT element
	**/
	
	jQuery('body').on("click","a.edit",function() {
		// read meta-datas
		editing_tmp=this.dataset.id;			
		// update input
		jQuery('#new-person').val(persons[editing_tmp]["name"]);
		jQuery("#job").val(persons[editing_tmp]["job"]);
		jQuery("#description").val(persons[editing_tmp]["description"]);
		jQuery('.custom_media_upload').removeClass("picture");
		jQuery('.custom_media_upload').html("<img class='custom_media_image' src='"+persons[editing_tmp]["media-url"]+"' data-id='"+persons[editing_tmp]["media-id"]+"'/>");
		jQuery('#media-upload-hidden').val("true");
		// ui form
		jQuery('#submit-person').val(teamchart_popup_vars.updateperson);
		jQuery('.add-person').attr('id',"update-person");
		return false;	
	});
	
	
	
	

	/**
	* CLICK on DELETE element
	**/
	jQuery('body').on("click","a.trash",DeleteAction);
	
	
	
	function DeleteAction() {
		
		if (confirm(teamchart_popup_vars.deleteconfirm)){
			delete_id=this.dataset.id;	
		
		jQuery('body').off("click","a.trash",DeleteAction);
		jQuery("#person-list").html("<div id='loading'>"+teamchart_popup_vars.loading+"...</div>");
		
		
		deleteDB(delete_id,persons[delete_id]['parent']);	
			
	
		}	
	}




	/**
	* CLICK on SAVE CHART
	**/
	jQuery('body').on('click',"#save-chart",function(){
		window.send_to_editor("[teamchart id='"+1+"']");	
		parent.jQuery.colorbox.close();
		return false;		
	});
	
	
	/**
	* CLICK on CLOSE featureleft
	**/
	jQuery('body').on('click',".closefeature.left",function(){
		var data = { type: 'close', action: 'featureleft'};
		jQuery.ajax({type: "POST", url: ajaxurl, data: data,
		success:function(){				
			jQuery('.featurepro.left').remove();
		}});
		return false;		
	});
	
	/**
	* CLICK on CLOSE featurecenter
	**/
	jQuery('body').on('click',".closefeature.center",function(){
		var data = { type: 'close', action: 'featurecenter'};
		jQuery.ajax({type: "POST", url: ajaxurl, data: data,
		success:function(){				
			jQuery('.featurepro.center').remove();
		}});
		return false;		
	});
	
	/**
	* CLICK on CLOSE featureright
	**/
	jQuery('body').on('click',".closefeature.right",function(){
		var data = { type: 'close', action: 'featureright'};
		jQuery.ajax({type: "POST", url: ajaxurl, data: data,
		success:function(){				
			jQuery('.featurepro.right').remove();
		}});
		return false;		
	});
	
	
	


