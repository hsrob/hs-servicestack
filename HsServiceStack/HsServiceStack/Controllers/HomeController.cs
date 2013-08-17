using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using HsServiceStack.Biz.Dal;
using HsServiceStack.Models;
using ServiceStack.OrmLite;

namespace HsServiceStack.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}