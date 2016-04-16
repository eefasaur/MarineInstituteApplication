using MarineInstitute;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



//http://www.dotnetperls.com/stopword-dictionary

namespace WebApplicationProject
{
    public class StopwordTool
    {
        MarineEntities db = new MarineEntities();

        //this calls the current stopWords stored in the databse and adds them to the stopWords dictionary
        //this is done each time the program is run against an xmlFile
        //i chose to do this to keep the data up to date and avoid manual insertion
            public void Get()
            {
                        
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
	       
        //dyamically updated each time program is run with stopwords from the database
        //probably not the most efficient way but works for showing functionality


    };


        static char[] delimiters = new char[] { ' ', ',', ';', '.' };//array of delimeters space comma semi colon fullstop

        
        //method which takes in a string of words to compare against the stop words array
        //returns a string with the unwanted words removed
        public string RemoveStopwords(string input)
        {
            //converts the list to a string so it can be split
            //had orginally had a seperate class to change list to string builder to string
            //but was a lot of work for which one line of code in this class could handle
                //string input = list.ToString();

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