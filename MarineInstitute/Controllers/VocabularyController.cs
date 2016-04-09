﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Description;

namespace MarineInstitute.Controllers
{
    public class VocabularyController : ApiController
    {
        private MarineDataEntities db = new MarineDataEntities();
        
        //controller for getting the titles from relevant vocabularies
        //NOT a truely RESTful api

        //GET: api/Vocabulary/

        //THIS WORKS
        [HttpGet]
        public IHttpActionResult GetVocabTitle()
        {
            var result = from voc in db.Vocabularies
                         select voc.Title;

            return Ok(result.ToList());

        }

        //GET: api/Vocabulary/
        [HttpGet]
        public IHttpActionResult Administration()
        {
            var query = from t in db.Vocabularies
                        where t.Catalogues.Any(c => c.CatID == 2007)
                        select t.Title;

            return Ok(query.ToList());//pulled from site
        }

        //GET: api/Vocabulary/
        [HttpGet]
        public IHttpActionResult Oceanography()
        {

            var query = from t in db.Vocabularies
                            where t.Catalogues.Any(c => c.CatID == 2001)
                            select t.Title;
    
            return Ok(query.ToList());
        }


        // GET: api/Vocabulary/
        [HttpGet]
        public IHttpActionResult Meteorology()
        {
            var query = from t in db.Vocabularies
                        where t.Catalogues.Any(c => c.CatID == 2006)
                        select t.Title;

            return Ok(query.ToList());//pulled from site
        }


        // GET: api/Vocabulary/
        [HttpGet]
        public IHttpActionResult OceanEnergy()
        {
            var query = from t in db.Vocabularies
                        where t.Catalogues.Any(c => c.CatID == 2003)
                        select t.Title;

            return Ok(query.ToList());//pulled from site
        }


        //POST: api/Vocabulary/


        //PUSH: api/Vocabulary/

        //DELETE: api/Vocabulary/
    }
}
