package driver;

import java.io.Serializable;
import java.util.List;

public abstract class User implements Serializable {
	
	private ApplicationManager manager;
	
	public User() {
		this.manager = new ApplicationManager();
	}

	public ApplicationManager getManager() {
		return manager;
	}
	
	public List<Flight> searchAvailableFlights(String departureDate,
			String origin, String destination) {
		return getManager().searchAvailableFlights(departureDate, origin,
				destination);
	}
	
	public List<Itinerary> searchAvailableItineraries(String departureDate,
			String origin, String destination) {
		return getManager().searchAvailableItineraries(departureDate, origin,
				destination);
	}
	
	public List<Itinerary> searchAvailableItinerariesSortedByTime
	(String departureDate, String origin, String destination) {
		return getManager().searchAvailableItinerariesSortedByTime
				(departureDate, origin, destination);
	}
	
	public List<Itinerary> searchAvailableItinerariesSortedByCost
	(String departureDate, String origin, String destination) {
		return getManager().searchAvailableItinerariesSortedByCost
				(departureDate, origin, destination);
	}
	
	public String searchAvailableFlightsAsString(String departureDate,
			String origin, String destination) {
		String result = "";
		int count = searchAvailableFlights(departureDate, origin, destination)
				.size();
		
		for (Flight flight : searchAvailableFlights(departureDate, origin,
				destination)) {
			
			if (count != 1) {
				result += flight.toString() + "\n";
				count -= 1;
			}
			
			else {
				result += flight.toString();
			}
		}
		
		return result;
	}
	
	public String searchAvailableItinerariesAsString(String departureDate,
			String origin, String destination) {
		String result = "";
		int count = searchAvailableItineraries(departureDate, origin, destination).size();
		
		for (Itinerary itinerary : searchAvailableItineraries(departureDate,
				origin, destination)) {
			
			for (Flight flight : itinerary.getListOfFlights()) {
				result += flight.getNumber() + ","
			+ flight.getDepartureDateTime() + "," + flight.getArrivalDateTime()
			+ "," + flight.getAirline() + "," + flight.getOrigin() + ","
			+ flight.getDestination() + "\n";
			}
			result += itinerary.getTotalPrice() + "\n";
			
			if (count != 1) {
				result += itinerary.getTotalTime() + "\n";
				count -= 1;
			}
			
			else {
				result += itinerary.getTotalTime();
			}
		}
		
		return result;
	}
	
	public String searchAvailableItinerariesSortedByTimeAsString(String departureDate,
			String origin, String destination) {
		String result = "";
		int count = searchAvailableItinerariesSortedByTime(departureDate,
				origin, destination).size();
		
		for (Itinerary itinerary : searchAvailableItinerariesSortedByTime
				(departureDate, origin, destination)) {
			
			for (Flight flight : itinerary.getListOfFlights()) {
				result += flight.getNumber() + ","
			+ flight.getDepartureDateTime() + "," + flight.getArrivalDateTime()
			+ "," + flight.getAirline() + "," + flight.getOrigin() + ","
			+ flight.getDestination() + "\n";
			}
			result += itinerary.getTotalPrice() + "\n";
			
			if (count != 1) {
				result += itinerary.getTotalTime() + "\n";
				count -= 1;
			}
			
			else {
				result += itinerary.getTotalTime();
			}
		}
		
		return result;
	}
	
	public String searchAvailableItinerariesSortedByCostAsString(String departureDate,
			String origin, String destination) {
		String result = "";
		int count = searchAvailableItinerariesSortedByCost(departureDate,
				origin, destination).size();
		
		for (Itinerary itinerary : searchAvailableItinerariesSortedByCost
				(departureDate, origin, destination)) {
			
			for (Flight flight : itinerary.getListOfFlights()) {
				result += flight.getNumber() + ","
			+ flight.getDepartureDateTime() + "," + flight.getArrivalDateTime()
			+ "," + flight.getAirline() + "," + flight.getOrigin() + ","
			+ flight.getDestination() + "\n";
			}
			result += itinerary.getTotalPrice() + "\n";
			
			if (count != 1) {
				result += itinerary.getTotalTime() + "\n";
				count -= 1;
			}
			
			else {
				result += itinerary.getTotalTime();
			}
		}
		
		return result;
	}
}