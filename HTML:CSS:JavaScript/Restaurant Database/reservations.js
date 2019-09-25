/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status, null, 4))
	}

	return status;
}

/*********/


// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')

	return JSON.parse(status)
}

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	/* Add your code below */
	const current_status = getSystemStatus()
	const numRestaurants = getAllRestaurants().length
	const numReservations = getAllReservations().length
	const restaurants = getAllRestaurants()
	let busiest_restaurant = restaurants[0]
	let i = 0

	for (i = 0; i < restaurants.length; i++) {

		if (restaurants[i]['numReservations'] > busiest_restaurant['numReservations']) {
			busiest_restaurant = restaurants[i]
		}
	}
	const status = {
		numRestaurants: numRestaurants,
		totalReservations: numReservations,
		currentBusiestRestaurantName: busiest_restaurant['name'],
		systemStartTime: current_status['systemStartTime'],
	}
	fs.writeFileSync('status.json', JSON.stringify(status, null, 4))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants, null, 4))
	updateSystemStatus()
};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync('reservations.json', JSON.stringify(reservations, null, 4))
	updateSystemStatus()
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
	// Check for duplicate names
	const restaurants = []
	const restaurants_on_file = getAllRestaurants()
	let duplicate = 0
	let i = 0

	for (i = 0; i < restaurants_on_file.length; i++) {

		if (restaurants_on_file[i]['name'] == name) {
			duplicate = 1
			break
		}
	}

	if (duplicate == 0) {
		const restaurant = {
			name: name,
			description: description,
			numReservations: 0
		}
		restaurants_on_file.push(restaurant)
		saveRestaurantsToJSONFile(restaurants_on_file)
		restaurants.push(restaurant)
	}

	return restaurants
}

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	const reservation = {
		restaurant: restaurant,
		time: new Date(time),
		people: people
	}
	const reservations = getAllReservations()
	reservations.push(reservation)
	saveReservationsToJSONFile(reservations)
	const restaurants = getAllRestaurants()
	let i = 0

	for (i = 0; i < restaurants.length; i++) {

		if (restaurants[i]['name'] == restaurant) {
			restaurants[i]['numReservations']++
			break
		}
	}
	saveRestaurantsToJSONFile(restaurants)

	return reservation;
}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	if (!fs.existsSync('restaurants.json')) {
		return []
	}

	const restaurants_file = fs.readFileSync('restaurants.json')
	return JSON.parse(restaurants_file)

};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
	/* Add your code below */
	let restaurant = {}
	const restaurants = getAllRestaurants()
	let i = 0

	for (i = 0; i < restaurants.length; i++) {

		if (restaurants[i]['name'] == name) {
			restaurant = restaurants[i]
			break
		}
	}

	return restaurant
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
  if (!fs.existsSync('reservations.json')) {
		return []
	}

	const reservations_file = fs.readFileSync('reservations.json')
	return JSON.parse(reservations_file)

};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	const all_reservations = getAllReservations()
	const restaurant_reservations = []
	let i = 0

	for (i = 0; i < all_reservations.length; i++) {

		if (all_reservations[i]['restaurant'] == name) {
			restaurant_reservations.push(all_reservations[i])
		}
	}

	restaurant_reservations.sort(function(first, second) {
		var time1 = new Date(first.time);
		var time2 = new Date(second.time);

		if (time1 < time2) {
			return -1
		}

		if (time2 < time1) {
			return 1
		}

		return 0
	})

	return restaurant_reservations
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	const all_reservations = getAllReservations()
	const hour_reservations = []
	const one_hour = 60 * 60 * 1000
	const comparison_time = new Date(time)
	let i = 0

	for (i = 0; i < all_reservations.length; i++) {

		if (((new Date(all_reservations[i]['time']) - comparison_time) < one_hour) 
			&& ((new Date(all_reservations[i]['time']) - comparison_time) >= 0)) {
			hour_reservations.push(all_reservations[i])
		}
	}

	hour_reservations.sort(function(first, second) {
		var time1 = new Date(first.time);
		var time2 = new Date(second.time);

		if (time1 < time2) {
			return -1
		}

		if (time2 < time1) {
			return 1
		}

		return 0
	})

	return hour_reservations
}

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {
	
	const reservations = getAllReservations()
	reservations.sort(function(first, second) {
		var time1 = new Date(first.time);
		var time2 = new Date(second.time);

		if (time1 < time2) {
			return -1
		}

		if (time2 < time1) {
			return 1
		}

		return 0
	})
	let reservation = null
	let i = 0

	for (i = 0; i < reservations.length; i++) {

		if (reservations[i]['restaurant'] == restaurantName) {
			reservation = reservations[i]
			break
		}
	}
	reservations.splice(reservations.indexOf(reservation), 1)
	saveReservationsToJSONFile(reservations)

	const restaurants = getAllRestaurants()
	
	for (i = 0; i < restaurants.length; i++) {

		if (restaurants[i]['name'] == restaurantName) {
			restaurants[i]['numReservations']--
		}
	}
	saveRestaurantsToJSONFile(restaurants)
 	
 	return reservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method
	const all_reservations = getAllReservations()
	const restaurant_reservations = []
	let i = 0

	for (i = 0; i < all_reservations.length; i++) {

		if (all_reservations[i]['restaurant'] == restaurant) {
			const curr_time = new Date(all_reservations[i]['time'])
			curr_time.setTime(curr_time.getTime() + (minutes * 60 * 1000))
			all_reservations[i]['time'] = curr_time
			restaurant_reservations.push(all_reservations[i])
		}
	}
	saveReservationsToJSONFile(all_reservations)

	return restaurant_reservations
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}

