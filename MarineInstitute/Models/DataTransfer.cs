using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarineInstitute.Models
{
    public class DataTransfer
    {
        private string vocab;
        private string[] list;

        public DataTransfer()
        {
            
        }

        public string Vocab {get; set; }
        public string[] List {get; set; }

    }
}