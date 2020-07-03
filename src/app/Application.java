package app;

import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;
import java.io.IOException;

import controllers.AmenityController;
import controllers.ApartmentController;
import controllers.UserController;
import dao.ApartmentDAO;
import dao.UserDAO;
import services.AmenityService;
import services.ApartmentService;
import services.UserService;

public class Application {
	
	public static void main(String[] args) throws IOException {
		port(8080);
		
		/*
		 * User a = new Administrator("admin", "admin", "Dusan", "Petrovic",
		 * Gender.male);
		 * 
		 * UserDAO dao = new UserDAO(); dao.Create(a);
		 */
		//User a = new Administrator("admin", "admin", "Dusan", "Petrovic", Gender.male);
				  
		//UserDAO dao = new UserDAO(); dao.Create(a); 
		
		staticFiles.externalLocation(new File("./static").getCanonicalPath());

		UserDAO userDAO = new UserDAO();
		ApartmentDAO apartmentDAO = new ApartmentDAO(userDAO);
		new UserController(new UserService(userDAO));
		new AmenityController(new AmenityService());
		
		new ApartmentController(new ApartmentService(apartmentDAO));

	}

}
