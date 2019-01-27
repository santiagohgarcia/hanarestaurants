 var conn = $.db.getConnection();
 var productId = $.request.parameters.get("ProductId");
 var imageId = $.request.parameters.get("ImageId");

 var pstmt = conn.prepareStatement(
 	`SELECT "Image" FROM "restaurants.db::RestaurantsContext.ProductImage"  
    					where "ProductId"=${productId} and "ImageId"=${imageId}`
 );

 var userImageResult = pstmt.executeQuery();

 if (userImageResult.next()) { // User Image retrieved
 	$.response.setBody(userImageResult.getBlob(1));
 }

 $.response.contentType = "image/jpeg";
 $.response.status = $.net.http.OK;