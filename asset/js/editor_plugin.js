
(function() {
	tinymce.create('tinymce.plugins.teamchart', {

		init : function(ed, url) {
			var t = this;

			t.url = url;
			t._createUI();

			
			//replace shortcode before editor content set
			ed.onBeforeSetContent.add(function(ed, o) {
				o.content = t._do_spot(o.content);
				
			});
			
			//replace shortcode as its inserted into editor (which uses the exec command)
			ed.onExecCommand.add(function(ed, cmd) {
			    if (cmd ==='mceInsertContent'){
					tinyMCE.activeEditor.setContent( t._do_spot(tinyMCE.activeEditor.getContent()) );
				}
			});
			//replace the image back to shortcode on save
			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = t._get_spot(o.content);
			});
			
			
			ed.onClick.add(function(ed, evt){
				
	
			    // Firefox
			    if (evt.explicitOriginalTarget){ // this is the img-element
			      if (evt.explicitOriginalTarget.className == 'wpSpot mceItem'){
			        var offset = jQuery(evt.explicitOriginalTarget).offset();
			       	var $id=evt.explicitOriginalTarget.id;
			      	$id= $id.replace("'","");
			      	$id= $id.replace("'","");
			      	
			      	jQuery('#teamchart_editbtns img#wp_editimgbtn').attr('data-id',$id);   	
			   		ed.plugins.wordpress._showButtons(evt.explicitOriginalTarget, 'teamchart_editbtns');
			      }
			   
			  
			    }
			    
			    
			    // IE
			    else if (evt.target) { // this is the img-element
			      if (evt.target.className == 'wpSpot mceItem'){
			      		       
			      var offset = jQuery(evt.target).offset();
			      
			      	var $id=evt.target.id;
			      	$id= $id.replace("'","");
			      	$id= $id.replace("'","");
			      	
			      	jQuery('#teamchart_editbtns img#wp_editimgbtn').attr('data-id',$id);   	
			   		ed.plugins.wordpress._showButtons(evt.target, 'teamchart_editbtns');			
			    
			      }
			    }
			    /*
			    else {
			    	var DOM = tinymce.DOM;
			    	DOM.hide( DOM.select('#teamchart_editbtns') );	
			    	alert('else');
			    }
			  */
			    
			}); // end click event
			

			// popup buttons for images and the gallery
			ed.onInit.add(function(ed) {
				tinymce.dom.Event.add(ed.getWin(), 'scroll', function(e) {
					t._hideButtons();
				});
				tinymce.dom.Event.add(ed.getBody(), 'dragstart', function(e) {
					t._hideButtons();
				});
			});
			
			ed.onMouseDown.add(function(ed, e) {
			
					t._hideButtons();
			});

			ed.onSaveContent.add(function(ed, o) {
				
				tinyMCE.activeEditor.setContent( t._do_spot(tinyMCE.activeEditor.getContent()) );
				t._hideButtons();
			});

	
			ed.onKeyDown.add(function(ed, e){
				if ( e.which == tinymce.VK.DELETE || e.which == tinymce.VK.BACKSPACE )
					t._hideButtons();
			});
			
/*
			
			ed.onBeforeExecCommand.add(function(ed, cmd, ui, val) {
				tinyMCE.activeEditor.setContent( t._do_spot(tinyMCE.activeEditor.getContent()) );
				t._hideButtons();
			});

*/





		},

		_do_spot : function(co) {
			var t = this;
			return co.replace(/\[teamchart([^\]]*)\]/g, function(a,b){
				
				return '<img src="'+t.url+'/tinymce-img/t.gif" class="wpSpot mceItem" alt="TeamChart" title="teamchart'+tinymce.DOM.encode(b)+'" '+tinymce.DOM.encode(b)+' data-mce-src="/wp-content/plugins/teamchart-free/asset/images/t.gif"/>';
				
					
			});
			
			
		},

		_get_spot : function(co) {

			function getAttr(s, n) {
				n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
				return n ? tinymce.DOM.decode(n[1]) : '';
			};

			return co.replace(/(?:<p[^>]*>)*(<img[^>]+>)(?:<\/p>)*/g, function(a,im) {
				var cls = getAttr(im, 'class');

				if ( cls.indexOf('wpSpot') != -1 )
					return '<p>['+tinymce.trim(getAttr(im, 'title'))+']</p>';

				return a;
			});
		},
		
		_createUI : function() {
			var t = this, ed = tinymce.activeEditor, DOM = tinymce.DOM, editButton, dellButton, isRetina;

			if ( DOM.get('teamchart_editbtns') )
				return;

			DOM.add(document.body, 'div', {
				id : 'teamchart_editbtns',
				style : 'display:none;position:absolute;'
			});

			editButton = DOM.add('teamchart_editbtns', 'img', {
				src : t.url+'/tinymce-img/image.png',
				id : 'wp_editimgbtn',
				width : '24',
				height : '24',
				title : ed.getLang('teamcharteditimage.edit_img')
			});
			
			
			tinymce.dom.Event.add(editButton, 'mousedown', function(e) {
				 var DOM = tinymce.DOM;
			     DOM.hide( DOM.select('#teamchart_editbtns') );
				 var t = this;
				 jQuery.colorbox(				 
					 {
					 	href : t.url+'/../../wp-content/plugins/teamchart-free/include/admin/teamchart-free-popup-window.php?popup=true&id='+jQuery('#teamchart_editbtns img#wp_editimgbtn').attr('data-id'),
					 	maxWidth	: 1200,
						maxHeight	: 1200,
						width		: "80%",
						height		: "90%",
						close		: " ",
						opacity		: 0.7
			    	 }
 				);
 				
			});
			
			
			dellButton = DOM.add('teamchart_editbtns', 'img', {
				src : t.url+'/tinymce-img/delete.png',
				id : 'wp_delimgbtn',
				width : '24',
				height : '24',
				title : ed.getLang('teamcharteditimage.del_img')
			});
			
		
			tinymce.dom.Event.add(dellButton, 'mousedown', function(e) {
				var ed = tinymce.activeEditor, el = ed.selection.getNode(), parent;
				ed.dom.remove(el);
				t._hideButtons();
			});
			
		},
		
		_hideButtons : function() {
			var DOM = tinymce.DOM;
			DOM.hide( DOM.select('#teamchart_editbtns') );
		},
		
		
	});
	

	tinymce.PluginManager.add('teamchart', tinymce.plugins.teamchart);
	

})();
