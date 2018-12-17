using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

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

        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalPages, totalItems);
            var camelCase = new JsonSerializerSettings();
            camelCase.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCase));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
