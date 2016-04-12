using System.Web;
using System.Web.Optimization;


//set up js and css files for bundling 
//will be modified throughout module

namespace MarineInstitute
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        
        public static void RegisterBundles(BundleCollection bundles)
        {
            //template bundles
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(//virtual path
                        "~/Scripts/jquery-{version}.js"));//real path //version gets replaced

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            //css
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));


            //my own bundles
            //style
            bundles.Add(new StyleBundle("~/bundles/MIApp/style").Include(
                      "~/Content/bootstrap.css",//physical css filenames, as many as i want
                      "~/Content/site.css",
                      "~/Content/InsertPageStyle.css"));//do i need seperate pages?
            //site layout
            //vocab
            //insert

            //script
            bundles.Add(new ScriptBundle("~/bundles/MIApp/script").Include(
                        "~/Scripts/angular-ui/angular.js",//javascript file names
                        "~/Scripts/angular-ui/ui-bootstrap.js",//unminified versions as mvc minifies automatically
                        "~/Scripts/angular-ui/angular-route.js",
                        "~/Scripts/angular-ui/myApp.js"));

        }
    }
}
