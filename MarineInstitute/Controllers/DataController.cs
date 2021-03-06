﻿using System;
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

        //private MarineDataEntities db = new MarineDataEntities(); //instantiate for entire controller class
        //it is better to use "using(MarineDataEntities db = new MarineDataEntities())" for each call to db
        //as once the method ends the connection is closed automatically

        //using LINQ data queries
        //IHttpActionResult - calls a HttpResponse asynchroniously
        //HttpResponse will return data in line with the preferred format from the request e.g. XML or JSON
        //for this project all Http data will be JSON as it is coming from and being passed to AngularJS

        //GET: api/Data
        [HttpGet]
        public IHttpActionResult GetKeyword()//returns the keyword list from Data table
        {
            using (MarineDataEntities db = new MarineDataEntities())
            {
                var result = from k in db.Data
                             select new { k.Vocab, k.Keyword };

                return Ok(result.ToArray());//returns to an array (JSON)
            }
        }

        [HttpGet]
        public IHttpActionResult GetSchemaTag()//returns the tags already stored in the Data table
        {
            using (MarineDataEntities db = new MarineDataEntities())
            {
                var result = from k in db.Data
                             where k.Tag != null
                             select new { k.Vocab, k.Tag };

                return Ok(result.ToArray());//returns as array (JSON)
            }
        }

        //POST: api/Data
        [HttpPost]
        public void Insert(string[] data)//inserting words into the database
        {
            using (MarineDataEntities db = new MarineDataEntities())
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

                }
                db.SaveChanges();//better for performance
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
            using (MarineDataEntities db = new MarineDataEntities())
            {

                string word = data[0];
                string tag = data[1];


                List<Data> results = (from r in db.Data
                        where r.Keyword == word
                        select r).ToList();

                foreach (Data d in results)
                {
                    d.Tag = tag;
                }

                db.SaveChanges();
            }

        }

        //PUSH: api/Data

        //DELETE: api/Data

    }
}
