﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.DTOs
{
    public class PhotoForCreationDTO
    {
        public string URL { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateTimeAdded { get; set; }
        public string PublicId { get; set; }

        public PhotoForCreationDTO()
        {
            DateTimeAdded = DateTime.Now;
        }
    }
}
