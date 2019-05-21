package data.science;

import edu.stanford.nlp.coref.data.CorefChain;
import edu.stanford.nlp.ling.*;
import edu.stanford.nlp.ie.util.*;
import edu.stanford.nlp.pipeline.*;
import edu.stanford.nlp.semgraph.*;
import edu.stanford.nlp.trees.*;
import java.util.*;


public class MyStanfordNLP {

	  public static String text = "Joe Smith was born in California. " +
	      "In 2017, he went to Paris, France in the summer. " +
	      "His flight left at 3:00pm on July 10th, 2017. " +
	      "After eating some escargot for the first time, Joe said, \"That was delicious!\" " +
	      "He sent a postcard to his sister Jane Smith. " +
	      "After hearing about Joe's trip, Jane decided she might go to France one day.";

	  
	  void doNLP() {
	    // set up pipeline properties
	    Properties props = new Properties();
	    // set the list of annotators to run
	    props.setProperty("annotators", "tokenize,ssplit,pos,parse,depparse");
	    // build pipeline
	    StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
	    // create a document object
	    CoreDocument document = new CoreDocument(text);
	    // annnotate the document
	    pipeline.annotate(document);
	    // examples

	    // 10th token of the document
	    CoreLabel token = document.tokens().get(10);
	    System.out.println("Example: token");
	    System.out.println(token);
	    System.out.println();

	    // text of the first sentence
	    String sentenceText = document.sentences().get(0).text();
	    System.out.println("Example: sentence");
	    System.out.println(sentenceText);
	    System.out.println();

	    // second sentence
	    CoreSentence sentence = document.sentences().get(0);

	    // list of the part-of-speech tags for the second sentence
	    List<String> posTags = sentence.posTags();
	    System.out.println("Example: pos tags");
	    System.out.println(posTags);
	    System.out.println();

	    // constituency parse for the second sentence
	    Tree constituencyParse = sentence.constituencyParse();
	    System.out.println("Example: constituency parse");
	    System.out.println(constituencyParse);
	    System.out.println();

	    // dependency parse for the second sentence
	    SemanticGraph dependencyParse = sentence.dependencyParse();
	    System.out.println("Example: dependency parse");
	    System.out.println(dependencyParse);
	    System.out.println();


	  }
	}


