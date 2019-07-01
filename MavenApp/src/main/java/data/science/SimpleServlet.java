/*
 * 
 * 
 * 
 * SimpleServlet wird verwendet, um eine Verbindung zum Backend (Crawler, NLP, Datenbank) herzustellen.
 * 
 * 
 * 
 * 
 */
package data.science;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
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

	static final String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
	static final String DB_URL = "jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306";
	static final String USER = "data_science";
	static final String PASS = "data_science_pw";

	// die doGet Methode wird hauptsächlich für einen Drill Down im zweiten Chart verwendet.
	// (Anzeige von detaillierten Ausschreibungstexten bei Klick auf die Balken, die angeben, wie viele Jahre Berufserfahrung gesucht werden)
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// Auf diesem Weg können Paramter (?Vorname=xxx&Nachname=yyy etc) 
		// an das Backend übergeben werden. Beispiel:
		// out.println(request.getParameter("Vorname"));
		// out.println(request.getParameter("Nachname"));
		
		response.setContentType("text/plain");
		PrintWriter out = response.getWriter();
		System.out.println("get methode wird aufgerufen.");
		
//		MyStanfordNLP NLP_test = new MyStanfordNLP();
//		NLP_test.testNLP();
//		System.out.println("NLP test wurde aufgerufen.");
		
		Connection my_conn = null;
		
		try {
			Class.forName("org.mariadb.jdbc.Driver");
			my_conn = DriverManager.getConnection("jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306",
					USER, PASS);
		
		// es wird geprüft, ob Parameter in der URL übergeben werden.
		// die parameter werden im drill_down.js festgelegt.
		if (request.getParameter("condition") != null) {
			String cond = request.getParameter("condition");
			out.println(request.getParameter("condition") + "\r\n");
						
			String result_of_query = "";
						
			PreparedStatement preparedStmt = my_conn.prepareStatement(
					// hier sollte idealerweise das SQL File eingelesen werden, 
					// hier wurde das SQL einfach eingefügt.
					// vgl. MavenApp/Queries/aufgabe2_details.sql

					"-- experience_details\n" + 
					"-- basiert auf Query 'Aufgabe 2'\n" + 
					"\n" + 
					"select * from (\n" + 
					"select 	\n" + 
					"	p.ausschreibungs_id,\n" + 
					"    p.token vorgaenger, \n" + 
					"    a.token nachfolger,\n" + 
					"    au.ausschreibungs_inhalt,\n" + 
					"           row_number() over (partition by p.ausschreibungs_id) as row_numb\n" + 
					"from (\n" + 
					"	select \n" + 
					"		ausschreibungs_id, \n" + 
					"        token, \n" + 
					"        pos, \n" + 
					"        ausschreibungs_inhalt_pos_id, \n" + 
					"        lag(ausschreibungs_inhalt_pos_id) over (order by ausschreibungs_inhalt_pos_id) as predecessor_token\n" + 
					"	from test.Ausschreibungs_Inhalt_POS) a\n" + 
					"inner join test.Ausschreibungs_Inhalt_POS p \n" + 
					"on a.predecessor_token = p.ausschreibungs_inhalt_pos_id\n" + 
					"inner join test.Ausschreibungen au\n" + 
					"on a.ausschreibungs_id = au.ausschreibungs_id\n" + 
					"where p.pos = 'card'\n" + 
					"and a.token like 'jahre'\n" + 
					"and au.suchbegriff_job = 'Projektmanager'\n" + 
					"\n" + 
					"and p.token = ?\n" + 
					"order by p.ausschreibungs_id) without_duplicates\n" + 
					"where row_numb = 1;\n" 
					);
			preparedStmt.setString(1, cond);
			
			ResultSet rs = preparedStmt.executeQuery();
			while (rs.next()) {
				result_of_query = result_of_query + rs.getString("ausschreibungs_inhalt") + "\r\n" + "\r\n";		
			}
			out.println(result_of_query);
		}			
		
		} catch (SQLException se) {
			// Handle errors for JDBC
			se.printStackTrace();
		} catch (Exception e) {
			// Handle errors for Class.forName
			e.printStackTrace();
		} finally {
			// finally block used to close resources
			try {
				if (my_conn != null) {
					my_conn.close();
				}
			} catch (SQLException se) {
				se.printStackTrace();
			} // end finally try
		} // end try
	}// end main

	// doPost wird verwendet, um den Crawler und das NLP aufzurufen.
	// Das NLP kann erst laufen, nachdem der Crawler seine Arbeit beendet hat.
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		PrintWriter out = response.getWriter();
		String job_result = request.getParameter("job");
		String place_result = request.getParameter("place");
		String URL_result = request.getParameter("url");
		// out.println(request.getParameter("myInput"));
		// System.out.println("Crawler wurde aufgerufen, NLP läuft.");
		System.out.println("Crawler wurde aufgerufen, NLP läuft. Die übergebenen Werte sind ");
		System.out.println(job_result);
		System.out.println(place_result);
		System.out.println(URL_result);

		// Aufruf der gesamten Pipeline:
		MyCrawler crawler = new MyCrawler();
		try {
			crawler.crawl(URL_result, job_result, place_result);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

// test des stanford parsers
//		MyStanfordNLP mySNLP;
//		try {
//			mySNLP = new MyStanfordNLP(job_result);
//			mySNLP.doNLP(job_result);
//			System.out.println("Parser hat erfolgreich geparsed.");
//		} catch (ClassNotFoundException e) {
//			e.printStackTrace();
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}

		BasicNLP myNLP;
		try {
			myNLP = new BasicNLP(job_result, place_result);
			myNLP.create_pos();
			System.out.println("pos tags erfolgreich erstellt.");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
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