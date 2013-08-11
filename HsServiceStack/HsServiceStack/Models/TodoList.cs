using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HsServiceStack.Models
{
    public class TodoList : BaseEntity
    {
        public int Priority { get; set; }
        public List<string> Tags { get; set; }
        public List<TodoItem> TodoItems { get; set; }
    }
}