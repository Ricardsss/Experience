package driver;

import java.io.FileNotFoundException;
import java.io.Serializable;

public class Administrator extends User implements Serializable {

	public Administrator() {
		super();
	}
	
	public void uploadClientInformation(String path) 
    		throws FileNotFoundException {
		getManager().uploadClientInformation(path);
	}
	
	public void uploadFlightInformation(String path)
    		throws FileNotFoundException {
		getManager().uploadFlightInformation(path);
	}
	
	public Client getClient(String email) {
		Client result = null;
		
		for (Client client : getManager().getClients()) {
			
			if (client.getEmail().equals(email)) {
				result = client;
			}
		}
		
		return result;
	}
	
	public Flight getFlight(String number) {
		Flight result = null;
		
		for (Flight flight : getManager().getFlights()) {
			
			if (flight.getNumber().equals(number)) {
				result = flight;
			}
		}
		
		return result;
	}
}