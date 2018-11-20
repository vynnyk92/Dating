using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddAppError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Application-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Application-Control-Allow-Origin", "*");
        }

        public static int CalculateAge(this DateTime date)
        {
            var a = DateTime.Today.Year - date.Year;
            if (date.AddYears(a) > DateTime.Today)
            {
                a--;
            }

            return a;
        }
    }
}
