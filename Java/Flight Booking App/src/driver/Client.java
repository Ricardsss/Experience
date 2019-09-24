package driver;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Client extends User implements Serializable {
	
	private String lastName;
	private String firstName;
	private String email;
	private String address;
	private String creditCardNumber;
	private String expiryDate;
	private List<Itinerary> bookedItineraries;
	
	public Client(String lastName, String firstName, String email,
			String address, String creditCardNumber, String expiryDate) {
		super();
		this.lastName = lastName;
		this.firstName = firstName;
		this.email = email;
		this.address = address;
		this.creditCardNumber = creditCardNumber;
		this.expiryDate = expiryDate;
		this.bookedItineraries = new ArrayList<Itinerary>();
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCreditCardNumber() {
		return creditCardNumber;
	}

	public void setCreditCardNumber(String creditCardNumber) {
		this.creditCardNumber = creditCardNumber;
	}

	public String getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(String expiryDate) {
		this.expiryDate = expiryDate;
	}
	
	public List<Itinerary> getBookedItineraries() {
		return bookedItineraries;
	}

	public void setBookedItineraries(List<Itinerary> bookedItineraries) {
		this.bookedItineraries = bookedItineraries;
	}
	
	public void bookItinerary(Itinerary itinerary) {
		getBookedItineraries().add(itinerary);
	}

	public boolean equals(Client other) {
		return getEmail().equals(other.getEmail());
	}
	
	public String toString() {
		return lastName + "," + firstName + "," + email + "," + address + ","
	+ creditCardNumber + "," + expiryDate;
	}
}