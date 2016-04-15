using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.SqlServer.Server;

namespace MarineInstitute.Services
{
    public class FileUpload
    {
        public HttpPostedFileBase fileName { get; set; }

        public void GetFile()
        {

        }
      

        
    }
}
//http://stackoverflow.com/questions/5193842/file-upload-asp-net-mvc-3-0




/*
 * 
 * //http://www.htmlgoodies.com/beyond/javascript/read-text-files-using-the-javascript-filereader.html#fbid=dQdSE-naPNP
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  //do your stuff!
} else {
  alert('The File APIs are not fully supported by your browser.');
}
*/