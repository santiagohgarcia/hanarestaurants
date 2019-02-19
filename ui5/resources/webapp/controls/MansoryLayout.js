sap.ui.define([
               "sap/ui/core/Control"
               ], function (Control) {
		
		return Control.extend('sap.cc.control.masonryLayout',{
			
			metadata: {
				properties:{
					width: { type: sap.ui.core.CSSSize ,defaultValue : "100%"}
				},
				aggregations: {
					content: {type:"sap.ui.core.Control", multiple:true, singluarName: 'content'}
				},
				events: {
					press: {
						parameters: {
							selectedItem: {
								type: "sap.ui.core.control"
							}
						}
						
					}
				},
				defaultAggregation: "content"
			},
			init: function () {
				
			},
			
			renderer: function(oRM, oControl) {
				oRM.write("<div");
				oRM.writeControlData(oControl);
				oRM.addClass('wrapper');
				oRM.writeClasses();
				oRM.write(">");
				
				oRM.write("<div");
				oRM.addClass('masonry');
				oRM.writeClasses();
				oRM.write(">");
				
				var myControl = oControl;
				var aItems = oControl.getContent();
				for (var i = 0; i < aItems.length; i++) {
					oRM.write("<div ");
					oRM.addClass('item');
					oRM.writeClasses();
					oRM.write(">");
					oRM.renderControl(aItems[i]);
					oRM.write("</div>");
				}
				
				oRM.write("</div>");
				oRM.write("</div>");
			}
		});
		
});