package data.science;

import java.io.IOException;
import java.util.ArrayList;
import org.jsoup.*;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class MyCrawler {

	String awesome_string = new String();
	Element result_count;
	int run = 1;
	int suffix = 0;
	String pagination_test_string = new String();

	public String crawl(String main_search_url) throws IOException {

		// Basic JobSuche enthält in der Url sowohl Suchbegriff als auch Ort.
		Document doc = Jsoup.connect((main_search_url + "&start=" + Integer.toString(suffix))).get();

		// es wird später geschaut, ob die Seite in der pagination den Begriff "Weiter" enthält
		Element test_element = doc.select("div.pagination").first();
		pagination_test_string = test_element.outerHtml();
		

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

			// Firma, die ausschreibt
			Element company = subpage_doc.select("div[class=\"icl-u-lg-mr--sm icl-u-xs-mr--xs\"]").first();

			// hier sollte das Zeug in die Datenbank geschrieben werden.
			awesome_string = awesome_string + title.text() + "<br>";

		}
		
		suffix = suffix + 10;
		
		while (pagination_test_string.contains("Weiter")) {
			crawl(main_search_url);
		}

		return awesome_string;

	}
}