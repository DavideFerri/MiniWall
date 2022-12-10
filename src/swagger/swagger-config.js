/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

//import models
swaggerSchemas = require("./schemas.js")
const {User_s,Post_s,Comment_s,Like_s} = require("./schemas.js")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Miniwall API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple API that allows the users to post their thoughts on a wall and see what everybody posts, to make comments to other people posts, and like them.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      }
    },
    components: {
      schemas: swaggerSchemas
    },
    paths: {
      "/user/register":{
        post: {
          summary: "Register new user",
          requestBody: {
            required: true,
            content: {
              "application/json":{
                schema:{
                  type: "object",
                  properties: {
                    "username":{
                      type: "string"
                    },
                    "email":{
                      type: "string"
                    },
                    "password":{
                      type: "string"
                    }
                  },
                  required: ["username","email","password"]
                }
                }
                }
              },
          responses: {
            '200': {
                description: "User created",
                content:
                  {"application/json" :{
                    schema:{
                      $ref: "#components/schemas/User_s"
                    }
                      }
                  }
            }
            }
        }
      },
      "/user/login":{
        post: {
          summary: "Login existing user",
          requestBody: {
            required: true,
            content: {
              "application/json":{
                schema:{
                  type: "object",
                  properties: {
                    "email":{
                      type: "string"
                    },
                    "password":{
                      type: "string"
                    }
                  },
                  required: ["email","password"]
                }
                }
                }
              },
          responses: {
              '200': {
                  description: "Auth token",
                  content:
                    {"application/json" :{
                      schema:{
                        type: "object",
                        properties: {
                          "auth-token":{
                            type: "string"
                          }
                        }
                      }
                        }
                    }
                }
            }
        }
      },
      "/posts": {
        get: {
          summary: "Returns a list of posts",
          parameters: [
            {
            in: "header",
            name: "auth-token",
            schema: {
              type: "string"
            },
            required: true
          }
          ],
          responses: {
              '200': {
                  description: "Array of posts",
                  content:
                    {"application/json" :{
                      schema:{
                        type: "array",
                        items: {
                          $ref: "#components/schemas/Post_s"
                        }
                      }
                        }
                    }
              }
          }
        },
        post: {
          summary: "It creates a new post",
          parameters: [
            {
            in: "header",
            name: "auth-token",
            schema: {
              type: "string"
            },
            required: true
          }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json":{
                schema:{
                  type: "object",
                  properties: {
                    "title":{
                      type: "string"
                    },
                    "text":{
                      type: "string"
                    }
                  },
                  required: ["title","text"]
                }
                }
                }
              },
          responses: {
              '200': {
                  description: "The post created",
                  content:
                    {"application/json" :{
                      schema:{
                          $ref: "#components/schemas/Post_s"
                        }
                      }
                        }
                    }
              }
        }
                },
      "/posts/{postId}":{
        get: {
          summary: "Returns post with given id",
          parameters: [
            {
            in: "header",
            name: "auth-token",
            schema: {
              type: "string"
            },
            required: true
            },
            {
              in: "path",
              name: "postId",
              schema: {
                type: "string"
              },
              required: true
            }
          ],
          responses: {
            '200': {
                description: "The post retrieved",
                content:
                  {"application/json" :{
                    schema:{
                        $ref: "#components/schemas/Post_s"
                      }
                    }
                      }
                  }
            }
        },
        put: {
          summary: "Modifies existing post",
          parameters: [
            {
            in: "header",
            name: "auth-token",
            schema: {
              type: "string"
            },
            required: true
            },
            {
              in: "path",
              name: "postId",
              schema: {
                type: "string"
              },
              required: true
            }
            ],
          requestBody: {
            required: true,
            content: {
              "application/json":{
                schema:{
                  type: "object",
                  properties: {
                    "title":{
                      type: "string"
                    },
                    "text":{
                      type: "string"
                    }
                  },
                  required: ["title","text"]
                }
                }
                }
              },
          responses: {
              '200': {
                  description: "Modification confirmation",
                    }
              }
        },
        delete :{
          summary: "Delete existing post",
          parameters: [
            {
            in: "header",
            name: "auth-token",
            schema: {
              type: "string"
            },
            required: true
            },
            {
              in: "path",
              name: "postId",
              schema: {
                type: "string"
              },
              required: true
            }
            ],
          responses: {
              '200': {
                  description: "Deletion confirmation",
                    }
              }
        }
    },
    "/posts/{postId}/likes":{
      get: {
        summary: "Returns likes to post with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        responses: {
          '200': {
              description: "Array of likes",
              content:
                {"application/json" :{
                  schema:{
                    type: "array",
                    items: {
                      $ref: "#components/schemas/Like_s"
                    }
                  }
                    }
                }
          }
          }
      },
      post: {
        summary: "Like post with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        responses: {
          '200': {
              description: "New like created",
              content:
                {"application/json" :{
                  schema:{
                    $ref: "#components/schemas/Like_s"
                  }
                    }
                }
          }
          }
      },
      delete: {
        summary: "Delete like to post with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        responses: {
          '200': {
              description: "Deletion confirmation",
                }
          }
      }
    },
    "/posts/{postId}/comments":
    {
      post: {
        summary: "Comment post with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json":{
              schema:{
                type: "object",
                properties: {
                  "text":{
                    type: "string"
                  }
                },
                required: ["text"]
              }
              }
              }
            },
        responses: {
          '200': {
              description: "New comment created",
              content:
                {"application/json" :{
                  schema:{
                    $ref: "#components/schemas/Comment_s"
                  }
                    }
                }
          }
          }
      },
      get: {
        summary: "Returns comments to post with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        responses: {
          '200': {
              description: "Array of comments",
              content:
                {"application/json" :{
                  schema:{
                    type: "array",
                    items: {
                      $ref: "#components/schemas/Comment_s"
                    }
                  }
                    }
                }
          }
          }
      }
    },
    "/posts/{postId}/comments/{commentID}":{
      get : {
        summary: "Returns comment with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          },
          {
            in: "path",
            name: "commentID",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        responses: {
          '200': {
              description: "Comment with given Id",
              content:
                {"application/json" :{
                  schema:{
                    $ref: "#components/schemas/Comment_s"
                  }
                    }
                }
          }
          }
      },
      delete:{
        summary: "Delete comment with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          },
          {
            in: "path",
            name: "commentID",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        responses: {
          '200': {
              description: "Deletion confirmation",
                }
          }
      },
      put: {
        summary: "Modify comment with given Id",
        parameters: [
          {
          in: "header",
          name: "auth-token",
          schema: {
            type: "string"
          },
          required: true
          },
          {
            in: "path",
            name: "postId",
            schema: {
              type: "string"
            },
            required: true
          },
          {
            in: "path",
            name: "commentID",
            schema: {
              type: "string"
            },
            required: true
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json":{
              schema:{
                type: "object",
                properties: {
                  "text":{
                    type: "string"
                  }
                },
                required: ["text"]
              }
              }
              }
            },
        responses: {
          '200': {
              description: "Modification confirmation",
                }
          }
      }
    } 
  },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/posts.js","./routes/likes.js","./routes/comments.js","./routes/auth.js"],
};

module.exports = options