var conn = $.db.getConnection();
var headers = $.request.headers;
var data = $.request.body;

var pstmt = conn.prepareStatement(
	`INSERT INTO "restaurants.db::RestaurantsContext.ProductImage" 
		VALUES( ?, (SELECT (IFNULL(MAX("ImageId"), 0) + 1) FROM "restaurants.db::RestaurantsContext.ProductImage"  ),?,	?, ?)`
);

pstmt.setInteger(1, Number(headers.get("productid")));
pstmt.setString(2, headers.get("filename"));
pstmt.setInteger(3, 0);
pstmt.setBlob(4, data.asArrayBuffer());

pstmt.execute();

conn.commit();
conn.close();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({}));