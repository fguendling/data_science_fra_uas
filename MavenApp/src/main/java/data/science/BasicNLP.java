/* 
 * 
 * 
 * 
 *  Diese Klasse erzeugt Tokens und POS Tags. Sie basiert auf Apache OpenNLP.
 * 
 * 
 * 
 * 
 */
package data.science;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.postag.*;

public class BasicNLP {

	private Tokenizer tokenizer;
	private POSTaggerME tagger;
	private String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
	
	// diese Datenbank wird nach der Vorstellung des Projekts abgeschaltet.
	// Ein Dump der Datenbank ist auf GitHub zu finden.
	private String DB_URL = "jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306";
	private String USER = "data_science";
	private String PASS = "data_science_pw";
	private int Ausschreibungs_ID;
	private String content;
	private ResultSet rs;
	private Connection conn;
	private String jobresult;
	private String location;
	
	// Konstruktor
	BasicNLP(String jobresult, String location) throws IOException, ClassNotFoundException, SQLException {

		this.jobresult = jobresult;
		this.location = location;

		// this is used for tokenization
		// Das Model muss heruntergeladen werden und diese Stelle muss angepasst werden
		// http://opennlp.sourceforge.net/models-1.5/
		InputStream modelIn = new FileInputStream("/Users/felix/eclipse-workspace/de-token.bin");
		TokenizerModel m = new TokenizerModel(modelIn);

		// After the model is loaded the tool itself can be instantiated.
		tokenizer = new TokenizerME(m);

		// part-of-speech detection
		// muss ebenfalls heruntegeladen werden.
		InputStream POSModel = new FileInputStream("/Users/felix/eclipse-workspace/de-pos-maxent.bin");
		POSModel model = new POSModel(POSModel);
		tagger = new POSTaggerME(model);

		// Database connection...
		conn = null;
		Statement stmt = null;
		Class.forName("org.mariadb.jdbc.Driver");
		conn = DriverManager.getConnection("jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306",
				USER, PASS);
		Statement select = conn.createStatement();
		
		// Holt die aktuellsten Ausschreibungen gefiltert nach Ort und Suchbegriff 
		// diese Werden in create_pos() per NLP verarbeitet
		String query = "select ausschreibungs_id, ausschreibungs_inhalt from test.Ausschreibungen"
				+ " where suchbegriff_job=?"
				+ " and suchbegriff_ort=?"
				+ "and datum = (select max(datum) from test.Ausschreibungen)" 				
				+ ";";

		PreparedStatement my_select = conn.prepareStatement(query);
		my_select.setString(1, this.jobresult);
		my_select.setString(2, this.location);
		rs = my_select.executeQuery();
	}

	public void create_pos() throws IOException, SQLException {
	// erstellt Tokens und POS Tags und schreibt diese in eine Datenbanktabelle.
		
		while (rs.next()) {
			Ausschreibungs_ID = rs.getInt("ausschreibungs_ID");
			content = rs.getString("ausschreibungs_inhalt");

			String words[] = tokenizer.tokenize(content);
			String tags[] = tagger.tag(words);

			for (int i = 0; i < tags.length; i++) {

				// insert the results to db
				String query = "insert into test.Ausschreibungs_Inhalt_POS (ausschreibungs_id, token, pos) values (?, ?, ?)";
				PreparedStatement insert = conn.prepareStatement(query);

				insert.setInt(1, Ausschreibungs_ID);
				insert.setString(2, words[i]);
				insert.setString(3, tags[i]);
				insert.execute();
			}
		}
	}
}
