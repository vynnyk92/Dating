﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    public class MessageParams
    {
        private const int MaxPageSize = 10;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;

        public int PageSize
        {
            get { return pageSize; }
            set
            {
                if (pageSize > MaxPageSize) { pageSize = MaxPageSize; }
                else { pageSize = value; }
            }
        }

        public int UserId { get; set; }
        public string MessageContainer { get; set; } = "Unread";
    }
}
