using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Xml;
using System.Web;
using MarineInstitute.Models;
using System.Data.Entity.Validation;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

namespace MarineInstitute.Controllers
{
    public class DataController : ApiController
    {

        private MarineDataEntities db = new MarineDataEntities(); //instantiate for entire controller class


        //using LINQ data queries
        //IHttpActionResult - calls a HttpResponse asynchroniously
        //HttpResponse will return data in line with the preferred format from the request e.g. XML or JSON
        //for this project all Http data will be JSON as it is coming from and being passed to AngularJS

        //GET: api/Data
        [HttpGet]
        public IHttpActionResult GetKeyword()//returns the keyword list from Data table
        {
            var result = from k in db.Data
                         select new { k.Vocab, k.Keyword };
            
            return Ok(result.ToArray());//returns to an array (JSON)

        }

        [HttpGet]
        public IHttpActionResult GetSchemaTag()//returns the tags already stored in the Data table
        {
            var result = from k in db.Data
                         where k.Tag != null
                         select new { k.Vocab, k.Tag };

            return Ok(result.ToArray());//returns as array (JSON)

        }

        //POST: api/Data
        [HttpPost]
        public void Insert(string[] data)//inserting words into the database
        {
            //data array contains a vocabulary title value at index[0]
            //appended to that is the list of words to be inserted into database data table
            //index[0] is skipped so that it is not added as a keyword
            //for each value starting at index[1] the vocabulary title (index[0]) and the 
            //i'th value in the array are added into the vocab and keyword columns in the 
            //Data table
            foreach (string w in data.Skip(1))
                {
                    Data d = new Data();
                    
                    d.Vocab = data[0];
                    
                    d.Keyword = w;
                    db.Data.Add(d);
                    db.SaveChanges();

                }
            //NOTE originally i was passing a JSON object array with key value pairs
            //but as they were two different data types, a string in first index and an array
            //in second, it was very difficult to receive in the controller
        }
        
        //POST: api/Data

        //ideally this will be reworked to provide a more stable method - currently
        //not appropriate as it is creating a new connection to the database and avoiding
        //the model altogether - however it works for now!!!
        [HttpPost]
        public void InsertTag(string[] data)
        {
            string keyword = data[0];
            string tag = data[1];

            string connString = "Server=lugh4.it.nuigalway.ie; database=msdb2294; uid=msdb2294A";
            SqlConnection connection = new SqlConnection(connString);

            try
            {
                connection.Open();

                string query = @"UPDATE Data SET Tag = @tag WHERE Keyword = @keyword";
                SqlCommand command = new SqlCommand(query, connection);
                //set values
                command.Parameters.AddWithValue("@tag", tag);
                command.Parameters.AddWithValue("@keyword", keyword);

                command.ExecuteNonQuery();
            }
            catch { }
            finally
            {
                if (connection != null) 
                {
                    connection.Close();
                }
                
            }
                

        }

        //PUSH: api/Data

        //DELETE: api/Data

    }
}
