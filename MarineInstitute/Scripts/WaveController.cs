using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MarineInstitute.Controllers
{
    public class WaveController : ApiController
    {
        //empty controller class waiting for input output methods
        MarineDataEntities db = new MarineDataEntities();
        Wave w = new Wave();


        //GET: api/Wav
        public IHttpActionResult GetWaveKeyword()
        {
            var result = from k in db.Waves
                         select k.Keyword;

            return Ok(result.ToList());

        }


        //GET: api/wave
        public IHttpActionResult GetTag()
        {
            var result = from t in db.Waves
                         select t.SchemaTag;

            return Ok(result.ToList());

        }

        //POST: api/Tide
        public void InsertKeyword(List<String> keywords)
        {
            foreach (String s in keywords)
            {
                w.Keyword = s;

                db.Waves.Add(w);
                db.SaveChanges();
            }
        }

        //POST: api/Tide
        public void InsertTideSchemaTag(List<String> schemaTag)
        {
            foreach (String s in schemaTag)
            {
                w.SchemaTag = s;

                db.Waves.Add(w);
                db.SaveChanges();
            }
        }

        //PUSH: api/Wave

        //DELETE: api/Wave
    }
}
