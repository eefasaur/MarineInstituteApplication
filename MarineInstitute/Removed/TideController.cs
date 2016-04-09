using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


namespace MarineInstitute.Controllers
{
    public class TideController : ApiController
    {
        //empty controller class waiting for input output methods
        MarineDataEntities db = new MarineDataEntities();
        Tide t = new Tide();
        

        //GET: api/Tide
        public IHttpActionResult GetTideKeyword()
        {
            var result = from k in db.Tides
                         select k.Keyword;

            return Ok(result.ToList());

        }


        //GET: api/Tide
        public IHttpActionResult GetTideTag()
        {
            var result = from t in db.Tides
                         select t.SchemaTag;

            return Ok(result.ToList());

        }

        //POST: api/Tide
        public void InsertKeyword(List<String> keywords)
        {
            foreach (String s in keywords)
            {
                t.Keyword = s;

                db.Tides.Add(t);
                db.SaveChanges();
            }
        }

        //POST: api/Tide
        public void InsertTideSchemaTag(List<String> schemaTag)
        {
            foreach (String s in schemaTag)
            {
                t.SchemaTag = s;

                db.Tides.Add(t);
                db.SaveChanges();
            }
        }


        //PUSH: api/Tide

        //DELETE: api/Tide
    }
}
