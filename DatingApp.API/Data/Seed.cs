using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _dataContext;
        public IPasswordHashCreator passwordHashCreator { get; set; }
        public Seed(DataContext dataContext, IPasswordHashCreator passwordHashCreator)
        {
            _dataContext = dataContext;
            this.passwordHashCreator = passwordHashCreator;
        }

        public void SeedData()
        {
            //_dataContext.Users.RemoveRange(_dataContext.Users);
            //_dataContext.SaveChanges();

            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);

            users.ForEach(u => {

                //create 
                byte[] passwordHash, passwordSalt;
                CreatePasswortHash("password", out passwordHash, out passwordSalt);

                u.PasswordHash = passwordHash;
                u.PasswordSalt = passwordSalt;
                u.Username = u.Username.ToLower();

                _dataContext.Add(u);
            });

            _dataContext.SaveChanges();
        }

        private void CreatePasswortHash(string password,out byte[] passwordHash, out byte[] passwordSalt)
        {
            passwordHashCreator.CreatePasswordHash(password, out passwordHash, out passwordSalt);
        }
    }
}
