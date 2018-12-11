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
    [Route("api/users/{userId}/photos")]
    public class PhotosController : Controller
    {
        private IDatingRepository dataContext { get; set; }
        private IMapper mapper { get; set; }
        public IOptions<CloudinarySettings> _cloudinarySettings { get; set; }
        private Cloudinary photoCloud;
        public PhotosController(IDatingRepository context, IMapper mapper, IOptions<CloudinarySettings> cloudinarySettings)
        {
            this.dataContext = context;
            this.mapper = mapper;
            this._cloudinarySettings = cloudinarySettings;

            Account acc = new Account(_cloudinarySettings.Value.CloudName, _cloudinarySettings.Value.ApiKey, _cloudinarySettings.Value.ApiSecret);

            photoCloud = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await dataContext.GetPhotoAsync(id);
            var photo = mapper.Map<PhotoForReturnDTO>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoToUser(int userId, PhotoForCreationDTO photoForCreationDTO)
        {
            var user = await dataContext.GetUserAsync(userId);

            if (user == null)
                return BadRequest("Couldn't find user");

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (userId != currentUserId)
                return Unauthorized();

            var file = photoForCreationDTO.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(1000).Height(1000).Crop("fill").Gravity("face")
                    };

                    uploadResult = photoCloud.Upload(uploadParams);
                }
            }

            photoForCreationDTO.URL = uploadResult.Uri.ToString();
            photoForCreationDTO.PublicId = uploadResult.PublicId.ToString();


            var photo = mapper.Map<Photo>(photoForCreationDTO);
            photo.User = user;

            if (!user.Photos.Any(m => m.MainPhoto))
                photo.MainPhoto = true;

            dataContext.AddAsync<Photo>(photo);
            

            if (await dataContext.SaveAllAsync())
            {
                var photoToReturn = mapper.Map<PhotoForReturnDTO>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }

            return BadRequest("Couldn't add thephoto");
        }


        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(int userId, int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (userId != currentUserId)
                return Unauthorized();

            var photoFromRepo = await dataContext.GetPhotoAsync(id);
            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.MainPhoto)
                return BadRequest("Already the main photo");

            var currentMainPhoto = await dataContext.GetMainPhotoAsync(userId);

            if (currentMainPhoto != null)
                currentMainPhoto.MainPhoto = false;

            photoFromRepo.MainPhoto = true;

            if (await dataContext.SaveAllAsync())
                return NoContent();

            return BadRequest("Couldn't set photo to main.");
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int userId, int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (userId != currentUserId)
                return Unauthorized();

            var photoFromRepo = await dataContext.GetPhotoAsync(id);
            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.MainPhoto)
                return BadRequest("You can't delete the main photo");

            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = photoCloud.Destroy(deleteParams);

                if (result.Result == "ok")
                    dataContext.DeleteAsync<Photo>(photoFromRepo);

             
            }

            if (photoFromRepo.PublicId == null)
            {
                dataContext.DeleteAsync<Photo>(photoFromRepo);
            }

            if (await dataContext.SaveAllAsync())
                return NoContent();

            return BadRequest("Couldn't delete the photo.");
        }
    }
}
