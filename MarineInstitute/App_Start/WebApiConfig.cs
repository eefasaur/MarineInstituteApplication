using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Newtonsoft.Json;

//created this config file from ASP.NET MVC5 with Bootstrap and Knockout.js - O'Reilly - page 100
//this creates a default route that will allow the RESTful application to work
//note the URLs are prefixed with api

namespace MarineInstitute.App_Start
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            //Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "Api",
                routeTemplate: "api/{controller}/{action}/{id}",//will change to REST by removing {action}
                defaults: new { id = RouteParameter.Optional}
                );

            config.Routes.MapHttpRoute(
                name: "RCPApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );

            //pulled from http://www.codeproject.com/Articles/874264/Introduction-to-AngularJS-and-WebAPI
            //ensures strict json return type which is fine for this version of the project
                var json = config.Formatters.JsonFormatter;
                json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.None;
                config.Formatters.Remove(config.Formatters.XmlFormatter);
                json.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }
    }
}