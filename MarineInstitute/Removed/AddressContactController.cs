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



namespace MarineInstitute.Controllers
{
    public class AddressContactController : ApiController
    {
        private MarineDataEntities db = new MarineDataEntities(); //instantiate for entire controller class
        //private AddressContact ac = new AddressContact(); //new instance of AddressContact

        //GET: api/AddressContact
        [HttpGet]
        public IHttpActionResult GetAddressContactKeyword()
        {
            var result = from cat in db.AddressContacts
                         select cat.Keyword;

            return Ok(result.ToList());

        }

        [HttpGet]
        public IHttpActionResult GetAddressContactSchemaTag()
        {
            var result = from cat in db.AddressContacts
                         select cat.SchemaTag;

            return Ok(result.ToList());

        }

        //POST: api/AddressContact
        [HttpPost]//
        public void InsertKeyword(string[] words)
        {
            //string[] words = array;
            
            foreach (string s in words)
            {
                /*
                AddressContact ac = new AddressContact();
                ac.Keyword = s;
                db.AddressContacts.Add(ac);
                db.SaveChanges();
                 */


                TestData td = new TestData();

                td.Test = s;
                db.TestDatas.Add(td);
                db.SaveChanges();
            }
        }
     

        //PUSH: api/AddressContact

        //DELETE: api/AddressContact

    }
}
