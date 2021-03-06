/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values("restaurants.db.sequences::restaurantIdSeq".NEXTVAL,?,?,?)`);
	pStmt.setString(1, newObject.Name);
	pStmt.setInteger(2, newObject.CloseDayHour);
	pStmt.setString(3, $.session.user);
	pStmt.executeUpdate();
	pStmt.close();
}



