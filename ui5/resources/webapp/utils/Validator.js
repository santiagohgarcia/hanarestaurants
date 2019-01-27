sap.ui.define([], function() {
	"use strict";
	return {

		_i18nModel: null,

		validateRequireds: function(view, fieldGroup) {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var controls = view.getControlsByFieldGroupId(fieldGroup);
			this._i18nModel = this._i18nModel ? this._i18nModel : view.getModel("i18n").getResourceBundle();
			var that = this;
			controls.forEach(function(c) {
				try {
					var selRequired;
					var errorDesc;
					if (c instanceof sap.m.Select) {
						selRequired = Boolean(c.getCustomData()[0].getValue("required"));
						if (selRequired && !c.getSelectedKey() && !that.messageExists(c, "REQUIRED")) {
							oMessageManager.addMessages(that.generateRequiredMessage(c, "selectedKey"));
						}
					} else if (c instanceof sap.m.RadioButtonGroup) {
						selRequired = Boolean(c.getCustomData()[0].getValue("required"));
						errorDesc = c.getCustomData()[1].getValue("errorDesc");
						if (selRequired && c.getSelectedIndex() < 0 && !that.messageExists(c, "REQUIRED")) {
							oMessageManager.addMessages(that.generateRequiredMessage(c, "selectedIndex", errorDesc));
						}
					} else if (c instanceof sap.m.ComboBox) {
						if (c.getRequired() && !c.getSelectedKey() && !that.messageExists(c, "REQUIRED")) {
							oMessageManager.addMessages(that.generateRequiredMessage(c, "selectedKey"));
						}
					} else {
						if (c.getRequired() && !c.getValue() && !that.messageExists(c, "REQUIRED")) {
							oMessageManager.addMessages(that.generateRequiredMessage(c, "value"));
						}
					}
				} catch (Exception) {
					//console.warn("field not required");
				}
			});
		},

		messageExists: function(control, msgCode) {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var messages = oMessageManager.getMessageModel().getData();
			return messages.some(function(message) {
				return message.code === msgCode && message.target.split("/")[0] === control.getId();
			});
		},

		generateRequiredMessage: function(c, val, message) {
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor(); //SINGLETON
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.registerMessageProcessor(oMessageProcessor);
			return new sap.ui.core.message.Message({
				message: this._i18nModel.getText("RequiredMessage"),
				type: sap.ui.core.MessageType.Error,
				target: c.getId() + "/" + val,
				processor: oMessageProcessor,
				additionalText: message,
				description: message,
				persistent: false,
				code: "REQUIRED",
				validation: true,
				references: {
					fieldName: {
						fieldGroupIds: c.getFieldGroupIds()
					}
				}
			});
		},

		/*		addMessage: function(text, c, val) {
					var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor(); //SINGLETON
					var oMessageManager = sap.ui.getCore().getMessageManager();
					oMessageManager.registerMessageProcessor(oMessageProcessor);
					oMessageManager.addMessages(
						new sap.ui.core.message.Message({
							message: text,
							type: sap.ui.core.MessageType.Error,
							target: c.getId() + "/" + val,
							processor: oMessageProcessor,
							validation: true,
							references: {
								fieldName: {
									fieldGroupIds: c.getFieldGroupIds()
								}
							}
						}));
				},*/

		hasErrors: function(fieldGroupId) {
			return sap.ui.getCore().getMessageManager().getMessageModel().getData().some(function(e) {
				var errorFromGroupId = Object.keys(e.references).some(function(key) {
					return e.references[key].fieldGroupIds.some(function(fg) {
						return fg === fieldGroupId;
					});
				});
				return (errorFromGroupId && e.type === "Error" && !e.technical);
			});
		},

		isValid: function(fieldGroupId, view) {
			this.validateRequireds(view, fieldGroupId);
			return !this.hasErrors(fieldGroupId);
		},

		/*		removeRequiredMessages: function()s {
					var oMessageManager = sap.ui.getCore().getMessageManager();
					var messages = oMessageManager.getMessageModel().getData();
					var requiredMessages = messages.filter(function(message) {
						return message.code === "REQUIRED";
					});
					oMessageManager.removeMessages(requiredMessages);
				},*/

		validateCuilCuitByVerificationDoc: function(cuilCuit, verifDocType, verifDocNum) {
			if (cuilCuit) {
				if (verifDocType === "FS0001" || verifDocType === "ZFS0002" || verifDocType === "ZFS0003") {
					return cuilCuit ? cuilCuit.indexOf(verifDocNum) > 0 : false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}

	};
});