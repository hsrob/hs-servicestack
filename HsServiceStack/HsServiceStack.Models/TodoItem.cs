using System;

namespace HsServiceStack.Models
{
    public class TodoItem : BaseEntity
    {
        public int Priority { get; set; }
        public DateTime DueDateTime { get; set; }
    }
}