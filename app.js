const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const jsonDBName = "myjsondb.json";
const RESTAPIRoot = "/rest";

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/static", express.static("frontend/static"));

app.listen(3000, () => {
	console.log("Server running on port 3000");
});

app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname + "/frontend/index.html"));
});

app.post(RESTAPIRoot + "/contact", function (request, response) {

  	console.log("Incoming POST contact/: ", request.body);

  	fs.readFile(jsonDBName, "utf8", function readFileCallback(err, data) {
    	if (err) {
    		// Could not open the db file
        	console.log(err);
    	} else {

    		// Read the file content - it's a JSON string and it needs to be parsed
    		let dbContentObj = JSON.parse(data);

    		// Generate a random ID for our new db entry
    		let newId = uuidv4();
				console.log(newId);
    		// Append the new entry to the content
    		dbContentObj.documents.push({id: newId, data: request.body});
    		var dbContentJSON = JSON.stringify(dbContentObj);

    		// Write to db file - async mode
    		fs.writeFile(jsonDBName, dbContentJSON, function(err) {
    			if (err) {
    				// Could not write to db file
        			return console.log(err);
    			}
    			console.log("Successfully added to db!");
			});

    		// Return the response to the client
			response.setHeader("Content-Type", "application/json");

			let responseBody = request.body;
			responseBody.id = newId;

			// The response must be JSON encoded
  			response.end(JSON.stringify(responseBody));
		}
	});
})

// GET route: /contact (used to get the items)
app.get(RESTAPIRoot + "/contact" + "/visitors", function(request, response) {

	/*
	 * Log the incoming request for debugging
	 * Because it's a GET we don't have a body but only query params
	 * ex. query params like filters, pagination, etc.
	 */
  	console.log("Incoming GET contact visitors/: ", request.query);

  	// Simply return all the documents from db file
  	fs.readFile(jsonDBName, "utf8", function readFileCallback(err, data) {
    	if (err) {
    		// Could not open the db file
        	console.log(err);
    	} else {

    		// Read the file content - it's a JSON string and it needs to be parsed
    		let dbContentObj = JSON.parse(data);

    		// Return the response to the client
			response.setHeader("Content-Type", "application/json");

			// The content of db file is already a JSON string
  			response.end(JSON.stringify(dbContentObj.documents));
		}
	});
});

app.get(RESTAPIRoot + "/contact" + "/stories", function(request, response) {

	/*
	 * Log the incoming request for debugging
	 * Because it's a GET we don't have a body but only query params
	 * ex. query params like filters, pagination, etc.
	 */
  	console.log("Incoming GET contact stories/: ", request.query);

  	// Simply return all the documents from db file
  	fs.readFile(jsonDBName, "utf8", function readFileCallback(err, data) {
    	if (err) {
    		// Could not open the db file
        	console.log(err);
    	} else {

    		// Read the file content - it's a JSON string and it needs to be parsed
    		let dbContentObj = JSON.parse(data);

    		// Return the response to the client
			response.setHeader("Content-Type", "application/json");

			// The content of db file is already a JSON string
  			response.end(JSON.stringify(dbContentObj.documents));
		}
	});
});

app.get(RESTAPIRoot + "/contact" + "/stories" + "/city/:cityName", function(request, response) {
	console.log("Incoming GET contact stories/<cityName>: ", request.params);

	let findCityName = request.params.cityName;
	// Read the db file and try to find the document with the id=<contactId>
	fs.readFile(jsonDBName, "utf8", function readFileCallback(err, data) {
		if (err) {
			// Could not open the db file
				console.log(err);
		} else {

			// Read the file content - it's a JSON string and it needs to be parsed
			let dbContentObj = JSON.parse(data);
      let dbContentCity = [];
			// Return the response to the client
      // doesn t populate and todo : send more objects
			for (let i=0; i < dbContentObj.documents.length ;i++) {
				if (dbContentObj.documents[i].data.city == findCityName) {
					console.log(i)
					// Stop the loop and simply return the document
					dbContentCity.push(dbContentObj.documents[i]);
				}
			}

			if (dbContentCity.length != 0) {
				response.setHeader("Content-Type", "application/json");
				response.end(JSON.stringify(dbContentCity));
				console.log(dbContentCity)
				return;
			}

			// The document was not found, return a 404 HTTP Error
			let errorResponse = {
				code: "invalid_city_name",
				message: "This city name is invalid (custom app error)"
			};

			response.setHeader("Content-Type", "application/json");
			response.status(404);
			response.end(JSON.stringify(errorResponse));
	}
	});

});
