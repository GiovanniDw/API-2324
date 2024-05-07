import "dotenv/config";
import express from "express";
import session from "express-session";
import ViteExpress from "vite-express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Liquid } from "liquidjs";
import logger from "morgan";
import { Server } from "socket.io";
import nunjucks from "nunjucks";
import "express-nunjucks";
import mongoose from "mongoose";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passportLocalMongoose from "passport-local-mongoose";
import multer from "multer";
import cookieParser from "cookie-parser";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
new Liquid({
  root: __dirname$1,
  // for layouts and partials
  extname: ".liquid"
});
const users = [];
const addUser = ({ socket_id, name, user_id, room_id }) => {
  const exist = users.find((user2) => user2.room_id === room_id && user2.user_id === user_id);
  if (exist) {
    return { error: "User already exist in this room" };
  }
  const user = { socket_id, name, user_id, room_id };
  users.push(user);
  console.log("users list", users);
  return { user };
};
const removeUser = (socket_id) => {
  const index = users.findIndex((user) => user.socket_id === socket_id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = (socket_id) => users.find((user) => user.socket_id === socket_id);
const homeController = async (req, res, next) => {
  req.body;
  try {
    if (req.user) {
      console.log(req.user);
    }
    const data = { title: "Movies", movieData: "data", user: req.user, username: req.user.username };
    console.log(data);
    res.render("index.njk", data);
  } catch (err) {
    let data = {
      error: { message: err }
    };
    res.render("index.njk", data);
  }
};
const Schema$2 = mongoose.Schema;
const RoomSchema = new Schema$2({
  name: {
    type: String,
    required: true
  }
});
const Room = mongoose.model("Room", RoomSchema);
const Schema$1 = mongoose.Schema;
const MessageSchema = new Schema$1(
  {
    name: {
      type: String,
      required: true
    },
    user_id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    room_id: {
      type: String,
      required: true
    },
    alert: Boolean
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);
const chatController = async (req, res, next) => {
  req.body;
  try {
    const data = { user: req.user };
    console.log(data);
    res.render("chat", data);
  } catch (err) {
    let data = {
      error: { message: err }
    };
    res.render("chat.njk", data);
  }
};
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  id: Number,
  name: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  admin: Boolean
});
UserSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.statics.login = async function(username, password) {
  console.log("loginschema");
  console.log(username + password);
  let user = await this.findOne({ username });
  if (user) {
    console.log(user);
    console.log("compare pass");
    console.log(password);
    console.log(user.password);
    let isAuthenticated = await bcrypt.compare(password, user.password);
    if (isAuthenticated) {
      return user;
    } else {
      throw Error("Incorrect password");
    }
  } else {
    throw Error("Incorrect email");
  }
};
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);
const register = async (req, res, next) => {
  try {
    let data = {
      layout: "base.liquid",
      title: "Welcome",
      error: null
    };
    res.render("register", data);
  } catch (err) {
    let data = {
      error: { message: err },
      layout: "base.liquid"
    };
    res.render("register", data);
    next(err);
  }
};
const doRegister = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;
  console.log(req.body);
  let data = {
    layout: "base.liquid",
    title: "Welcome",
    error: null,
    message: "",
    succes: ""
  };
  try {
    console.log(req.body);
    await User.register(
      new User({
        username: req.body.username,
        email: req.body.username,
        password: req.body.password,
        name: req.body.name
      }),
      username,
      function(err, user) {
        if (err) {
          data.succes = false;
          data.message = err;
          res.render("register", data);
        } else {
          req.login(user, (er) => {
            if (er) {
              data.succes = false;
              data.message = er;
              res.render("register", data);
            } else {
              res.redirect("/");
            }
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  req.body;
  let data = {
    layout: "base.liquid",
    title: "Welcome",
    error: null,
    message: ""
  };
  try {
    if (req.user) {
      res.redirect("/");
    } else {
      res.render("login.njk", data);
    }
  } catch (err) {
    next(err);
  }
};
const doLogin = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;
  console.log("req.login");
  console.log(req.login);
  let data = {
    layout: "base.njk",
    title: "Welcome",
    error: null,
    message: ""
  };
  try {
    if (req.body.username) {
      console.log(username);
      await User.findByUsername(username, username, function(err, user) {
        if (err) {
          console.log(err);
          data.succes = false;
          data.error = err;
          res.render("login.njk", data);
        } else {
          req.login(user, (er) => {
            if (er) {
              console.log(er);
              data.succes = false;
              data.error = "Email not found";
              res.render("login", data);
            } else {
              console.log("req.login");
              console.log(req.login);
              res.redirect("/");
            }
          });
        }
      });
    } else {
      res.render("login.njk", data);
    }
  } catch (error) {
    res.render("login.njk", data);
    next(error);
  }
};
const verifyuser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    console.log("token");
    console.log(token);
    jwt.verify(token, "chatroom secret", async (err, decodedToken) => {
      if (err) {
        console.log("error.msg");
        console.log(err.message);
      } else {
        console.log("decodedToken.id");
        console.log(decodedToken.id);
        let user = await User.findById(decodedToken.id);
        res.json(user);
        next();
      }
    });
  } else {
    next();
  }
};
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};
const upload = multer();
const router = express.Router();
router.get("/", homeController);
router.get("/register", register);
router.post("/register", upload.array(), doRegister);
router.get("/login", login);
router.post("/login", upload.array(), doLogin);
router.get("/logout", logout);
router.post("/logout", logout);
router.get("/verifyuser", verifyuser);
router.post("/verifyuser", verifyuser);
router.get("/chat", chatController);
const config = function(app2, io2) {
  const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
  const cookieMiddleware = cookieParser(process.env.SESSION_SECRET);
  app2.use(cookieMiddleware);
  const sessionMiddleware = session({
    // this should be changed to something cryptographically secure for production
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // automatically extends the session age on each request. useful if you want
    // the user's activity to extend their session. If you want an absolute session
    // expiration, set to false
    rolling: true,
    name: process.env.HOST,
    // set your options for the session cookie
    cookie: {
      httpOnly: false,
      sameSite: false,
      // the duration in milliseconds that the cookie is valid
      maxAge: 60 * 60 * 1e3
      // 20 minutes
      // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
      // domain: 'party-finderr.herokuapp.com',
      // recommended you use this setting in production if your site is published using HTTPS
      // secure: true,
    }
  });
  app2.use(sessionMiddleware);
  io2.use(wrap(sessionMiddleware));
  io2.use(wrap(cookieMiddleware));
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app2.use(passport.initialize());
  app2.use(passport.session());
  io2.use(wrap(passport.initialize()));
  io2.use(wrap(passport.session()));
};
const socketController = (io2, socket) => {
  console.log("user connected");
  console.log("session");
  console.log(socket.request.session);
  console.log("ID");
  console.log(socket.id);
  Room.find().then((result) => {
    socket.emit("output-rooms", result);
  });
  socket.on("create-room", (name) => {
    const room = new Room({ name });
    room.save().then((result) => {
      io2.emit("room-created", result);
    });
  });
  socket.on("join", ({ name, room_id, user_id }) => {
    const { error, user } = addUser({
      socket_id: socket.id,
      name,
      user_id,
      room_id
    });
    socket.join(room_id);
    if (error) {
      console.log("join error", error);
      io2.to(room_id).emit("receive-message", { msg: "err" });
    } else {
      io2.to(room_id).emit("receive-message", { msg: "hallo", user_id: null });
      console.log("join user", user);
    }
  });
  socket.on("send-message", ({ msg, room_id, alert, cb }) => {
    const user = getUser(socket.id);
    console.log(msg);
    console.log(alert);
    console.log(user);
    const msgToStore = {
      name: user.name,
      user_id: user.user_id,
      room_id,
      text: msg
    };
    console.log("messageStore");
    console.log(msgToStore);
    const message = new Message({
      name: user.name,
      user_id: user.user_id,
      room_id,
      text: msg,
      alert
    });
    message.save().then((result) => {
      io2.to(room_id).emit("receive-message", result);
    });
  });
  socket.on("get-messages-history", (room_id) => {
    Message.find({ room_id }).then((result) => {
      socket.emit("output-message", result);
    });
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.id);
      }
    }
    console.log("user disconnected");
  });
};
const PORT = process.env.PORT || 3e3;
const HOST = process.env.HOST || "localhost";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const paths = {
  views: path.join(__dirname, "views"),
  public: path.join(__dirname, "../public"),
  src: path.join(__dirname, "../src"),
  assets: path.join(__dirname, "../src/assets")
};
const devPaths = {
  views: path.join(__dirname, "views"),
  public: path.join(__dirname, "/"),
  src: path.join(__dirname, "../src"),
  assets: path.join(__dirname, "assets")
};
const app = express();
const server = http.createServer(app).listen(PORT, "0.0.0.0", () => {
  console.log(`Server.Listen`);
  console.log(`Server is listening on host: ${HOST} @ ${PORT}!`);
});
const io = new Server(server);
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "*",
  exposedHeaders: "*",
  credentials: true
  // optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
new Liquid({
  root: __dirname,
  // for layouts and partials
  extname: ".liquid",
  globals: { data: "global" }
});
const env = nunjucks.configure(paths.views, {
  autoescape: true,
  express: app,
  watch: true
});
env.express(app);
app.use(logger("dev"));
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.set("view engine", "njk");
app.set("views", paths.views);
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use("/", express.static(paths.public));
  app.use("/", express.static(paths.src));
  app.use("/assets", express.static(paths.assets));
}
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(devPaths.public));
  app.use("/assets", express.static(devPaths.assets));
}
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    credentials: true
  })
);
mongoose.connect(process.env.MONGO_DB, {
  dbName: process.env.DB_NAME
}).then(() => console.log(`Mongoose connected to ${process.env.MONGO_DB} `)).catch((err) => console.log(err));
config(app, io);
app.use((req, res, next) => {
  res.locals.env = process.env.NODE_ENV || "development";
  next();
});
app.use(router);
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.authenticated = !req.user.anonymous;
  next();
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error.njk", {
    message: err.message,
    error: err.status
  });
});
io.on("connection", async (socket) => {
  socketController(io, socket);
});
if (process.env.NODE_ENV === "development") {
  ViteExpress.bind(app, io, async () => {
    console.log(`Vite Express Bind`);
    const { root, base } = await ViteExpress.getViteConfig();
    console.log(`Vite Express Bind`);
    console.log(`Serving app from root ${root}`);
    console.log(`Server is listening at http://${HOST}:${PORT}${base}`);
  });
}
//# sourceMappingURL=server.js.map
