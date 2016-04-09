using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Data.Entity;
using MarineInstitute;
using System.Web.Http;
using MarineInstitute.App_Start;//had to add for global configuration (prompted by VS)


//updated global file from ASP.NET MVC5 with Bootstrap and Knockout.js - O'Reilly - page 101

namespace MarineInstitute
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
        //initialisation code
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);//added to register the webapiconfig file
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            
            //how we set up the bundles - references App_Start BundleConfig                                                        
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
