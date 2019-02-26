/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}"
		("RestaurantId","RestaurantOrderId","Status.StatusId","Customer.CustomerId","ModifiedAt")
		values (?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	//pStmt.setInteger(2, newObject.RestaurantTableId || 0);
	pStmt.setInteger(2, newObject.RestaurantOrderId);
	pStmt.setString(3, newObject["Status.StatusId"] || 'PENDING'); //In Preparation 
	pStmt.setInteger(4, newObject["Customer.CustomerId"] || 0); //Anonym
	pStmt.setTimestamp(5, new Date());
	pStmt.executeUpdate();
	pStmt.close();
}