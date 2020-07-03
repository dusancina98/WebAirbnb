package dao;

import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Apartment;
import beans.Guest;
import beans.Period;
import beans.Reservation;
import beans.ReservationStatus;


public class ApartmentDAO {
	private final String path = "./files/apartment.json";
	private static Gson g = new Gson();
	private UserDAO userDao;

	public ApartmentDAO(UserDAO userDao) {
		this.userDao = userDao;
	}
	
	public List<Apartment> GetAll() throws JsonSyntaxException, IOException{		
		return g.fromJson((Files.readAllLines(Paths.get(path),Charset.defaultCharset()).size() == 0) ? "" : Files.readAllLines(Paths.get(path),Charset.defaultCharset()).get(0), new TypeToken<List<Apartment>>(){}.getType());
	}
	
	public Apartment Create(Apartment apartment) throws JsonSyntaxException, IOException {
		ArrayList<Apartment> apartments = (ArrayList<Apartment>) GetAll();
		apartment.setId(GetMaxID());
		if(apartments == null) {
			apartments = new ArrayList<Apartment>();
		}
		apartments.add(apartment);
		SaveAll(apartments);
		return apartment;
	}
	
	public Apartment get(String id) throws JsonSyntaxException, IOException {
		ArrayList<Apartment> apartments = (ArrayList<Apartment>) GetAll();
		if(apartments != null) {
			for(Apartment a : apartments) {
				if(a.getId() == Integer.parseInt(id)) {
					return a;
				}
			}
		}
		return null;
	}
	
	public List<Long> getOccupiedDates(String id) throws JsonSyntaxException, IOException{
		Apartment apartment = get(id);
		List<Long> retVal = new ArrayList<Long>();
		for(Period p : apartment.getDateForRenting()) {
			Date temp = new Date(p.getDateFrom());
			Date dateTo = new Date(p.getDateTo());
			Calendar c = Calendar.getInstance(); 
			while(temp.compareTo(dateTo) <= 0) {
				if(!apartment.getFreeDateForRenting().contains(temp.getTime())) {
					retVal.add(temp.getTime());
				}
				c.setTime(temp); 
				c.add(Calendar.DAY_OF_YEAR, 1);
				temp = c.getTime();
			}
		}
		return retVal;
	}
	
	public boolean reserve(Reservation reservation) throws JsonSyntaxException, IOException {
		ArrayList<Apartment> apartments = (ArrayList<Apartment>) GetAll();
		boolean retVal = false;
		Guest g = (Guest) userDao.get(reservation.getGuest().getUsername());
		
		
		List<Reservation> guestReservations = g.getReservations();
		Apartment ap = null;
		for(Apartment a : apartments) {
			if(a.getId() == reservation.getAppartment().getId()) {
				List<Reservation> temp = a.getReservations();
				
				ap = a;
				if(temp == null)
					temp = new ArrayList<Reservation>();
				
				reservation.setId(temp.size() + 1);				
				reservation.setAppartment(null);
				temp.add(reservation);
				a.setReservations(temp);
				a.setFreeDateForRenting(setFreeDaysForRenting(a.getFreeDateForRenting(),reservation));
				retVal = true;
				break;
			}
		}
		SaveAll(apartments);
		
		ap.setReservations(null);
		
		reservation.setAppartment(ap);
		reservation.setGuest(null);
		guestReservations.add(reservation);
		
		userDao.Update(g);
		
		return retVal;
	}
	
	public List<Reservation> getAllReservations(int whatToGet, String username) throws JsonSyntaxException, IOException{
		List<Reservation> retVal = new ArrayList<Reservation>();
		ArrayList<Apartment> apartments = (ArrayList<Apartment>) GetAll();
		
		for(Apartment a : apartments) {
			for(Reservation r : a.getReservations()) {
				if(whatToGet == 0) {
					if(r.getGuest().getUsername().equals(username)) {
						r.setAppartment(new Apartment(a.getId(),a.getType(),a.getNumberOfRoom(),a.getNumberOfGuest(),a.getLocation(), null, null, null, null, null,0, 0, 0, null, null, null));
						retVal.add(r);
					}
				}else if(whatToGet == 1) {
					if(a.getHost().getUsername().equals(username)) {
						r.setAppartment(new Apartment(a.getId(),a.getType(),a.getNumberOfRoom(),a.getNumberOfGuest(),a.getLocation(), null, null, null, null, null,0, 0, 0, null, null, null));
						retVal.add(r);
					}
				}
				else {
					r.setAppartment(new Apartment(a.getId(),a.getType(),a.getNumberOfRoom(),a.getNumberOfGuest(),a.getLocation(), null, null, null, null, null,0, 0, 0, null, null, null));
					retVal.add(r);
				}
			}
		}
			
		return retVal;
	}
	
	private List<Long> setFreeDaysForRenting(List<Long> freeDateForRenting, Reservation reservation) {
		
		List<Long> retVal = new ArrayList<Long>();
		List<Long> reservationDates = new ArrayList<Long>();
		Date temp = new Date(reservation.getStartDate());
		Date endDate = new Date(reservation.getStartDate() + reservation.getDaysForStay()*24*60*60*1000);
		
		Calendar c = Calendar.getInstance(); 
		endDate = c.getTime();

		while(temp.compareTo(endDate) <= 0) {
			reservationDates.add(temp.getTime());
			c.setTime(temp); 
			c.add(Calendar.DAY_OF_YEAR, 1);
			temp = c.getTime();

		}
		
		for(long date : freeDateForRenting) {
			if(!reservationDates.contains(date))
				retVal.add(date);
		}
		
		return retVal;
	}

	private int GetMaxID() throws JsonSyntaxException, IOException {
		int maxId = 0;
		ArrayList<Apartment> apartments = (ArrayList<Apartment>) GetAll();
		if(apartments != null) {
			for(Apartment a : apartments) {
				if(a.getId() > maxId)
					maxId = a.getId();
			}
		}
		return ++maxId;
	}
	
	public void SaveAll(Collection<Apartment> apartments) throws JsonIOException, IOException{
	    Writer writer = new FileWriter(path);
		g.toJson(apartments, writer);
	    writer.close();
	}
	
	public boolean changeReservationStatus(String id, ReservationStatus status) throws JsonSyntaxException, IOException {
		ArrayList<Apartment> apartments = (ArrayList<Apartment>) GetAll();
		boolean changed = false;
		for(Apartment a : apartments) {
			for(Reservation r : a.getReservations()) {
				if(r.getId() == Integer.parseInt(id)) {
					r.setStatus(status);
					changed = true;
					break;
				}
			}
			if(changed)
				break;
		}
		SaveAll(apartments);
		userDao.changeReservationStatus(id, status);
		return changed;
	}

}
