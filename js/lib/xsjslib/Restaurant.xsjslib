/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	utils.insertAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values("restaurants.db.sequences::restaurantIdSeq".NEXTVAL,?)`);
	pStmt.setString(1, newObject.Name);
	pStmt.executeUpdate();
	pStmt.close();
}



