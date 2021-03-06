﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.DTOs
{
    public class MessageDTO
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; }

        public MessageDTO()
        {
            MessageSent = DateTime.Now;
        }
    }
}
