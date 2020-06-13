# Node.js Shop

This Node.js application is a sample online merchant. The store allows for administrator users to add, edit, and deleted products. Products
are one of the core entities of the application, and are comprised of: a title, image, price and description. 

All users can 'shop', browsing, adding and removing products from their cart, etc. Users can browse through the products, and view product details.
Users can then create orders based on the items which have been added to the cart.

This application is constructed following the MVC architectural pattern. Package names clearly define the functionality of the files contained within.

## Getting Started
In the application root directory, a docker compose file has been configured to startup containers for MySQL and Mongo databases. Before
starting the application:
1. `cd main-app` 
2. `docker-compose up -d` 

The docker containers should now be running, and can be verified by running:

`docker ps`

Check to see that two containers are running: `mysql_container` and `mongodb_container`

To start the application, run: `npm start`

If this is the first time you have run this application, you may need to run `npm install` prior to starting the application.
## Models
### Product
A Product is one of the core entities of the application, and are comprised of: a title, image, price and description. A product can be added
or removed from a cart. Administrators are allowed CRUD operations on a product; enabling them to create, updated, or delete a product from 
the application.  
### Cart
A Cart is a container for which users can add or remove products. Products contained within a cart can be purchased.
### Cart Item
A Cart contains items. Items contained within a cart have a quantity.
### Order
An order is created based on the items which exist in a cart. Once a user has finished adding items to a cart, an order can be created which
is made up of the cart items.
### Order Item
The individual items of an order.

## Views
Views in the application are built using Express. A 'templating' approach was taken where possible, in order to promote code reusability and 
to reduce duplicate code between views. The reusable templates can be found in the `includes` package.

## Controllers
All controllers are located within the `controllers` package, where incoming requests are passed along to the appropriate model functions for
processing.

## Routes
All available endpoints are defined in the `routes` package. Routes meant only for administrator users can be found within the `admin.js` 
file. Routes available to all users can be found within the `shop.js` file. 

In order to experiment/showcase different datastores, routes are divided into two distinct paths: relational (located in `routes`), and NoSQL
(located in `routes/reporting`). All route files located within `routes/reporting` utilize a NoSQL (MongoDB). Several approaches are demonstrated
here. One using a querying approach utilizing native MongoDB syntax, and a second using the Mongoose ODM library. All routes using Mongoose
can be found uner `routes/reporting/mongoose`.

## Authentication
Session information is handled and stored utilizing `express-session` and `connect-mongodb-session` libraries. Errors messages encountered
during authentication are flashed to the UI, utilizing the `connect-flash` library.