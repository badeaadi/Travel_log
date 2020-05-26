const BaseAPIPath = 'http://localhost:3000/rest';
const ContactAPIPath = "/contact";

function processForm(event) {

	event.preventDefault();

	// in this object we keep the data that will be sent to backend
	let data = {};

	// get values from formular
	data['firstName'] = document.getElementById("firstName").value;
	data['lastName'] = document.getElementById("lastName").value;
	data['story'] = document.getElementById("story").value;

	let cityOps = document.getElementById("city");
	data['city'] = cityOps.options[cityOps.selectedIndex].value;

	// debugging: print the collected data as object in browser's console
	console.log(data);
	//TODO am ramas aici
	// debugging: print the collected data as JSON string in browser's console
	console.log(JSON.stringify(data));

	let fullAPIPath = BaseAPIPath + ContactAPIPath;
	let httpPromise = fetch(fullAPIPath, {
    	method: 'POST',
    	body: JSON.stringify(data),
    	headers: {
        	'Content-Type': 'application/json',
        	'Accept': 'application/json'
    	}
	});

    httpPromise.then(function(response) {
    	// log the response from backend for debugging
    	console.log(response);

  		// show a simple alert
  		if (response.ok) {
  			// the status code is 200
  			alert("Contact successfully created!");
  		} else {
  			alert("Error: contact could not be created.");
  		}
    });

	return false;
}

function getVisitors () {

	let GetVis = "/visitors";
	let fullAPIPath = BaseAPIPath + ContactAPIPath + GetVis + "?page=1&perPage=20";
	let httpPromise = fetch(fullAPIPath, {
    	method: 'GET',
    	headers: {
        	'Content-Type': 'application/json',
        	'Accept': 'application/json'
    	}
	});

    httpPromise.then(function(response) {
    	// log the response from backend for debugging
    	console.log(response);

    	// handle the response from backend
    	response.json().then(data => {
  			populateVisitorsTable(data);
		});

  		// show a simple alert
  		if (response.ok) {
  			// the status code is 200
  			alert("Contacts successfully read!");
  		} else {
  			alert("Error: contact could not be created.");
  		}
    });

	return false;
}

function getStories () {

	let GetStory = "/stories";
	let fullAPIPath = BaseAPIPath + ContactAPIPath + GetStory + "?page=1&perPage=20";
	let httpPromise = fetch(fullAPIPath, {
    	method: 'GET',
    	headers: {
        	'Content-Type': 'application/json',
        	'Accept': 'application/json'
    	}
	});

    httpPromise.then(function(response) {
    	// log the response from backend for debugging
    	console.log(response);

    	// handle the response from backend
    	response.json().then(data => {
				console.log(data);
  			populateStoriesTable(data);
		});

  		// show a simple alert
  		if (response.ok) {
  			// the status code is 200
  			alert("Contacts successfully read!");
  		} else {
  			alert("Error: contact could not be created.");
  		}
    });

	return false;
}

function getStoriesByCity () {

	let cityOps = document.getElementById("get_city");
	selCity = cityOps.options[cityOps.selectedIndex].value;

	let GetStory = "/stories";
	let GetCity = "/city/" + selCity;
	let fullAPIPath = BaseAPIPath + ContactAPIPath + GetStory + GetCity;
	let httpPromise = fetch(fullAPIPath, {
    	method: 'GET',
    	headers: {
        	'Content-Type': 'application/json',
        	'Accept': 'application/json'
    	}
	});

    httpPromise.then(function(response) {
    	// log the response from backend for debugging
    	console.log(response);

    	// handle the response from backend
    	response.json().then(data => {
  			populateStoriesTable(data);
		});

  		// show a simple alert
  		if (response.ok) {
  			// the status code is 200
  			alert("Contacts successfully read!");
  		} else {
  			alert("Error: contact could not be created.");
  		}
    });

	return false;
}


function populateVisitorsTable(documents) {
	console.log(documents);

	let itemsTable = document.getElementById('visitorsList');
	let tableHeaderRowCount = 1;

	let rowCount = itemsTable.rows.length;
	for (let i = tableHeaderRowCount; i < rowCount; i++) {
	    itemsTable.deleteRow(tableHeaderRowCount);
	}
	
	for (let i=0; i < documents.length ;i++) {

		let newRow = itemsTable.insertRow(i+1);
		let item1 = newRow.insertCell(0);
		let item2 = newRow.insertCell(1);
		let item3 = newRow.insertCell(2);

		item1.innerHTML = documents[i].data.firstName;
		item2.innerHTML = documents[i].data.lastName;
		item3.innerHTML = documents[i].data.city;
	}
}

function populateStoriesTable(documents) {
	console.log(documents);

	let itemsTable = document.getElementById('storyList');
	let tableHeaderRowCount = 1;

	let rowCount = itemsTable.rows.length;
	for (let i = tableHeaderRowCount; i < rowCount; i++) {
	    itemsTable.deleteRow(tableHeaderRowCount);
	}

	for (let i=0; i < documents.length; i++) {
		let newRow = itemsTable.insertRow(i+1);

		let item1 = newRow.insertCell(0);
		let item2 = newRow.insertCell(1);

		item1.innerHTML = documents[i].data.city;
		item2.innerHTML = documents[i].data.story;
	}
}
