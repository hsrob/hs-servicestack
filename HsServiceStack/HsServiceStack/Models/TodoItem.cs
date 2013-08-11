using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HsServiceStack.Models
{
    public class TodoItem : BaseEntity
    {
        public int Priority { get; set; }
        public DateTime DueDateTime { get; set; }
    }
}