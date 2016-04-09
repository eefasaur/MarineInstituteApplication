using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using Newtonsoft.Json;
using System.Text;
using System.Web.Http;

namespace WebApplicationProject.Services
{
    //entire parsing sequence in one long class for testing
    //should i break into a number of classes for better decoupling?
    //or for spa is it ok to have one service class for one task...

    public class ParseService
    {
        

        //string xmlFile removed for testing
        
        public string[] Parse(string fileName)
        {

            List<String> rawText = new List<String>();

            //string xmlFile = @"C:\Users\eefasaur\Documents\Visual Studio 2013\Projects\ConsoleTests\ConsoleTests\Fisheries Biologically Sensitive Area_xml_iso19139.xml";

            XmlDocument doc = new XmlDocument();
            //doc.Load(xmlFile);
            doc.Load(fileName);

            XmlNamespaceManager nsmgr = new XmlNamespaceManager(doc.NameTable);
            nsmgr.AddNamespace("gco", "http://www.isotc211.org/2005/gco");

            XmlNodeList nodes = doc.SelectNodes("//gco:CharacterString", nsmgr);

            foreach (XmlNode node in nodes)
            {
                string text = node.InnerText;
                rawText.Add(text);

                //Console.WriteLine(node.InnerText);
            }

            StringBuilder sb = new StringBuilder();
            
            foreach (String s in rawText)
            {
                sb.Append(s).Append(" ");
            }

            string bulk = sb.ToString();

            StopwordTool sw = new StopwordTool();
            sw.Get();
            string words = sw.RemoveStopwords(bulk);

            string[] wordsList = words.Split(' ');

            return wordsList;


        }

    }

}

