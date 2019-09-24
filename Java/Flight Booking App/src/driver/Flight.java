package driver;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Flight implements Serializable {
	
	private String number;
	private String departureDateTime;
	private String arrivalDateTime;
	private String airline;
	private String origin;
	private String destination;
	private String price;
	private String numSeats;
	private List<Flight> nextPossibleFlights;
	
	public Flight(String number, String departureDateTime,
			String arrivalDateTime, String airline, String origin,
			String destination, String price, String numSeats) {
		super();
		this.number = number;
		this.departureDateTime = departureDateTime;
		this.arrivalDateTime = arrivalDateTime;
		this.setAirline(airline);
		this.origin = origin;
		this.destination = destination;
		this.price = price;
		this.numSeats = numSeats;
		this.setNextPossibleFlights(new ArrayList<Flight>());
	}
	
	public String getNumber() {
		return number;
	}
	
	public void setNumber(String number) {
		this.number = number;
	}
	
	public String getDepartureDateTime() {
		return departureDateTime;
	}
	
	public void setDepartureDateTime(String departureDateTime) {
		this.departureDateTime = departureDateTime;
	}
	
	public String getArrivalDateTime() {
		return arrivalDateTime;
	}
	
	public void setArrivalDateTime(String arrivalDateTime) {
		this.arrivalDateTime = arrivalDateTime;
	}
	
	public String getOrigin() {
		return origin;
	}
	
	public void setOrigin(String origin) {
		this.origin = origin;
	}
	
	public String getDestination() {
		return destination;
	}
	
	public void setDestination(String destination) {
		this.destination = destination;
	}
	
	public String getPrice() {
		return price;
	}
	
	public void setPrice(String price) {
		this.price = price;
	}
	
	public String getNumSeats() {
		return numSeats;
	}
	
	public void setNumSeats(String numSeats) {
		this.numSeats = numSeats;
	}

	public List<Flight> getNextPossibleFlights() {
		return nextPossibleFlights;
	}

	public void setNextPossibleFlights(List<Flight> nextPossibleFlights) {
		this.nextPossibleFlights = nextPossibleFlights;
	}

	public String getAirline() {
		return airline;
	}

	public void setAirline(String airline) {
		this.airline = airline;
	}
	
	public boolean equals(Flight other) {
		return getNumber().equals(other.getNumber());
	}
	
	public String toString() {
		return number + "," + departureDateTime + "," + arrivalDateTime + ","
	+ airline + "," + origin + "," + destination + "," + price;
	}
}