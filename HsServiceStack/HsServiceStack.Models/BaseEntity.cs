using System;

namespace HsServiceStack.Models
{
    public class BaseEntity
    {
        public Guid EntityId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime ModifiedDateTime { get; set; }
    }
}