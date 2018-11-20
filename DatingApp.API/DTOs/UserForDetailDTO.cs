﻿using DatingApp.API.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.DTOs
{
    public class UserForDetailDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
      
        public string Gender { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public ICollection<PhotoForDetailDTO> Photos { get; set; }
        public string photoUrl { get; set; }

        //public UserForDetailDTO()
        //{
        //Photos = new Collection<Photo>();
        //}
    }
}
