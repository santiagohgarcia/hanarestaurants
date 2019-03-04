/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

module.exports = {
	trucateAfter: function(param) {
		var pStmt = param.connection.prepareStatement(`TRUNCATE TABLE "${param.afterTableName}"`);
		pStmt.executeUpdate();
		pStmt.close();
	},

	getNewObject: function(param) {
		//Get New Record
		var pStmt = param.connection.prepareStatement(`select * from "${param.afterTableName}"`);
		var rs = pStmt.executeQuery();
		pStmt.close();
		return rs._rows[0];
	},

	getOldObject: function(param) {
		if (!param.beforeTableName) {
			return undefined;
		}
		//Get Old Record
		var pStmt = param.connection.prepareStatement(`select * from "${param.beforeTableName}"`);
		var rs = pStmt.executeQuery();
		pStmt.close();
		return rs._rows[0];
	}

};