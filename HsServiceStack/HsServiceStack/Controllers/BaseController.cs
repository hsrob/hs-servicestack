using ServiceStack;
using ServiceStack.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ServiceStack.ServiceInterface.Auth;
using ServiceStack.WebHost.Endpoints;

namespace HsServiceStack.Controllers
{
    public class BaseController : ServiceStackController
    {
        protected AuthService AuthService;
        protected RegistrationService RegistrationService;
        public BaseController()
        {
            AuthService = AppHostBase.Resolve<AuthService>();
            RegistrationService = AppHostBase.Resolve<RegistrationService>();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //Manually set ServiceStack's context to the current MVC RequestContext
            AuthService.RequestContext = System.Web.HttpContext.Current.ToRequestContext();
            RegistrationService.RequestContext = System.Web.HttpContext.Current.ToRequestContext();
            base.OnActionExecuting(filterContext);
        }
    }
}
