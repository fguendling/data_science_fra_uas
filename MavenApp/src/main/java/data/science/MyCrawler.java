package data.science;

import java.io.IOException;
import java.util.ArrayList;

import org.jsoup.*;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class MyCrawler {

	public String crawl() throws IOException {

		// Basic JobSuche sieht so aus (Suchbegriff, Ort)
		Document doc = Jsoup.connect("https://de.indeed.com/jobs?q=IT+Consultant&l=Frankfurt+am+Main").get();

		// Die Subpages sind das, was eigentlich relevant ist.
		// Die Links zu den Subpages werden folgendermaßen ermittelt
		Elements links = doc.select("[data-tn-element=\"jobTitle\"]");

		String awesome_string = new String();
		for (Element link : links) {

			// hole den link zu den Subpages aus dem html
			String subpage_url = link.attr("abs:href");

			// besuche die subpages
			Document subpage_doc = Jsoup.connect(subpage_url).get();	
			
			// hole alles von der subpage
			// Element body = subpage_doc.body();
			
			// Title der Ausschreibung
			Element title = subpage_doc.select("h3").first();

			// Inhalt der Ausschreibung
			Element content = subpage_doc.select("div[id=jobDescriptionText]").first();			
			
			// Firma, die ausschreibt
			Element company = subpage_doc.select("div[class=\"icl-u-lg-mr--sm icl-u-xs-mr--xs\"]").first();
			
			// hier sollte das Zeug in die Datenbank geschrieben werden.
			   awesome_string = awesome_string + company.text() + "<br>";
			 
			   
		}		
			
		return awesome_string;
		// (gehe dann auf die nächste Seite und wiederhole das Vorgehen.)

	}
}