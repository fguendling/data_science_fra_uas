package data.science;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.*;

@WebServlet("/SimpleServlet")
public class SimpleServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	JSONObject o1 = new JSONObject();
	ArrayList<JSONObject> json_object_array = new ArrayList<JSONObject>();
	static final String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
	static final String DB_URL = "jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306";
	static final String USER = "data_science";
	// db password muss hier eingetragen werden.
	static final String PASS = "data_science_pw";

	String output;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/plain");
		PrintWriter out = response.getWriter();
		System.out.println("doGet wird aufgerufen.");
	}

	// Ausgabe in Frontend funktioniert nicht mehr auf diese Weise
	// String title_of_indeed_search =
	// crawler.crawl("https://de.indeed.com/Jobs?q=apex&l=Frankfurt+am+Main");

	// test, auf diesem Weg können Paramter (?Vorname=xxx&Nachname=yyy etc)
	// an das Backend übergeben werden
	// out.println(request.getParameter("Vorname"));
	// out.println(request.getParameter("Nachname"));

	// Das diente als Beispiel dafür, wie Daten aus der DB als JSON verpackt wurden.
	// kann man spätere löschen.

// Database connection...	
//		Connection conn = null;
//		Statement stmt = null;
//		try {
//			Class.forName("org.mariadb.jdbc.Driver");
//			conn = DriverManager.getConnection("jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306",
//					USER, PASS);
//			Statement select = conn.createStatement();
//			ResultSet result = select.executeQuery("SELECT * from test.country_values;");
//			String jsonString = "[";
//			while (result.next()) {
//				o1.put("Country", result.getString(1));
//				o1.put("Value", result.getString(2));
//				jsonString = jsonString + o1.toString() + ',';
//
//			}

	// hier können die JSON Daten ausgegeben werden
	// die werden auch für die Erstellung des Charts benötigt.
	// out.println(jsonString.substring(0, jsonString.length() - 1) + ']');

	// es wurde das gecrawlte html ausgegeben.
	// out.println(title_of_indeed_search);

//		} catch (SQLException se) {
//			// Handle errors for JDBC
//			se.printStackTrace();
//		} catch (Exception e) {
//			// Handle errors for Class.forName
//			e.printStackTrace();
//		} finally {
//			// finally block used to close resources
//			try {
//				if (stmt != null) {
//					conn.close();
//				}
//			} catch (SQLException se) {
//			} // do nothing
//			try {
//				if (conn != null) {
//					conn.close();
//				}
//			} catch (SQLException se) {
//				se.printStackTrace();
//			} // end finally try
//		} // end try
//	}// end main

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		String job_result = request.getParameter("job");
		String place_result = request.getParameter("place");
		String URL_result = request.getParameter("url");
		// out.println(request.getParameter("myInput"));
		// System.out.println("Crawler wurde aufgerufen, NLP läuft.");
		out.println("Crawler wurde aufgerufen, NLP läuft. Die übergebenen Werte sind ");
		out.println(job_result);
		out.println(place_result);
		out.println(URL_result);

		// Test der gesamten Pipeline:
		MyCrawler crawler = new MyCrawler();
		try {
			crawler.crawl(URL_result, job_result, place_result);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		BasicNLP myNLP;
		try {
			myNLP = new BasicNLP();
			myNLP.create_pos();

		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@Override
	public void init() throws ServletException {
	}

	public void destroy() {
		super.destroy();
	}
}