using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.DTOs;
using DatingApp.API.Implementations;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        public IAuthRepository authRepository { get; set; }
        public AuthController(IAuthRepository AuthRepository)
        {
            this.authRepository = AuthRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO userDTO)
        {
            //validate request
            userDTO.Username = userDTO.Username.ToLower();

            if (await authRepository.UserExist(userDTO.Username))
            {
                return BadRequest("Username is already taken.");
            }

            var userToCreate = new User
            {
                Username = userDTO.Username
            };

            var createUser = await authRepository.Register(userToCreate, userDTO.Password);
            return StatusCode(201);
        }
    }
}