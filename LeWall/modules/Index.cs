using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace LeWall.Modules
{
    public class Index : NancyModule
    {
        public Index()
        {
            Get["/"] = p => View["index"];
        }
    }
}