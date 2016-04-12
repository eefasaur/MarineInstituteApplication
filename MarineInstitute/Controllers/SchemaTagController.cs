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

        //GET: api/SchemaTag
        [HttpGet]
        public IHttpActionResult GetTag()
        {
            using (MarineDataEntities db = new MarineDataEntities())
            {
                var result = from t in db.SchemaTags
                             select t.TagName;

                return Ok(result.ToList());
            }
        }
        //POST: api/SchemaTag

        //PUSH: api/SchemaTag

        //DELETE: api/SchemaTag

    }
}
