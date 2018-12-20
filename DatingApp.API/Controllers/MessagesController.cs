using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    public class MessagesController : Controller
    {
        private IDatingRepository dataContext { get; set; }
        private IMapper mapper { get; set; }
        public IOptions<CloudinarySettings> _cloudinarySettings { get; set; }
        public MessagesController(IDatingRepository context, IMapper mapper)
        {
            this.dataContext = context;
            this.mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int id)
        {
            var message = await dataContext.GetMessageAsync(id);
            return Ok(mapper.Map<MessageDTO>(message));
        }

        [HttpGet("/thread/{recipientId}")]
        public async Task<IActionResult> GetThread(int userId, int recipientId)
        {
            var messageThread = await dataContext.GetMessagesThreadAsync(userId, recipientId);
            return Ok(mapper.Map<IEnumerable<MessageDTO>>(messageThread));
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, [FromBody] MessageDTO messageDTO)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (userId != currentUserId)
                return Unauthorized();


            messageDTO.SenderId = userId;

            var recipient = await dataContext.GetUserAsync(messageDTO.RecipientId);

            if (recipient == null)
                return BadRequest("User doesn't exist");

            var message = mapper.Map<Message>(messageDTO);

            dataContext.AddAsync<Message>(message);

            if (await dataContext.SaveAllAsync())
                return CreatedAtRoute("GetMessage", new { id = message.id }, mapper.Map<MessageDTO>(message));

            else
                return BadRequest("Can't create message");
        }

        [HttpPost("/delete/{messageId}")]
        public async Task<IActionResult> DeleteMessage(int userId, int messageId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (userId != currentUserId)
                return Unauthorized();

            var messageFromRepo = await dataContext.GetMessageAsync(messageId);

            if(messageFromRepo== null)
                return BadRequest("Can't find message.");

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                dataContext.DeleteAsync<Message>(messageFromRepo);

            if (await dataContext.SaveAllAsync())
                return NoContent();

            return BadRequest("Something went wrong");
        }


        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageParams messageParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (userId != currentUserId)
                return Unauthorized();

            var messFroRepo = await dataContext.GetMessagesForUserAsync(messageParams);

            var messages = mapper.Map<IEnumerable<MessageToReturnDTO>>(messFroRepo);

            Response.AddPagination(messFroRepo.CurrentPage, messFroRepo.PageSize, messFroRepo.TotalCount, messFroRepo.TotalPages);

            return Ok(messages);
        }

        [HttpPost("/markAsRead/{messageId}")]
        public async Task<IActionResult> MarkAsRead(int userId, int messageId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (userId != currentUserId)
                return Unauthorized();

            var messageFromRepo = await dataContext.GetMessageAsync(messageId);

            if (messageFromRepo == null)
                return BadRequest("Can't find message.");

            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;

            if (await dataContext.SaveAllAsync())
                return NoContent();

            return BadRequest("Something went wrong");
        }
    }
}
