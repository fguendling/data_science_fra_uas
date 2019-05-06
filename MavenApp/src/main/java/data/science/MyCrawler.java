package data.science;

import java.io.IOException;

import org.jsoup.*;
import org.jsoup.nodes.Document;

public class MyCrawler {

	protected String crawl() throws IOException {
		
		// Basic JobSuche sieht so aus (Suchbegriff, Ort)
		Document doc = Jsoup.connect("https://de.indeed.com/jobs?q=IT+Consultant&l=Frankfurt+am+Main").get();
		String title = doc.title();
		return title;
		// Crawler Klasse muss als Servlet die Daten liefern können. (Hier nur den Titel.)
		/*response.setContentType("text/plain");
		PrintWriter out = response.getWriter();
		out.println(title);
		*/
	}
}