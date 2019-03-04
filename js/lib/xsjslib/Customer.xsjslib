/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function Create(param) {
	var customer = utils.getNewObject(param);

	var getCustomerStmt = param.connection.prepareStatement(
		`SELECT * FROM "restaurants.db::RestaurantsContext.Customer" WHERE "CustomerId" = ?`
	);
	getCustomerStmt.setString(1, customer.CustomerId);
	var customerResult = getCustomerStmt.executeQuery();

	var createOrUpdateCustomerStmt;
	if (!customerResult.next()) {
		createOrUpdateCustomerStmt = param.connection.prepareStatement(
			`INSERT INTO "restaurants.db::RestaurantsContext.Customer" VALUES(?,?,?,?)`);
		createOrUpdateCustomerStmt.setString(1, customer.CustomerId);
		createOrUpdateCustomerStmt.setString(2, customer.Name);
		createOrUpdateCustomerStmt.setString(3, customer.ImageUrl);
		if (customer.MessagingToken) {
			createOrUpdateCustomerStmt.setString(4, customer.MessagingToken);
		} else {
			createOrUpdateCustomerStmt.setNull(4, null);
		}

	} else {
		var oldCustomer = customerResult._row;
		customer.MessagingToken = customer.MessagingToken || oldCustomer.MessagingToken;
		createOrUpdateCustomerStmt = param.connection.prepareStatement(
			`UPDATE "restaurants.db::RestaurantsContext.Customer" 
						SET "Name" = ?,
							"ImageUrl" = ?,
							"MessagingToken" = ? 
						WHERE "CustomerId" = ?`
		);
		createOrUpdateCustomerStmt.setString(1, customer.Name);
		createOrUpdateCustomerStmt.setString(2, customer.ImageUrl);
		if (customer.MessagingToken) {
			createOrUpdateCustomerStmt.setString(3, customer.MessagingToken);
		} else {
			createOrUpdateCustomerStmt.setNull(3, null);
		}
		createOrUpdateCustomerStmt.setString(4, customer.CustomerId);
	}

	createOrUpdateCustomerStmt.executeUpdate();
	createOrUpdateCustomerStmt.close();
}