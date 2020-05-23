# Node.js Shop

This Node.js application is a sample online merchant. The store allows for administrator users to add, edit, and deleted products. Products
are one of the core entities of the application, and are comprised of: a title, image, price and description. 

All users can 'shop', browsing, adding and removing products from their cart, etc.

This application is constructed following the MVC architectural pattern. Package names clearly define the functionality of the files contained within.

## Models
### Product
A Product is one of the core entities of the application, and are comprised of: a title, image, price and description. A product can be added
or removed from a cart. Administrators are allowed CRUD operations on a product; enabling them to create, updated, or delete a product from 
the application.  
### Cart
A Cart is a container for which users can add or remove products. Products contained within a cart can be purchased.

## Views
Views in the application are built using Express. A 'templating' approach was taken where possible, in order to promote code reusability and 
to reduce duplicate code between views. The reusable templates can be found in the `includes` package.

## Controllers
All controllers are located within the `controllers` package, where incoming requests are passed along to the appropriate model functions for
processing.

## Routes
All available endpoints are defined in the `routes` package. Routes meant only for administrator users can be found within the `admin.js` 
file. Routes available to all users can be found within the `shop.js` file. 