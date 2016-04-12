﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using Newtonsoft.Json;
using System.Text;
using System.Web.Http;
using MarineInstitute.Services;

namespace WebApplicationProject.Services
{
    //could develop this as one class
    //but for better maintainability i created seperate instances
    //for the parser and the stop word tool
    //this would mean that no code will need to be changed at this
    //class if there were changes within the other classes called
    //(expect for return types)

    public class ParseService
    {
        

        //string xmlFile removed for testing
        
        public string[] Parse(string fileName)
        {

            XmlParser xp = new XmlParser();
            List<String> list = xp.Parse(fileName);//pass file into xml parser
            //returns list of words between the xml nodes (raw text)

            StopwordTool sw = new StopwordTool();
                sw.Get();//pulls the words from the database which populates the stopword dictionary
            
            //runs the list against the stopwords and
            //returns a string with stopwords and duplicates removed
                string words = sw.RemoveStopwords(list);

            string[] wordsList = words.Split(' ');//splits the words string into an array to be returned

            return wordsList;


        }

    }

}

