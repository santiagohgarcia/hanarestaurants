/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");
var messaging = $.import("xsjslib", "messaging");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}"
		("RestaurantId","RestaurantOrderId","Status.StatusId","Customer.CustomerId","CreatedAt","PaymentMethod.PaymentMethodId")
		values (?,?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	//pStmt.setInteger(2, newObject.RestaurantTableId || 0);
	pStmt.setInteger(2, newObject.RestaurantOrderId);
	pStmt.setString(3, newObject["Status.StatusId"] || 'PENDING'); //PENDING

	if (newObject["Customer.CustomerId"]) {
		pStmt.setString(4, newObject["Customer.CustomerId"]);
	} else {
		pStmt.setNull(4, null); //Anonym
	}

	pStmt.setTimestamp(5, new Date());
	pStmt.setString(6, newObject["PaymentMethod.PaymentMethodId"] || 'CASH'); //CASH
	pStmt.executeUpdate();
	pStmt.close();
}

function AfterCreateOrModif(param) {
	var newOrder = utils.getNewObject(param);
	var oldOrder = utils.getOldObject(param);
	var customerId = newOrder["Customer.CustomerId"];
	var title, body, action, icon;

	//Send message to customer if the order is ready
	if (customerId) {
		var getCustomerStmt = param.connection.prepareStatement(
			`SELECT * FROM "restaurants.db::RestaurantsContext.Customer" WHERE "CustomerId" = ?`
		);
		getCustomerStmt.setString(1, customerId);

		var customerResult = getCustomerStmt.executeQuery();
		customerResult.next();
		var customer = customerResult._row;

		if (newOrder && !oldOrder) {
			action = "CREATED";
			title = `Order #(${newOrder.RestaurantOrderId}) created!`;
			body = `Check your notifications to know when the order is ready!`;
			icon = `/img/pending.png`;
		} else if (newOrder["Status.StatusId"] === "READY") {
			action = "READY";
			title = `Order #(${newOrder.RestaurantOrderId}) ready!`;
			body = `You can pick your order now! Enjoy!`;
			icon = `/img/pending.png`;
		}

		var message = {
			message: {
				token: customer.MessagingToken,
			/*	notification: {
					title: title,
					body: body
				},*/
				data: {
					action: action,
					RestaurantOrderId: String(newOrder.RestaurantOrderId)
				}
			}
		};

		messaging.sendFcmMessage(message);
	}
}