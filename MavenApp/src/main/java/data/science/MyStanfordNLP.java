package data.science;

import edu.stanford.nlp.coref.data.CorefChain;
import edu.stanford.nlp.ling.*;
import edu.stanford.nlp.ie.util.*;
import edu.stanford.nlp.pipeline.*;
import edu.stanford.nlp.semgraph.*;
import edu.stanford.nlp.trees.*;
import edu.stanford.nlp.trees.tregex.TregexMatcher;
import edu.stanford.nlp.trees.tregex.TregexPattern;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

public class MyStanfordNLP {
	private String text;
	private String jobresult;
	private ResultSet rs;
	private Connection conn;
	private String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
	private String DB_URL = "jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306";
	private String USER = "data_science";
	private String PASS = "data_science_pw";
	private int Ausschreibungs_ID;
	CoreDocument document;
	StanfordCoreNLP pipeline;

	MyStanfordNLP(String jobresult) throws ClassNotFoundException, SQLException {
		this.jobresult = jobresult;
		// Database connection...
		conn = null;
		Statement stmt = null;

		Class.forName("org.mariadb.jdbc.Driver");
		conn = DriverManager.getConnection("jdbc:mariadb://ec2-52-59-2-90.eu-central-1.compute.amazonaws.com:3306",
				USER, PASS);
		Statement select = conn.createStatement();

		String query = "select ausschreibungs_id, ausschreibungs_inhalt from test.Ausschreibungen"
				+ " where suchbegriff_job=?" + "and datum = (select max(datum) from test.Ausschreibungen)" + ";";

		PreparedStatement my_select = conn.prepareStatement(query);
		my_select.setString(1, this.jobresult);
		rs = my_select.executeQuery();

		// set up pipeline properties
		Properties props = new Properties();
		// set the list of annotators to run
		props.setProperty("annotators", "tokenize,ssplit,pos,parse,depparse");
	    pipeline = new StanfordCoreNLP(props);


	}

	void doNLP(String job_result) throws SQLException {
		// examples

		// 10th token of the document
		// CoreLabel token = document.tokens().get(10);

		// text of the first sentence
		// String sentenceText = document.sentences().get(0).text();

// !! Beispiel von
// 		https://nlp.stanford.edu/nlp/javadoc/javanlp/edu/stanford/nlp/trees/tregex/TregexPattern.html
//		Create a reusable pattern object
//		TregexPattern patternMW = TregexPattern.compile("NP");
//		// Run the pattern on one particular tree
//		TregexMatcher matcher = patternMW.matcher(constituencyParse);
//		// Iterate over all of the subtrees that matched
//		while (matcher.findNextMatchingNode()) {
//			Tree match = matcher.getMatch();
//			// do what we want to do with the subtree
//			match.pennPrint();
//		}

		// !! Beispiel von https://stanfordnlp.github.io/CoreNLP/parse.html

		while (rs.next()) {

			Ausschreibungs_ID = rs.getInt("ausschreibungs_ID");
			text = rs.getString("ausschreibungs_inhalt");

			// create a document object
			document = new CoreDocument(text);
			// annnotate the document
			pipeline.annotate(document);

			// select the sentence
			CoreSentence sentence = document.sentences().get(0);

			// list of the part-of-speech tags for the second sentence
			List<String> posTags = sentence.posTags();

			// dependency parse for the second sentence
			SemanticGraph dependencyParse = sentence.dependencyParse();

			// constituency parse for the second sentence
			Tree tree = sentence.constituencyParse();

			Set<Constituent> treeConstituents = tree.constituents(new LabeledScoredConstituentFactory());

			for (Constituent constituent : treeConstituents) {
				if (constituent.label() != null && (constituent.label().toString().equals("VP")
						|| constituent.label().toString().equals("NP"))) {
					// System.out.println("found constituent: " + constituent.toString());
					// System.out.println(tree.getLeaves().subList(constituent.start(),
					// constituent.end() + 1));

					// insert the results to db
					// create table first
					String query = "insert into test.Ausschreibungs_Inhalt_parsed (Ausschreibungs_ID, constituent_description, constituent_value) values (?, ?, ?)";
					PreparedStatement insert = conn.prepareStatement(query);

					insert.setInt(1, Ausschreibungs_ID);
					insert.setString(2, constituent.toString());
					insert.setString(3,
							(tree.getLeaves().subList(constituent.start(), constituent.end() + 1).toString()));
					insert.execute();

				}
			}
		}
	}
}