using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HsServiceStack.Models;
using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface;
using HsServiceStack.Biz.Dal;

namespace HsServiceStack.WebServices
{
    [Route("/todo", "GET")]
    public class TodoListRequest
    {
        public Guid? TodoListId { get; set; }
    }

    public class TodoListResponse
    {
        public List<TodoList> Results { get; set; }
    }

    public class TodoListService : Service
    {
        private readonly ITodoBizRepo _todoBizRepo;
        public TodoListService(ITodoBizRepo todoBizRepo)
        {
            _todoBizRepo = todoBizRepo;
        }

        public object Get(TodoListRequest request)
        {
            return new TodoListResponse
                   {
                       Results = request.TodoListId.HasValue
                           ? new List<TodoList> {_todoBizRepo.GetTodoList(request.TodoListId.Value)}
                           : _todoBizRepo.GetTodoLists()
                   };
        }
    }
}