using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HsServiceStack.Models.Dto
{
    public class TodoListDto : BaseEntity
    {
        public int Priority { get; set; }
        public List<string> Tags { get; set; }
        public List<TodoItemDto> TodoItems { get; set; }
    }
}
