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
        
        //GET: api/Stopword/
        public IHttpActionResult Get()
        {
            using (MarineDataEntities db = new MarineDataEntities())
            {
                var result = from w in db.StopWordLists
                             select w.Stopword;

                return Ok(result.ToList());
            }
        }
        
        
        
        //POST: api/Stopword/
        //
        [HttpPost]//
        public void Insert(string[] words)
        {
            //if list array is hard coded in here then the following code will write to db
            using (MarineDataEntities db = new MarineDataEntities())
            {
                foreach (string w in words)
                {
                    try
                    {

                        StopWordList sw = new StopWordList();//create new instance
                        sw.Stopword = w;//set the stop word to value of w
                        db.StopWordLists.Add(sw);//add the new stopword to the add method
                        db.SaveChanges();

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
                    }//end catch
                    //db.SaveChanges();//save changes together - faster
                }//end foreach
            }//end using
        }

    }
}
