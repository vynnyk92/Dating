using AutoMapper;
using DatingApp.API.Models;
using DatingApp.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDTO>()
                .ForMember(dest => dest.photoUrl, opt => {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.MainPhoto).Url);
                })
                .ForMember(dest => dest.Age, opt => {
                    opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
                });
                

            CreateMap<User, UserForDetailDTO>()
                 .ForMember(dest => dest.photoUrl, opt => {
                     opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.MainPhoto).Url);
                 })
                .ForMember(dest => dest.Age, opt => {
                    opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
                });

            CreateMap<UserUpdateDTO, User>();

            CreateMap<Photo, PhotoForDetailDTO>();

            CreateMap<PhotoForCreationDTO, Photo>();

            CreateMap<Photo, PhotoForReturnDTO>();
        }
    }
}
