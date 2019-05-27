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
	static final String PASS = "data_science_pw";

//	String output;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/plain");
		PrintWriter out = response.getWriter();
		System.out.println("get methode wird aufgerufen.");

		// test, auf diesem Weg können Paramter (?Vorname=xxx&Nachname=yyy etc)
		// an das Backend übergeben werden
		// out.println(request.getParameter("Vorname"));
		// out.println(request.getParameter("Nachname"));

		Connection conn = null;
		Statement stmt = null;
		try {
			Class.forName("org.mariadb.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306",
					USER, PASS);
			Statement select = conn.createStatement();
			ResultSet result = select.executeQuery(
					"-- actual query for the app\n" + 
					"\n" + 
					"SELECT CONCAT(\n" + 
					"    '[', \n" + 
					"    GROUP_CONCAT(json_object('token', token, 'token_count', token_count)),\n" + 
					"    ']'\n" + 
					") FROM (\n" + 
					"select token, pos, count(token) token_count from (\n" + 
					"select \n" + 
					"	a.ausschreibungs_id id, \n" + 
					"    a.ausschreibungs_inhalt, \n" + 
					"    a.ausschreibungs_titel, \n" + 
					"    a.datum, firma, \n" + 
					"    a.suchbegriff_job, \n" + 
					"    a.suchbegriff_ort, \n" + 
					"    a.webseite,\n" + 
					"    pos.ausschreibungs_inhalt_pos_id, \n" + 
					"    pos.ausschreibungs_id, \n" + 
					"    pos.token, \n" + 
					"    pos.pos\n" + 
					"from test.Ausschreibungen a\n" + 
					"inner join test.Ausschreibungs_Inhalt_POS pos\n" + 
					"on a.ausschreibungs_id=pos.ausschreibungs_id\n" + 
					"where a.suchbegriff_job = \"Data Scientist\"\n" + 
					"-- viele Englische Wörter bekommen den pos 'NE' zugeordnet. \n" + 
					"-- Diese werden hier nicht berücksichtigt.\n" + 
					"-- Dadurch fehlen einige wichtige Begriffe, wie z. B. \"Python\" oder Science.\n" + 
					"-- Das Problem könnte man lösen, wenn ein Language Detector eingebaut wird.\n" + 
					"and pos.pos in ('NN')) results group by results.token order by token_count desc limit 10) limited_results;\n" + 
					"\n" 
					//^im Prinzip für Aufgabe 1 & 2 relevant
					
					);	
		
			result = select.executeQuery(
					"SELECT CONCAT(\n" + 
					"    '[', \n" + 
					"    GROUP_CONCAT(json_object('token', pl_name, 'token_count', count)),\n" + 
					"    ']'\n" + 
					") FROM (\n" + 
					"select count(pos.token) count, pl.name pl_name\n" + 
					"from test.Ausschreibungs_Inhalt_POS pos\n" + 
					"inner join test.Ausschreibungen a\n" + 
					"inner join test.programming_languages pl\n" + 
					"on a.ausschreibungs_id = pos.ausschreibungs_id\n" + 
					"and pos.token=pl.name\n" + 
					"where a.suchbegriff_job = 'Data Scientist'\n" + 
					"group by pos.token\n" + 
					"order by count desc\n" + 
					"limit 10) json_results\n" + 
					";"					);
			// ^das Beispiel gibt die Top Programmiersprachen aus (! für Data Scientists).
			// kann man anpassen an "Softwareentwickler" 
			// und man hat die Lösung für Aufgabenstellung 3
			String jsonString = "";
			while (result.next()) {
				jsonString = result.getString(1);
				}

			out.println(jsonString);

		} catch (SQLException se) {
			// Handle errors for JDBC
			se.printStackTrace();
		} catch (Exception e) {
			// Handle errors for Class.forName
			e.printStackTrace();
		} finally {
			// finally block used to close resources
			try {
				if (stmt != null) {
					conn.close();
				}
			} catch (SQLException se) {
			} // do nothing
			try {
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException se) {
				se.printStackTrace();
			} // end finally try
		} // end try
	}// end main

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

		// Test der gesamten Pipeline:
		MyCrawler crawler = new MyCrawler();
		try {
			crawler.crawl(URL_result, job_result, place_result);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

//test des stanford parsers
//		MyStanfordNLP mySNLP;
//		try {
//			mySNLP = new MyStanfordNLP(job_result);
//			mySNLP.doNLP(job_result);
//			System.out.println("Parser hat erfolgreich geparsed.");
//		} catch (ClassNotFoundException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (SQLException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}

		BasicNLP myNLP;
		try {
			myNLP = new BasicNLP(job_result);
			myNLP.create_pos();
			System.out.println("pos tags erfolgreich erstellt.");

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