using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Implementations;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        public IAuthRepository authRepository { get; set; }
        public IConfiguration configuration { get; set; }
        private IMapper mapper { get; set; }

        public AuthController(IAuthRepository AuthRepository, IConfiguration configData, IMapper mapper)
        {
            this.authRepository = AuthRepository;
            this.configuration = configData;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserRegisterDTO userDTO)
        {
            if (!string.IsNullOrEmpty(userDTO.Username))
                userDTO.Username = userDTO.Username.ToLower();


            if (await authRepository.UserExist(userDTO.Username))
            {
                ModelState.AddModelError("Username", "Username is already taken.");
            }

            //validate request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userToCreate = new User
            {
                Username = userDTO.Username
            };

            var createUser = await authRepository.Register(userToCreate, userDTO.Password);
            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserLoginDTO userDTO)
        {
            var createUser = await authRepository.Login(userDTO.Username.ToLower(), userDTO.Password);
            if (createUser == null)
                return Unauthorized();

            //generate token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration.GetSection("AppSettings:token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, createUser.Id.ToString()),
                    new Claim(ClaimTypes.Name, createUser.Username)
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var user = this.mapper.Map<UserForListDTO>(createUser);

            return Ok(new { tokenString, user });

        }
           
    }
}