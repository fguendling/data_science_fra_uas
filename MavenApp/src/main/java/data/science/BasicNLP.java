package data.science;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
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
	static final String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
	static final String DB_URL = "jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306";
	static final String USER = "data_science";
	static final String PASS = "data_science_pw";
	private int Ausschreibungs_ID;
	private String content;
	ResultSet result;
	Connection conn;

	BasicNLP() throws IOException, ClassNotFoundException, SQLException {

		// A model is usually loaded by providing a FileInputStream with a model to a
		// constructor of the model class:
		// this is used for tokenization
		InputStream modelIn = new FileInputStream("/Users/felix/eclipse-workspace/de-token.bin");
		TokenizerModel m = new TokenizerModel(modelIn);
		// After the model is loaded the tool itself can be instantiated.
		tokenizer = new TokenizerME(m);

		// part-of-speech detection
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
		result = select.executeQuery("select ausschreibungs_id, ausschreibungs_inhalt from test.Ausschreibungen;");
	}

	public void create_pos() throws IOException, SQLException {

		while (result.next()) {
			Ausschreibungs_ID = result.getInt("ausschreibungs_ID");
			content = result.getString("ausschreibungs_inhalt");

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