using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using HsServiceStack.Models;
using ServiceStack.OrmLite;

namespace HsServiceStack.Biz.Dal
{
    public interface ITodoBizRepo
    {
        void CreateTestObjects();
        List<TodoList> GetTodoLists();
        TodoList GetTodoList(Guid entityId);
    }
    public class TodoBizRepo : ITodoBizRepo
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;
        public TodoBizRepo(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public void CreateTestObjects()
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
                        Tags = new List<string> { "default" },
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
            }
        }

        public List<TodoList> GetTodoLists()
        {
            using (IDbConnection dbConn = _dbConnectionFactory.Open())
            {
                return dbConn.Select<TodoList>();
            }
        }

        public TodoList GetTodoList(Guid entityId)
        {
            using (IDbConnection dbConn = _dbConnectionFactory.Open())
            {
                return dbConn.Select<TodoList>().FirstOrDefault(t => t.EntityId == entityId);
            }
        }
    }
}
