using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private IDatingRepository dataContext { get; set; }
        private IMapper mapper { get; set; }
        public UsersController(IDatingRepository context, IMapper mapper)
        {
            this.dataContext = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await this.dataContext.GetUsersAsync();
            var usersToReturn = mapper.Map<IEnumerable<UserForListDTO>>(users);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await this.dataContext.GetUserAsync(id);
            var userToReturn = mapper.Map<UserForDetailDTO>(user);

            return Ok(userToReturn);
        }      

    }
}
