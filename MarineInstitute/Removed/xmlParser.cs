using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;

namespace MarineInstitute.Services
{
    public class xml//XmlParser
    {
        
        public List<String> Parse(string fileName)
        {
            List<String> rawText = new List<String>();//instantiate the list to be returned

            //string xmlFile = @"C:\Users\eefasaur\Documents\Visual Studio 2013\Projects\ConsoleTests\ConsoleTests\Fisheries Biologically Sensitive Area_xml_iso19139.xml";

            XmlDocument doc = new XmlDocument();//create a new xmlDocument
            doc.Load(fileName);//load the file path into the document
                               //Load loads the file LoadXml loads the raw xml

            //as the MI use predefined schema encoding on their xml this needed to be defined in order for the file to be parsed
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(doc.NameTable);
                nsmgr.AddNamespace("gco", "http://www.isotc211.org/2005/gco");

            //all nodes that wrapped raw text where characterstring nodes
            //this makes the parser return this text only
                XmlNodeList nodes = doc.SelectNodes("//gco:CharacterString", nsmgr);

            foreach (XmlNode node in nodes)
            {
                string text = node.InnerText;
                rawText.Add(text);//adds the strings of text inot the rawText list
            }
            return rawText;//returns a list of strings
        }
    }
}