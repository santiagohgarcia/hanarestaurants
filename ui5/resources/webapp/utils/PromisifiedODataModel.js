sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel"
], function(ODataModel) {
	"use strict";

	return ODataModel.extend("PromisifiedODataModel", {

		submitChanges: function(mParameters) {
			mParameters = mParameters || {};
			return new Promise((resolve, reject) => {

				mParameters.success = function(response) {
					var batchErrorResponses = response.__batchResponses.filter(batchResponse =>
						batchResponse.response && (batchResponse.response.statusCode > 299 || batchResponse.response.statusCode < 200));
					if (batchErrorResponses.length > 0) {
						reject({
							__batchResponses: batchErrorResponses
						});
					} else {
						resolve(response);
					}
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

				ODataModel.prototype.update.apply(this, [sPath, oData, mParameters]);
			});
		}

	});
});