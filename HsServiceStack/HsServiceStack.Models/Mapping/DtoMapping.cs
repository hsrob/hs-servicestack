using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using HsServiceStack.Models.Dto;

namespace HsServiceStack.Models.Mapping
{
    public class DtoMapping
    {
        public static void MapAllDtos()
        {
            Mapper.CreateMap<TodoItem, TodoItemDto>().ReverseMap();
            Mapper.CreateMap<TodoList, TodoListDto>().ReverseMap();
        }
    }
}
