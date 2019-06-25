package data.science;

import java.io.IOException;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.jsoup.*;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class MyCrawler {

	// int suffix = 0;
	String pagination_test_string = new String();
	java.sql.Connection conn;
	int child_count = 1;
	String data_pp_value = "";
	String href_val = "";

	MyCrawler() {
		try {
			// create a mysql database connection
			String myDriver = "org.mariadb.jdbc.Driver";
			String myUrl = "jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306";
			Class.forName(myDriver);
			conn = DriverManager.getConnection(myUrl, "data_science", "data_science_pw");
		} catch (Exception e) {
			System.err.println("Got an exception!");
			System.err.println(e.getMessage());
		}
	}

	public void crawl(String main_search_url, String job_result, String place_result) throws IOException, SQLException {

		// Basic JobSuche enthält in der Url sowohl Suchbegriff als auch Ort.
		Document doc = Jsoup.connect(main_search_url).get();

		// es wird später geschaut, ob die Seite in der pagination den Begriff "Weiter"
		// enthält
		Element test_element = doc.select("div.pagination").first();
		pagination_test_string = test_element.outerHtml();

		// der Wert des data-pp Attributs wird benötigt um die korrekten Links zu
		// ermitteln.

		if (pagination_test_string.contains("Weiter")) {
			href_val = test_element.child(child_count).attr("abs:href");
			data_pp_value = test_element.child(child_count).attr("data-pp");

		} else {
			System.out.println("it's fine");

		}
		// Die Subpages sind das, was eigentlich relevant ist.
		// Die Links zu den Subpages werden folgendermaßen ermittelt
		Elements links = doc.select("[data-tn-element=\"jobTitle\"]");

		for (Element link : links) {

			// hole den link zu den Subpages aus dem html
			String subpage_url = link.attr("abs:href");

			// besuche die subpages
			Document subpage_doc = Jsoup.connect(subpage_url).get();

			// Title der Ausschreibung
			Element title = subpage_doc.select("h3").first();

			// Inhalt der Ausschreibung
			Element content = subpage_doc.select("div[id=jobDescriptionText]").first();

			String comp_name = "";
			try {
				// Firma, die ausschreibt
				Element company = subpage_doc.select("div[class=\"icl-u-lg-mr--sm icl-u-xs-mr--xs\"]").first();
//			    number = page.select(".page").last().text();
			    if (company!= null) {
			        comp_name = company.text();
			    }
			} catch (NullPointerException e) {
				comp_name = "null";
			}				 			
			// the mysql insert statement
			String query = " insert into test.Ausschreibungen "
					+ "(Ausschreibungs_Titel, ausschreibungs_inhalt, Webseite, Suchbegriff_Ort, "
					+ "Suchbegriff_Job, Firma, Datum)" + " values (?, ?, ?, ?, ?, ?, ?)";

			java.sql.Timestamp date = new java.sql.Timestamp(new java.util.Date().getTime());

			// create the mysql insert preparedstatement
			PreparedStatement preparedStmt = conn.prepareStatement(query);
			preparedStmt.setString(1, title.html());
			preparedStmt.setString(2, content.text());
			preparedStmt.setString(3, "Indeed.com");
			preparedStmt.setString(4, place_result);
			preparedStmt.setString(5, job_result);
			preparedStmt.setString(6, comp_name);
			preparedStmt.setTimestamp(7, date);

			// execute the preparedstatement
			preparedStmt.execute();

		}

		// suffix = suffix + 10;
		// child_count ist die Stelle in der Pagination, die gerade relevant ist.
		child_count = child_count + 1;

		while (pagination_test_string.contains("Weiter")) {

			// Beim Sprung von Seite 1 auf zwei kommt ein weiteres child "zurück" dazu,
			// daher ist hier noch ein weiteres mal hoch zu zählen.
			if ((pagination_test_string.contains("Zurück") == false)) {
				child_count = child_count + 1;
			}

			// es kann nicht mehr als 6 childs geben
			if (child_count == 7) {
				child_count = 6;
			}

			// Es gibt ein ganz gemeines data-pp attribut, das in der Pagination versteckt
			// ist.
			// Jede Ergebnisseite hat einen solchen data-pp Wert zugeordnet.
			// Dieser wird bei einem Klick auf den Link zur Ergebnisseite
			// per JavaScript verarbeitet und temporär zur URL hinzugefügt.
			// Dadurch wird die Ergebnismenge (Jobanzeigen, die pro Seite geliefert werden)
			// beeinflusst.
			System.out.println((child_count));
			System.out.println((href_val + "&pp=" + data_pp_value));
			crawl((href_val + "&pp=" + data_pp_value), job_result, place_result);
		}

		conn.close();
	}
}