using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MarineInstitute.Controllers
{
    public class StopwordController : ApiController
    {
        MarineDataEntities db = new MarineDataEntities();
        //StopWordList sw = new StopWordList();


    //probably not needed in Web Api as it will only ever be called internally?
        //GET: api/Stopword/
        public IHttpActionResult Get()
        {
            var result = from w in db.StopWordLists
                         select w.Stopword;

            return Ok(result.ToList());

        }
        
        
        
        //POST: api/Stopword/
        //
        [HttpPost]//
        public void Insert(string[] words)
        {
            //if list array is hard coded in here then the following code will write to db
 
            foreach (string w in words)
            {
                try
                {

                    StopWordList sw = new StopWordList();
                    sw.Stopword = w;
                    db.StopWordLists.Add(sw);
                    db.SaveChanges();

                    /*
                    TestData td = new TestData();

                    td.Test = w;
                    db.TestDatas.Add(td);
                    db.SaveChanges();
                     */
                }
                //http://stackoverflow.com/questions/5400530/validation-failed-for-one-or-more-entities-while-saving-changes-to-sql-server-da
                catch (DbEntityValidationException dbEx)
                {
                    foreach (var errors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in errors.ValidationErrors)
                        {
                            Trace.TraceInformation("Property: {0} Error: {1}",
                                                    validationError.PropertyName,
                                                    validationError.ErrorMessage);
                        }
                    }
                }
            }
        }

    }
}
