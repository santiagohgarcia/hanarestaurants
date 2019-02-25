var conn = $.db.getConnection();

var stStaffId = conn.prepareStatement(
	`SELECT (IFNULL(MAX("StaffId"), 0) + 1) as "StaffId" 
		FROM "restaurants.db::RestaurantsContext.Staff"`
);
var resultSet = stStaffId.executeQuery();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	StaffId: resultSet._rows[0].StaffId
}));