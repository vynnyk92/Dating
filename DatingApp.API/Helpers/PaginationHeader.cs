using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalPages  { get; set; }
        public int TotalItems  { get; set; }
        public PaginationHeader(int currPage, int pageSize, int totalPages, int totalitems)
        {
            CurrentPage = currPage;
            ItemsPerPage = pageSize;
            TotalPages = totalPages;
            TotalItems = totalitems;
        }
    }
}
