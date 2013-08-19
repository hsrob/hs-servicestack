using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HsServiceStack.Models.Dto
{
    public class TodoItemDto : BaseEntity
    {
        public int Priority { get; set; }
        public DateTime DueDateTime { get; set; }
    }
}
