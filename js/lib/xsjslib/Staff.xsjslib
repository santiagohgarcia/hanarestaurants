/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);

	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(
		(SELECT (IFNULL(MAX("StaffId"), 0) + 1) as "StaffId" FROM "restaurants.db::RestaurantsContext.Staff"),?,?,?,?)`
	);
	pStmt.setString(1, newObject.Name);
	pStmt.setString(2, newObject.LastName);
	pStmt.setString(3, newObject.UserId);
	pStmt.setString(4, $.session.user);

	pStmt.executeUpdate();
	pStmt.close();

	var createUserStmt = param.connection.prepareCall(`CALL "restaurants.db.procedures::CreateStaffUser"(I_USERNAME => ?)`);
	createUserStmt.setString(1, newObject.UserId);
	createUserStmt.execute();
	createUserStmt.close();

}