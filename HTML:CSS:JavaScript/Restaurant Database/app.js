/* E3 app.js */
'use strict';

const log = console.log

const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time') 

const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array

const months = ["January", "February", "March", "April", "May", "June", "July", 
"August", "September", "October", "November", "December"]
const prefix_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
"Aug", "Sep", "Oct", "Nov", "December"]

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	
	if (rest.length > 0) {
		/* complete */ 
		log("Added restaurant " + rest[0]['name'] + ".")
	} 

	else {
		/* complete */ 
		log("Duplicate restaurant not added.")
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	const resv_time = resv['time']
	let resv_hour = resv_time.getHours()
	let part_of_day = null

	if (resv_hour >= 12) {
		part_of_day = "p.m."

		if (resv_hour > 12) {
			resv_hour -= 12
		}
	}

	else {

		if (resv_hour == 0) {
			resv_hour = 12
		}
		part_of_day = "a.m."
	}

	let resv_minute = resv_time.getMinutes()

	if (resv_minute == 0) {
		resv_minute = "00"
	}
	log("Added reservation at " + resv['restaurant'] + " on " 
		+ months[resv_time.getMonth()] + " " + resv_time.getDate() + " " 
		+ resv_time.getFullYear() + " at " + resv_hour + ":" 
		+ resv_minute +  " " + part_of_day + " for " 
		+ resv['people'] + " people.")
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	// Produce output below
	let i = 0

	for (i = 0; i < restaurants.length; i++) {
		let curr_restaurant = restaurants[i]
		let single_or_plural = " active reservations"

		if (curr_restaurant['numReservations'] == 1) {
			single_or_plural = " active reservation"
		}
		log(curr_restaurant['name'] + ": " + curr_restaurant['description'] 
			+ " - " + curr_restaurant['numReservations'] + single_or_plural)
	}
}

if ('restInfo' in yargs_argv) {
	const restaurant = reservations.getRestaurantByName(yargs_argv['restInfo']);
	
	// Produce output below
	let single_or_plural = " active reservations"

	if (restaurant['numReservations'] == 1) {
		single_or_plural = " active reservation"
	}
	log(restaurant['name'] + ": " + restaurant['description'] + " - " 
		+ restaurant['numReservations'] + single_or_plural)
}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below
	log("Reservations for " + restaurantName + ":")
	let i = 0

	for (i = 0; i < reservationsForRestaurant.length; i++) {
		const resv_time = new Date(reservationsForRestaurant[i]['time'])
		const resv_month = prefix_months[resv_time.getMonth()]
		const resv_day = resv_time.getDate()
		const resv_year = resv_time.getFullYear()
		let resv_hour = resv_time.getHours()
		let part_of_day = null

		if (resv_hour >= 12) {
			part_of_day = "p.m."

			if (resv_hour > 12) {
				resv_hour -= 12
			}
		}

		else {

			if (resv_hour == 0) {
				resv_hour = 12
			}
			part_of_day = "a.m."
		}
		let resv_minute = resv_time.getMinutes()

		if (resv_minute == 0) {
			resv_minute = "00"
		}
		const number_of_people = reservationsForRestaurant[i]['people']
		log("- " + resv_month + " " + resv_day + " " + resv_year + ", " 
			+ resv_hour + ":" + resv_minute + " " + part_of_day 
			+ ", table for " + number_of_people)
	}
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForHour = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
	log("Reservations in the next hour:")
	let i = 0

	for (i = 0; i < reservationsForHour.length; i++) {
		const resv_restaurant = reservationsForHour[i]['restaurant']
		const resv_time = new Date(reservationsForHour[i]['time'])
		const resv_month = prefix_months[resv_time.getMonth()]
		const resv_day = resv_time.getDate()
		const resv_year = resv_time.getFullYear()
		let resv_hour = resv_time.getHours()
		let part_of_day = null

		if (resv_hour >= 12) {
			part_of_day = "p.m."

			if (resv_hour > 12) {
				resv_hour -= 12
			}
		}

		else {

			if (resv_hour == 0) {
				resv_hour = 12
			}
			part_of_day = "a.m."
		}
		let resv_minute = resv_time.getMinutes()

		if (resv_minute == 0) {
			resv_minute = "00"
		}
		const number_of_people = reservationsForHour[i]['people']
		log("- " + resv_restaurant + ": " + resv_month + " " + resv_day + " " 
			+ resv_year + ", " + resv_hour + ":" + resv_minute + " " 
			+ part_of_day + ", table for " + number_of_people)
	}
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	
	// Produce output below
	const resv_restaurant = earliestReservation['restaurant']
	const resv_time = new Date(earliestReservation['time'])
	const resv_month = prefix_months[resv_time.getMonth()]
	const resv_day = resv_time.getDate()
	const resv_year = resv_time.getFullYear()
	let resv_hour = resv_time.getHours()
	let part_of_day = null

	if (resv_hour >= 12) {
		part_of_day = "p.m."

		if (resv_hour > 12) {
			resv_hour -= 12
		}
	}

	else {

		if (resv_hour == 0) {
			resv_hour = 12
		}
		part_of_day = "a.m."
	}
	let resv_minute = resv_time.getMinutes()

	if (resv_minute == 0) {
		resv_minute = "00"
	}
	const number_of_people = earliestReservation['people']
	log("Checked off reservation on " + resv_month + " " + resv_day + " " 
		+ resv_year + ", " + resv_hour + ":" + resv_minute + " " 
		+ part_of_day + ", table for " + number_of_people)
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	log("Reservations for " + args[0] + ":")
	let i = 0

	for (i = 0; i < resv.length; i++) {
		const resv_time = new Date(resv[i]['time'])
		const resv_month = prefix_months[resv_time.getMonth()]
		const resv_day = resv_time.getDate()
		const resv_year = resv_time.getFullYear()
		let resv_hour = resv_time.getHours()
		let part_of_day = null

		if (resv_hour >= 12) {
			part_of_day = "p.m."

			if (resv_hour > 12) {
				resv_hour -= 12
			}
		}

		else {

			if (resv_hour == 0) {
				resv_hour = 12
			}
			part_of_day = "a.m."
		}
		let resv_minute = resv_time.getMinutes()

		 if (resv_minute == 0) {
		 	resv_minute = "00"
		 }
		const number_of_people = resv[i]['people']
		log("- " + resv_month + " " + resv_day + " " + resv_year + ", " 
			+ resv_hour + ":" + resv_minute + " " + part_of_day 
			+ ", table for " + number_of_people)
	}
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
	log("Number of restaurants: " + status['numRestaurants'])
	log("Number of total reservations: " + status['totalReservations'])
	log("Busiest restaurant: " + status['currentBusiestRestaurantName'])
	const start_time = new Date(status['systemStartTime'])
	const start_month = prefix_months[start_time.getMonth()]
	const start_day = start_time.getDate()
	const start_year = start_time.getFullYear()
	let start_hour = start_time.getHours()
	let part_of_day = null

	if (start_hour >= 12) {
		part_of_day = "p.m."

		if (start_hour > 12) {
			start_hour -= 12
		}
	}

	else {
		part_of_day = "a.m."
	}
	const start_minute = start_time.getMinutes()
	log("System started at: " + start_month + " " + start_day + ", " 
		+ start_year + ", " + start_hour + ":" + start_minute + " " 
		+ part_of_day)
}