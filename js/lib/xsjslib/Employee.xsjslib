/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(?,(SELECT IFNULL(MAX("EmployeeId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.Employee"),?,?,?)`
	);
	pStmt.setInteger(1, newObject["Restaurant.RestaurantId"]);
	pStmt.setString(2, newObject.Name);
	pStmt.setString(3, newObject.LastName);
	pStmt.setString(4, newObject.UserId || "");

	pStmt.executeUpdate();
	pStmt.close();
}