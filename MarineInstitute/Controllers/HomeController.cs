using MarineInstitute.FileTypeAdapter;
using MarineInstitute.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplicationProject;
using WebApplicationProject.Services;


namespace MarineInstitute.Controllers
{
    public class HomeController : Controller
    {
        //keeping for views only

        public ActionResult Index()//homepage index
        {
            return View();//index.cshtml
        }

        public ActionResult Create()//application page
        {
            ViewBag.Message = "This is where you can create Schema.org tags from your pre-defined tags and library.";

            return View();
        }

        public ActionResult Insert()//insert tags page
        {
            ViewBag.Message = "This is where you will insert the Schema.org tags into a text/html document.";

            return View();
        }

        public ActionResult About()//about page
        {
            ViewBag.Message = "Explain your application here.";

            return View();
        }

        public ActionResult Contact()//contact page
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        //string fileName - taken out for now until upload issue is resolved
        public ActionResult Parse()//calling parse service
        {
   
            ParseService ps = new ParseService();//creating a new parse service
            //ps.register("xml", new XmlParser());//registering the file type xml
   
            //hard coded path of file we're going to parse
                string fileName = @"C:\Users\eefasaur\Documents\Visual Studio 2013\Projects\ConsoleTests\ConsoleTests\Fisheries Biologically Sensitive Area_xml_iso19139.xml";

            //creating new instance of file type
                FileType file = new FileType("xml", fileName);
            
            
            var result = ps.Parse(file);//calling the parse method within ParseService class (passing in file type)

            return Json(result.ToList(), JsonRequestBehavior.AllowGet);

        }

        /*

        public void StopWords()//calling parse service
        {
            StopwordTool sw = new StopwordTool();
            sw.Get();
        }

        //add to stopwords
        public void AddStopWord(string[] words)
        {
            StopwordTool sw = new StopwordTool();
            
            foreach(string w in words){
                sw.Add(w);
            }

            Console.WriteLine(sw.stopWords);
        }

        //call upload service
      */


    }
}