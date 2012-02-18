using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;
using Nancy.ModelBinding;
using Simple.Data;

namespace LeWall.Modules
{
    public class Post : NancyModule
    {
        public Post()
            : base("/posts")
        {
            Get["/"] = p =>
            {
                if (Request.Query["last_id"].HasValue)
                {
                    int last_id = (int)Request.Query["last_id"];
                    var db = Database.Open();
                    List<dynamic> posts = db.Posts
                                            .FindAll(db.Posts.ID > last_id)
                                            .OrderBy(db.Posts.DateCreated)
                                            .Take(10)
                                            .ToList();
                    return Response.AsJson(posts);
                }
                else
                {
                    var db = Database.Open();
                    List<dynamic> posts = db.Posts
                                            .All()
                                            .OrderBy(db.Posts.DateCreated)
                                            .Take(10)
                                            .ToList();
                    return Response.AsJson(posts);
                }
            };

            Post["/"] = p =>
            {
                var db = Database.Open();
                var post = this.Bind<dtoPost>();
                db.Posts.Insert(Message: post.Message);
                return HttpStatusCode.Accepted;
            };
        }

        public class dtoPost
        {
            public string Message { get; set; }
        }
    }
}