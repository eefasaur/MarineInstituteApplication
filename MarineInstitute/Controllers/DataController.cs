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

        //GET: api/Data
        [HttpGet]
        public IHttpActionResult GetKeyword()
        {
            var result = from k in db.Data
                         select new { k.Vocab, k.Keyword };
            
            return Ok(result.ToArray());

        }

        [HttpGet]
        public IHttpActionResult GetSchemaTag()
        {
            var result = from k in db.Data
                         where k.Tag != null
                         select new { k.Vocab, k.Tag };

            return Ok(result.ToArray());

        }

        //POST: api/Data
        [HttpPost]
        public void Insert(string[] data)
        {
 
            foreach (string w in data.Skip(1))
                {
                    Data d = new Data();
                    
                    d.Vocab = data[0];
                    
                    d.Keyword = w;
                    db.Data.Add(d);
                    db.SaveChanges();

                }

        }

        //POST: api/Data
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
