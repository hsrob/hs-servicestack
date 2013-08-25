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
        void SaveTodoList(TodoList todoList);
        void AddTodoItem(Guid todoListId, TodoItem todoItem);
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

        //Get
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
        
        //Insert
        public void SaveTodoList(TodoList todoList)
        {
            //new only
            if (todoList.EntityId == default(Guid))
            {
                todoList.EntityId = Guid.NewGuid();
                todoList.CreatedDateTime = DateTime.Now;
            }
            todoList.ModifiedDateTime = DateTime.Now;
            using (IDbConnection dbConn = _dbConnectionFactory.Open())
            {
                dbConn.Save(todoList);
            }
        }

        public void AddTodoItem(Guid todoListId, TodoItem todoItem)
        {
            
            todoItem.EntityId = Guid.NewGuid();
            todoItem.CreatedDateTime = DateTime.Now;
            todoItem.ModifiedDateTime = DateTime.Now;
            using (var dbConn = _dbConnectionFactory.Open())
            {
                var tdList = dbConn.FirstOrDefault<TodoList>(t => t.EntityId == todoListId);
                if(tdList.TodoItems == null)
                    tdList.TodoItems = new List<TodoItem>();
                tdList.TodoItems.Add(todoItem);
                dbConn.Update(tdList);
            }
        }
    }
}
