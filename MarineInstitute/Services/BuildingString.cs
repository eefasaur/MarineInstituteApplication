using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace MarineInstitute.Services
{
    public class BuildingString
    {
        public StringBuilder BuildString(List<String> words)
        {
            StringBuilder sb = new StringBuilder();

            foreach (String s in words)
            {
                sb.Append(s).Append(" ");
            }

            return sb;
        }
    }
}