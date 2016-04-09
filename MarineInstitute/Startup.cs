using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MarineInstitute.Startup))]
namespace MarineInstitute
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
