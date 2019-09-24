package driver;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.StreamCorruptedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ApplicationManager implements Serializable {

    private List<Flight> flights;
    private List<Client> clients;
    private List<List<String>> accounts;

    public ApplicationManager() {
        this.flights = new ArrayList<Flight>();
        this.clients = new ArrayList<Client>();
        this.accounts = new ArrayList<List<String>>();
    }

    public ApplicationManager(String path) {
        File file1 = new File(path + "/clients.txt");
        if (file1.exists()) {
            readClientsFromFile(path + "/clients.txt");
        } else {
            try {
                file1.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        File file2 = new File(path + "/flights.txt");
        if (file2.exists()) {
            readFlightsFromFile(path + "/flights.txt");
        } else {
            try {
                file2.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        File file3 = new File(path + "/passwords.txt");
        if (file3.exists()) {
            readAccountsFromFile(path + "/passwords.txt");
        } else {
            try {
                file3.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public List<Flight> getFlights() {
        return this.flights;
    }

    public List<Client> getClients() {
        return this.clients;
    }

    public List<List<String>> getAccounts() {
        return this.accounts;
    }

    public List<Flight> searchAvailableFlights(String departureDate,
                                               String origin, String destination) {
        List<Flight> result = new ArrayList<Flight>();

        for (Flight flight : getFlights()) {

            if (flight.getDepartureDateTime().split(" ")[0]
                    .equals(departureDate) && flight.getOrigin().equals(origin)
                    && flight.getDestination().equals(destination)) {
                result.add(flight);
            }
        }
        return result;
    }

    public List<Itinerary> searchAvailableItineraries(String departureDate,
                                                      String origin, String destination) {
        List<Itinerary> itineraries = createItineraries(destination);
        List<Itinerary> result = new ArrayList<Itinerary>();

        for (Itinerary itinerary : itineraries) {

            if (itinerary.getOrigin().equals(origin)
                    && itinerary.getDestination().equals(destination)
                    && itinerary.getDepartureDate().equals(departureDate)
                    && getItineraryStopoverTime(itinerary) <= 360) {
                result.add(itinerary);
            }
        }

        for (Itinerary itinerary : result) {
            int available = itinerary.getListOfFlights().size();

            while (available != 0) {

                for (Flight flight : itinerary.getListOfFlights()) {

                    if (Integer.parseInt(flight.getNumSeats()) == 0) {
                        result.remove(itinerary);
                        available = 0;
                    }

                    else {
                        available -= 1;
                    }
                }
            }
        }

        return result;
    }

    public List<Itinerary> searchAvailableItinerariesSortedByTime(String date,
                                                                  String origin, String destination) {
        List<Itinerary> itineraries = searchAvailableItineraries(date, origin,
                destination);
        List<Itinerary> result = new ArrayList<Itinerary>();

        while (itineraries.size() > 0) {
            Itinerary minimum = itineraries.get(0);

            for (Itinerary itinerary : itineraries) {

                if (itinerary.getTotalTimeInMinutes()
                        < minimum.getTotalTimeInMinutes()) {
                    minimum = itinerary;
                }
            }
            result.add(minimum);
            itineraries.remove(minimum);
        }

        return result;
    }

    public List<Itinerary> searchAvailableItinerariesSortedByCost(String date,
                                                                  String origin, String destination) {
        List<Itinerary> itineraries = searchAvailableItineraries(date, origin,
                destination);
        List<Itinerary> result = new ArrayList<Itinerary>();

        while (itineraries.size() > 0) {
            Itinerary minimum = itineraries.get(0);

            for (Itinerary itinerary : itineraries) {

                if (Double.parseDouble(itinerary.getTotalPrice())
                        < Double.parseDouble(minimum.getTotalPrice())) {
                    minimum = itinerary;
                }
            }
            result.add(minimum);
            itineraries.remove(minimum);
        }

        return result;
    }

    public void uploadClientInformation(String path)
            throws FileNotFoundException {

        Scanner scanner = new Scanner(new FileInputStream(path));
        Client client;
        String[] information;

        while (scanner.hasNextLine()) {
            information = scanner.nextLine().split(",");
            client = new Client(information[0], information[1], information[2],
                    information[3], information[4], information[5]);

            if (getClients().contains(client)) {
                getClients().remove(client);
            }
            getClients().add(client);
            List<String> account = new ArrayList<String>();
            account.add(client.getEmail());
            int random = (int) (Math.random() * 999999 + 100000);
            account.add(Integer.toString(random));
            account.add("Client");
            getAccounts().add(account);
        }
        scanner.close();
    }

    public void uploadFlightInformation(String path)
            throws FileNotFoundException {

        Scanner scanner = new Scanner(new FileInputStream(path));
        Flight flight;
        String[] information;

        while (scanner.hasNextLine()) {
            information = scanner.nextLine().split(",");
            flight = new Flight(information[0], information[1], information[2],
                    information[3], information[4], information[5],
                    information[6], information[7]);

            if (getFlights().contains(flight)) {
                getFlights().remove(flight);
            }
            getFlights().add(flight);
        }
        scanner.close();
    }

    public void saveClientInformation(String path) throws IOException {
        PrintWriter printWriter = new PrintWriter(path);
        printWriter.close();

        OutputStream file = new FileOutputStream(path);
        OutputStream buffer = new BufferedOutputStream(file);
        ObjectOutput output = new ObjectOutputStream(buffer);

        output.writeObject(clients);
        output.close();
    }

    public void saveFlightInformation(String path) throws IOException {
        PrintWriter printWriter = new PrintWriter(path);
        printWriter.close();

        OutputStream file = new FileOutputStream(path);
        OutputStream buffer = new BufferedOutputStream(file);
        ObjectOutput output = new ObjectOutputStream(buffer);

        output.writeObject(flights);
        output.close();
    }

    public void saveAccountInformation(String path) throws IOException {
        PrintWriter printWriter = new PrintWriter(path);
        printWriter.close();

        OutputStream file = new FileOutputStream(path);
        OutputStream buffer = new BufferedOutputStream(file);
        ObjectOutput output = new ObjectOutputStream(buffer);

        output.writeObject(accounts);
        output.close();
    }

    @SuppressWarnings("unchecked")
    private void readClientsFromFile(String path) {
        try {
            InputStream file = new FileInputStream(path);
            InputStream buffer = new BufferedInputStream(file);
            ObjectInput input = new ObjectInputStream(buffer);
            this.clients = (List<Client>) input.readObject();
            input.close();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (StreamCorruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    private void readFlightsFromFile(String path) {
        try {
            InputStream file = new FileInputStream(path);
            InputStream buffer = new BufferedInputStream(file);
            ObjectInput input = new ObjectInputStream(buffer);
            this.flights = (List<Flight>) input.readObject();
            input.close();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (StreamCorruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    private void readAccountsFromFile(String path) {
        try {
            InputStream file = new FileInputStream(path);
            InputStream buffer = new BufferedInputStream(file);
            ObjectInput input = new ObjectInputStream(buffer);
            this.accounts = (List<List<String>>) input.readObject();
            input.close();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (StreamCorruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void grow(Flight flight, String destination, List<String> visited) {
        visited.add(flight.getOrigin());
        visited.add(flight.getDestination());

        if (!flight.getDestination().equals(destination)) {

            for (Flight flight2 : getFlights()) {

                if (flight.getDestination().equals(flight2.getOrigin())
                        && !visited.contains(flight2.getDestination())
                        && getStopoverTime(flight, flight2) != -1) {
                    flight.getNextPossibleFlights().add(flight2);
                }
            }

            for (Flight flight3 : flight.getNextPossibleFlights()) {
                grow(flight3, destination, visited);
            }
        }
    }

    private List<List<Flight>> getSequenceOfFlights(Flight flight,
                                                    List<List<Flight>> result, List<Flight> sequence) {

        if (flight.getNextPossibleFlights().size() == 0) {
            sequence.add(flight);
            result.add(sequence);
        }

        else {
            sequence.add(flight);

            for (Flight flight2 : flight.getNextPossibleFlights()) {
                getSequenceOfFlights(flight2, result, sequence);
            }
        }

        return result;
    }

    private List<List<Flight>> getSequences(String destination) {
        List<List<Flight>> result = new ArrayList<List<Flight>>();

        for (Flight flight : getFlights()) {
            List<String> visited = new ArrayList<String>();
            List<List<Flight>> sequences = new ArrayList<List<Flight>>();
            List<Flight> sequence = new ArrayList<Flight>();
            flight.getNextPossibleFlights().clear();
            grow(flight, destination, visited);

            for (List<Flight> list : getSequenceOfFlights(flight, sequences,
                    sequence)) {

                if (!result.contains(list)) {
                    result.add(list);
                }
            }
        }

        return result;
    }

    private List<Itinerary> createItineraries(String destination) {
        List<Itinerary> result = new ArrayList<Itinerary>();
        List<List<Flight>> sequences = getSequences(destination);

        for (List<Flight> list : sequences) {
            Itinerary itinerary = new Itinerary(list);
            result.add(itinerary);
        }

        return result;
    }

    private int getStopoverTime(Flight flight1, Flight flight2) {
        int arrivalDay = Integer.parseInt(flight1.getArrivalDateTime()
                .split(" ")[0].split("-")[2]);
        int departureDay = Integer.parseInt(flight2.getDepartureDateTime()
                .split(" ")[0].split("-")[2]);
        int arrivalMinutes = Integer.parseInt(flight1.getArrivalDateTime()
                .split(" ")[1].split(":")[0]) * 60 + Integer.parseInt(flight1
                .getArrivalDateTime().split(" ")[1].split(":")[1]);
        int departureMinutes = Integer.parseInt(flight2.getDepartureDateTime()
                .split(" ")[1].split(":")[0]) * 60 + Integer.parseInt(flight2
                .getDepartureDateTime().split(" ")[1].split(":")[1]);
        int time = 0;

        if (departureDay - arrivalDay < 0) {
            return -1;
        }

        if (departureDay - arrivalDay == 0) {

            if (departureMinutes - arrivalMinutes < 0) {
                return -1;
            }

            else {
                time = departureMinutes - arrivalMinutes;
            }
        }

        if (departureDay - arrivalDay > 0) {
            time = (departureMinutes - arrivalMinutes) + (60 * departureDay
                    - arrivalDay);
        }

        return time;
    }

    private int getItineraryStopoverTime(Itinerary itinerary) {
        int result = 0;
        int i = 0;

        while (i < itinerary.getListOfFlights().size() - 1) {
            result += getStopoverTime(itinerary.getListOfFlights().get(i),
                    itinerary.getListOfFlights().get(i + 1));
            i += 1;
        }

        return result;
    }
}