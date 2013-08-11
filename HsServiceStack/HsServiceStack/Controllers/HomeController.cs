using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using HsServiceStack.Models;
using ServiceStack.OrmLite;

namespace HsServiceStack.Controllers
{
    public class HomeController : Controller
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public HomeController(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public ActionResult Index()
        {
            using (IDbConnection dbConn = _dbConnectionFactory.Open())
            {
                if (!dbConn.TableExists("TodoList") || dbConn.Count<TodoList>() == 0)
                {
                    dbConn.CreateTable<TodoList>();
                    //dbConn.Insert();
                    dbConn.Save(new TodoList
                        {
                            CreatedDateTime = DateTime.Now,
                            ModifiedDateTime = DateTime.Now,
                            EntityId = Guid.NewGuid(),
                            Name = "Default List",
                            Priority = 1,
                            Tags = new List<string> {"default"},
                            TodoItems = new List<TodoItem>
                                {
                                    new TodoItem
                                        {
                                            CreatedDateTime = DateTime.Now,
                                            ModifiedDateTime = DateTime.Now,
                                            EntityId = Guid.NewGuid(),
                                            Name = "Default List",
                                            Priority = 1,
                                            DueDateTime = DateTime.Now.AddDays(7)
                                        }
                                }
                        });
                }

                List<TodoList> todoLists = dbConn.Select<TodoList>();
                return View(todoLists);
            }
        }
    }
}