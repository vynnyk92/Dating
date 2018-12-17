using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
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
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await dataContext.GetUserAsync(currentUserId);
            userParams.UserId = userFromRepo.Id;
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male"? "female": "male";
            }          

            var users = await this.dataContext.GetUsersAsync(userParams);
            var usersToReturn = mapper.Map<IEnumerable<UserForListDTO>>(users);
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name ="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await this.dataContext.GetUserAsync(id);
            var userToReturn = mapper.Map<UserForDetailDTO>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody]UserUpdateDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await dataContext.GetUserAsync(id);

            if (userFromRepo == null)
            {
                return NotFound($"Couldn't find user {id}");
            }
            if (currentUserId != userFromRepo.Id)
                return Unauthorized();

            mapper.Map(userDTO, userFromRepo);

            if (await dataContext.SaveAllAsync())
                return NoContent();

            throw new Exception($"Update failed for user {id}");
        }
    }
}
