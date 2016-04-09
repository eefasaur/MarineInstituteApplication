using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;


namespace MarineInstitute.Controllers
{
    public class CatalogueController : ApiController
    {
        private MarineDataEntities db = new MarineDataEntities();

        //GET: api/Catalogue

        //THIS WORKS
        [HttpGet]
        public IHttpActionResult GetCatalogueTitle()
        {
            var result = from cat in db.Catalogues
                         select cat.Title;

            return Ok(result.ToList());
            
        }


        //POST: api/Catalogue
        //[HttpPost]
        public void insertKeyword(string[] words)
        {

        }


        //PUSH: api/Catalogue

        //DELETE: api/Catalogue
    }
}
