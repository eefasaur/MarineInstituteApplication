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
            using (MarineEntities db = new MarineEntities())
            {
                var result = from k in db.Data
                             where k.Tag != null
                             select new { k.Tag };

                return Ok(result.ToArray());//returns as array (JSON)
            }
            
        }
        //POST: api/SchemaTag

        //PUSH: api/SchemaTag

        //DELETE: api/SchemaTag

    }
}
