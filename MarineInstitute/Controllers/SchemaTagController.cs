using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MarineInstitute.Controllers
{
    public class SchemaTagController : ApiController
    {
        //empty controller class waiting for input output methods

       

        private MarineDataEntities db = new MarineDataEntities(); //instantiate for entire controller class
        //GET: api/SchemaTag
        [HttpGet]
        public IHttpActionResult GetTag()
        {
            var result = from t in db.SchemaTags
                         select t.TagName;

            return Ok(result.ToList());

        }
        //POST: api/SchemaTag

        //PUSH: api/SchemaTag

        //DELETE: api/SchemaTag

    }
}
