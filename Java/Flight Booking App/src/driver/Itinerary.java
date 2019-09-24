package driver;

import java.io.Serializable;
import java.text.DecimalFormat;
import java.util.List;

public class Itinerary implements Serializable {

	private static DecimalFormat decimalFormat = new DecimalFormat("0.00");
	private List<Flight> listOfFlights;
	private String departureDate;
	private String origin;
	private String destination;
	
	public Itinerary(List<Flight> listOfFlights) {
		super();
		this.listOfFlights = listOfFlights;
		this.departureDate = listOfFlights.get(0).getDepartureDateTime()
				.split(" ")[0];
		this.origin = listOfFlights.get(0).getOrigin();
		this.destination = listOfFlights.get(listOfFlights.size() - 1)
				.getDestination();
	}

	public List<Flight> getListOfFlights() {
		return listOfFlights;
	}

	public void setListOfFlights(List<Flight> listOfFlights) {
		this.listOfFlights = listOfFlights;
	}

	public String getDepartureDate() {
		return departureDate;
	}

	public void setDepartureDate(String departureDate) {
		this.departureDate = departureDate;
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
	
	public String getTotalTime() {
		int departureYear = Integer.parseInt(listOfFlights.get(0)
				.getDepartureDateTime().split(" ")[0].split("-")[0]);
		int departureMonth = Integer.parseInt(listOfFlights.get(0)
				.getDepartureDateTime().split(" ")[0].split("-")[1]);
		int departureDay = Integer.parseInt(listOfFlights.get(0)
				.getDepartureDateTime().split(" ")[0].split("-")[2]);
		int departureHour = Integer.parseInt(listOfFlights.get(0)
				.getDepartureDateTime().split(" ")[1].split(":")[0]);
		int departureMinute = Integer.parseInt(listOfFlights.get(0)
				.getDepartureDateTime().split(" ")[1].split(":")[1]);
		int arrivalYear = Integer.parseInt(listOfFlights
				.get(listOfFlights.size() - 1).getArrivalDateTime()
				.split(" ")[0].split("-")[0]);
		int arrivalMonth = Integer.parseInt(listOfFlights
				.get(listOfFlights.size() - 1).getArrivalDateTime()
				.split(" ")[0].split("-")[1]);
		int arrivalDay = Integer.parseInt(listOfFlights
				.get(listOfFlights.size() - 1).getArrivalDateTime()
				.split(" ")[0].split("-")[2]);
		int arrivalHour = Integer.parseInt(listOfFlights
				.get(listOfFlights.size() - 1).getArrivalDateTime()
				.split(" ")[1].split(":")[0]);
		int arrivalMinute = Integer.parseInt(listOfFlights
				.get(listOfFlights.size() - 1).getArrivalDateTime()
				.split(" ")[1].split(":")[1]);
		int yearDifference = arrivalYear - departureYear;
		int monthDifference = arrivalMonth - departureMonth;
		int dayDifference = arrivalDay - departureDay;
		int hourDifference = arrivalHour - departureHour;
		int minuteDifference = arrivalMinute - departureMinute;
		
		if (yearDifference == 1) {
			monthDifference += 12; 
		}
		
		if (monthDifference == 1) {
			dayDifference += departureDay;
		}
		
		if (dayDifference >= 1 && minuteDifference < 0) {
			hourDifference += 23 + (24 * (dayDifference - 1));
		}
		
		if (dayDifference >= 1 && minuteDifference >= 0) {
			hourDifference += (24 * dayDifference);
		}
		
		if (minuteDifference < 0) {
			minuteDifference += 60;
		}
		
		String hours = Integer.toString(hourDifference);
		String minutes = Integer.toString(minuteDifference);
		
		if (hours.length() < 2) {
			hours = "0" + hours;
		}
		
		if (minutes.length() < 2) {
			minutes = "0" + minutes;
		}
		
		return hours + ":" + minutes;	
	}
	
	public int getTotalTimeInMinutes() {
		int result = 0;
		int hours = Integer.parseInt(getTotalTime().split(":")[0]);
		int minutes = Integer.parseInt(getTotalTime().split(":")[1]);
		result += (hours * 60);
		result += minutes;
		
		return result;
	}
	
	public String getTotalPrice() {
		double amount = 0;
		
		for (Flight flight : getListOfFlights()) {
			amount += Double.parseDouble(flight.getPrice());
		}
		String result = decimalFormat.format(amount);
		
		return result;
	}
}