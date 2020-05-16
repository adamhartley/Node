# HTML Templates Module
The HTML Templates module demonstrates the use of several templating engines, including: Pug, Handlebars, and EJS.

 Application configuration of the templating engines is done through `app.js`. The application is currently configured to
 use the EJS templating engine, however, other engines can be initialized and used by following the comments in `app.js`.
 
 All template files (Pug, Handlebars, and EJS) are located under `/views`. The idea was to experiment with the different templating
 engines, with each producing the same result when viewed from the browser.
 
 ## Getting started
 1. `cd` to the root of the module (`/html-templates`)
 2. `npm install`
 3. `npm start`
 4. Go to `localhost:3000` in the browser
 5. To change templating engines, follow the comments in `app.js`  