using MarineInstitute;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApplicationProject
{
    public class StopwordTool
    {

        //this calls the current stopWords stored in the databse and adds them to the stopWords dictionary
        //this is done each time the program is run against an xmlFile
        //i chose to do this to keep the data up to date and avoid manual insertion
            public void Get()
            {
                MarineDataEntities db = new MarineDataEntities();
           
                var result = from w in db.StopWordLists
                             select w.Stopword;

                var words = result.ToList();

                foreach (string w in words)
                {
                    Add(w);
                }

            }

        
        
        //Add method
        //adds values into the stopWords dictionary to be used on each loading of a new xml file
        //this ensures that the tool is kept current with whats stored and updated in the database
        //instead of manually having to update the dictionary after each run
            public void Add(string value)
            {
                string word = value.ToLower();//data persistance
                try
                {
                    if (stopWords.ContainsKey(word) != true)
                    {
                        stopWords.Add(word, true);
                    }
                }
                catch(Exception e)
                {
                    Trace.TraceInformation("Error: {0}", e);
                }
       
            }
         

        //this is the data structure i chose to store my stopWords in
        //it is similar to a hashmap in java - you can store a key value pair
        //in this case it is a string and a bool, word and true
        //this makes it searchable and you can call .ContainsKey on the structure
        public Dictionary<string, bool> stopWords = new Dictionary<string, bool>
    {
	       
    /*
            { "a", true },
	        { "about", true },
	        { "above", true },
	        { "across", true },
	        { "after", true },
	        { "afterwards", true },
	        { "again", true },
	        { "against", true },
	        { "all", true },
	        { "almost", true },
	        { "alone", true },
	        { "along", true },
	        { "already", true },
	        { "also", true },
	        { "although", true },
	        { "always", true },
	        { "am", true },
	        { "among", true },
	        { "amongst", true },
	        { "amount", true },
	        { "an", true },
	        { "and", true },
	        { "another", true },
	        { "any", true },
	        { "anyhow", true },
	        { "anyone", true },
	        { "anything", true },
	        { "anyway", true },
	        { "anywhere", true },
	        { "are", true },
	        { "around", true },
	        { "as", true },
	        { "at", true },
	        { "back", true },
	        { "be", true },
	        { "became", true },
	        { "because", true },
	        { "become", true },
	        { "becomes", true },
	        { "becoming", true },
	        { "been", true },
	        { "before", true },
	        { "beforehand", true },
	        { "behind", true },
	        { "being", true },
	        { "below", true },
	        { "beside", true },
	        { "besides", true },
	        { "between", true },
	        { "beyond", true },
	        { "bill", true },
	        { "both", true },
	        { "bottom", true },
	        { "but", true },
	        { "by", true },
	        { "call", true },
	        { "can", true },
	        { "cannot", true },
	        { "cant", true },
	        { "co", true },
	        { "computer", true },
	        { "con", true },
	        { "could", true },
	        { "couldnt", true },
	        { "cry", true },
	        { "de", true },
	        { "describe", true },
	        { "detail", true },
	        { "do", true },
	        { "done", true },
	        { "down", true },
	        { "due", true },
	        { "during", true },
	        { "each", true },
	        { "eg", true },
	        { "eight", true },
	        { "either", true },
	        { "eleven", true },
	        { "else", true },
	        { "elsewhere", true },
	        { "empty", true },
	        { "enough", true },
	        { "etc", true },
	        { "even", true },
	        { "ever", true },
	        { "every", true },
	        { "everyone", true },
	        { "everything", true },
	        { "everywhere", true },
	        { "except", true },
	        { "few", true },
	        { "fifteen", true },
	        { "fify", true },
	        { "fill", true },
	        { "find", true },
	        { "fire", true },
	        { "first", true },
	        { "five", true },
	        { "for", true },
	        { "former", true },
	        { "formerly", true },
	        { "forty", true },
	        { "found", true },
	        { "four", true },
	        { "from", true },
	        { "front", true },
	        { "full", true },
	        { "further", true },
	        { "get", true },
	        { "give", true },
 	        { "go", true },
	        { "had", true },
	        { "has", true },
	        { "have", true },
	        { "he", true },
	        { "hence", true },
	        { "her", true },
	        { "here", true },
	        { "hereafter", true },
	        { "hereby", true },
	        { "herein", true },
	        { "hereupon", true },
	        { "hers", true },
	        { "herself", true },
	        { "him", true },
	        { "himself", true },
	        { "his", true },
	        { "how", true },
	        { "however", true },
	        { "hundred", true },
	        { "i", true },
	        { "ie", true },
	        { "if", true },
	        { "in", true },
	        { "inc", true },
	        { "indeed", true },
	        { "interest", true },
	        { "into", true },
	        { "is", true },
	        { "it", true },
	        { "its", true },
	        { "itself", true },
	        { "keep", true },
	        { "last", true },
	        { "latter", true },
	        { "latterly", true },
	        { "least", true },
	        { "less", true },
	        { "ltd", true },
	        { "made", true },
	        { "many", true },
	        { "may", true },
	        { "me", true },
	        { "meanwhile", true },
	        { "might", true },
	        { "mill", true },
	        { "mine", true },
	        { "more", true },
	        { "moreover", true },
	        { "most", true },
	        { "mostly", true },
	        { "move", true },
	        { "much", true },
	        { "must", true },
	        { "my", true },
	        { "myself", true },
	        { "name", true },
	        { "namely", true },
	        { "neither", true },
	        { "never", true },
	        { "nevertheless", true },
	        { "next", true },
	        { "nine", true },
	        { "no", true },
	        { "nobody", true },
	        { "none", true },
	        { "nor", true },
	        { "not", true },
	        { "nothing", true },
	        { "now", true },
	        { "nowhere", true },
	        { "of", true },
	        { "off", true },
	        { "often", true },
	        { "on", true },
	        { "once", true },
	        { "one", true },
	        { "only", true },
	        { "onto", true },
	        { "or", true },
	        { "other", true },
	        { "others", true },
	        { "otherwise", true },
	        { "our", true },
	        { "ours", true },
	        { "ourselves", true },
	        { "out", true },
	        { "over", true },
	        { "own", true },
	        { "part", true },
	        { "per", true },
	        { "perhaps", true },
	        { "please", true },
            { "png", true },
	        { "put", true },
	        { "rather", true },
	        { "re", true },
	        { "same", true },
	        { "see", true },
	        { "seem", true },
	        { "seemed", true },
	        { "seeming", true },
	        { "seems", true },
	        { "serious", true },
            { "sets", true },
	        { "several", true },
	        { "she", true },
	        { "should", true },
	        { "show", true },
	        { "side", true },
	        { "since", true },
	        { "sincere", true },
	        { "six", true },
	        { "sixty", true },
	        { "so", true },
	        { "some", true },
	        { "somehow", true },
	        { "someone", true },
	        { "something", true },
	        { "sometime", true },
	        { "sometimes", true },
	        { "somewhere", true },
	        { "still", true },
	        { "such", true },
	        { "system", true },
	        { "take", true },
	        { "ten", true },
	        { "than", true },
	        { "that", true },
	        { "the", true },
	        { "their", true },
	        { "them", true },
	        { "themselves", true },
	        { "then", true },
	        { "thence", true },
	        { "there", true },
	        { "thereafter", true },
	        { "thereby", true },
	        { "therefore", true },
	        { "therein", true },
	        { "thereupon", true },
	        { "these", true },
	        { "they", true },
	        { "thick", true },
	        { "thin", true },
	        { "third", true },
	        { "this", true },
	        { "those", true },
	        { "though", true },
	        { "three", true },
	        { "through", true },
	        { "throughout", true },
	        { "thru", true },
	        { "thus", true },
	        { "to", true },
	        { "together", true },
	        { "too", true },
	        { "top", true },
	        { "toward", true },
	        { "towards", true },
	        { "twelve", true },
	        { "twenty", true },
	        { "two", true },
	        { "un", true },
	        { "under", true },
	        { "until", true },
	        { "up", true },
	        { "upon", true },
	        { "us", true },
	        { "very", true },
	        { "via", true },
	        { "was", true },
	        { "we", true },
	        { "well", true },
	        { "were", true },
	        { "what", true },
	        { "whatever", true },
	        { "when", true },
	        { "whence", true },
	        { "whenever", true },
	        { "where", true },
	        { "whereafter", true },
	        { "whereas", true },
	        { "whereby", true },
	        { "wherein", true },
	        { "whereupon", true },
	        { "wherever", true },
	        { "whether", true },
	        { "which", true },
	        { "while", true },
	        { "whither", true },
	        { "who", true },
	        { "whoever", true },
	        { "whole", true },
	        { "whom", true },
	        { "whose", true },
	        { "why", true },
	        { "will", true },
	        { "with", true },
	        { "within", true },
	        { "without", true },
	        { "would", true },
	        { "yet", true },
	        { "you", true },
	        { "your", true },
	        { "yours", true },
	        { "yourself", true },
	        { "yourselves", true }
     */


    };


        static char[] delimiters = new char[] { ' ', ',', ';', '.' };//array of delimeters space comma semi colon fullstop

        
        //method which takes in a string of words to compare against the stop words array
        //returns a string with the unwanted words removed
        public string RemoveStopwords(string input)
        {
            // splits the input string into a list of words broken apart by delimeters defined
            //String split options ensure that empty strings are not returned 
            //The return value does not include array elements that contain an empty string (MSDN)
            var words = input.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);


            //create a new dictionary structure to store the removed words in
            var found = new Dictionary<string, bool>();

            //create a new StringBuilder string structure to store the
            //words to be kept in
            StringBuilder keep = new StringBuilder();

            //loop through the words list of words
            foreach (string currentWord in words)
            {
                string lowerWord = currentWord.ToLower();//convert to lower case to keep words the same (persistance)


                //if the word is not already in stopwords
                //and if it has not already been stored in the found array
                if (!stopWords.ContainsKey(lowerWord) && !found.ContainsKey(lowerWord))
                {
                    keep.Append(currentWord).Append(' ');//append it to the keep Stringbuilder structure
                    found.Add(lowerWord, true);//add to the found Dictionary - so it will not be included again
                }
            }

            return keep.ToString().Trim();//Trim() Removes all leading and trailing white-space characters from the current String object. (MSDN)
        }

    }
}