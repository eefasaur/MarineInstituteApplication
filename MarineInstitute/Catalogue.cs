//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MarineInstitute
{
    using System;
    using System.Collections.Generic;
    
    public partial class Catalogue
    {
        public Catalogue()
        {
            this.Vocabularies1 = new HashSet<Vocabulary>();
        }
    
        public int CatID { get; set; }
        public string Title { get; set; }
        public string Vocabularies { get; set; }
    
        public virtual ICollection<Vocabulary> Vocabularies1 { get; set; }
    }
}
