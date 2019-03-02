sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel"
], function(ODataModel) {
	"use strict";

	return ODataModel.extend("PromisifiedODataModel", {

		submitChanges: function(mParameters) {
			mParameters = mParameters || {};
			return new Promise((resolve, reject) => {

				mParameters.success = function(response) {
					resolve(response);
				};

				mParameters.error = function(response) {
					reject(response);
				};

				ODataModel.prototype.submitChanges.apply(this, [mParameters]);
			});
		},

		update: function(sPath, oData, mParameters) {
			mParameters = mParameters || {};
			return new Promise((resolve, reject) => {

				mParameters.success = function(response) {
					resolve(response);
				};

				mParameters.error = function(response) {
					reject(response);
				};

				ODataModel.prototype.update.apply(this, [sPath,oData,mParameters]);
			});
		}

	});
});