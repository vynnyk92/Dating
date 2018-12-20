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

            CreateMap<UserRegisterDTO, User>();

            CreateMap<MessageDTO, Message>().ReverseMap();

            CreateMap<Message, MessageToReturnDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src=>src.id))
            .ForMember(dest => dest.SenderKnownAs, opt =>
            {
                opt.MapFrom(src => src.Sender.KnownAs);
            })
            .ForMember(dest => dest.SenderPhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.MainPhoto == true).Url);
            })
            .ForMember(dest => dest.RecipientKnownAs, opt =>
            {
                opt.MapFrom(src => src.Recipient.KnownAs);
            })
            .ForMember(dest => dest.RecipientPhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(p => p.MainPhoto == true).Url);
            });
        }
    }
}
