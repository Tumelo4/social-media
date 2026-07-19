<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0F9D58,100:00A86B&height=200&section=header&text=Social%20Media%20API&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Node.js%20%E2%80%A2%20Express%20%E2%80%A2%20MongoDB&descAlignY=58"/>

<div align="center">

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/-Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/-ISC-blue?style=flat-square)

</div>

<br/>

<table>
<tr>
<td width="60%" valign="top">

### 📖 Overview

A RESTful **Social Media API** for user accounts, follow relationships, and posts with likes/dislikes. Built on a clean layered architecture — **Routes → Controllers → Services → Repository → Models** — with dependency injection via `awilix`, and fully covered by a **Jest + Supertest** test suite.

```
Client
  │
  ▼
Routes ──▶ Middlewares ──▶ Controllers
                                │
                                ▼
                            Services
                                │
                                ▼
                           Repository
                                │
                                ▼
                          Mongoose Models
                                │
                                ▼
                             MongoDB
```

</td>
<td width="40%" valign="top">

### ⚡ Quick Start

```bash
git clone https://github.com/Tumelo4/social-media.git
cd social-media
npm install
```

`.env`
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/social-media
```

```bash
npm start   # run server
npm test    # run tests
```

</td>
</tr>
</table>

<br/>

## 🚀 Features

<table>
<tr>
<td align="center" width="20%">

🔐
<br/>
**Auth**
<br/>
<sub>Register & login with hashed passwords</sub>

</td>
<td align="center" width="20%">

👤
<br/>
**Profiles**
<br/>
<sub>Get, update & delete users</sub>

</td>
<td align="center" width="20%">

🤝
<br/>
**Follow System**
<br/>
<sub>Follow / unfollow users</sub>

</td>
<td align="center" width="20%">

📝
<br/>
**Posts**
<br/>
<sub>Create, update & delete posts</sub>

</td>
<td align="center" width="20%">

👍
<br/>
**Reactions**
<br/>
<sub>Like / dislike posts</sub>

</td>
</tr>
</table>

<br/>

## 🗂️ API Reference

<table>
<tr><th align="left">🔑 Auth <code>/api/auth</code></th><th align="left">🌐 Method</th></tr>
<tr><td><code>/register</code> — create an account</td><td><code>POST</code></td></tr>
<tr><td><code>/login</code> — authenticate a user</td><td><code>POST</code></td></tr>
</table>

<table>
<tr><th align="left">👤 Users <code>/api/user</code></th><th align="left">🌐 Method</th></tr>
<tr><td><code>/:id</code> — get a user</td><td><code>GET</code></td></tr>
<tr><td><code>/:id</code> — partially update a user</td><td><code>PATCH</code></td></tr>
<tr><td><code>/:id</code> — delete a user</td><td><code>DELETE</code></td></tr>
<tr><td><code>/:id/follow</code> — follow a user</td><td><code>PATCH</code></td></tr>
<tr><td><code>/:id/unfollow</code> — unfollow a user</td><td><code>PATCH</code></td></tr>
</table>

<table>
<tr><th align="left">📝 Posts <code>/api/posts</code></th><th align="left">🌐 Method</th></tr>
<tr><td><code>/</code> — create a post</td><td><code>POST</code></td></tr>
<tr><td><code>/:id</code> — get a user's timeline</td><td><code>GET</code></td></tr>
<tr><td><code>/:id</code> — update a post</td><td><code>PUT</code></td></tr>
<tr><td><code>/:id/likes</code> — like a post</td><td><code>PATCH</code></td></tr>
<tr><td><code>/:id/dislike</code> — dislike a post</td><td><code>PATCH</code></td></tr>
<tr><td><code>/:id</code> — delete a post</td><td><code>DELETE</code></td></tr>
</table>

<br/>

## 📂 Structure

<details>
<summary><strong>Click to expand project tree</strong></summary>

```
social-media/
├── Controllers/     # Request handlers
├── Services/        # Business logic
├── Repository/      # Data-access layer
├── Models/          # Mongoose schemas
├── Routes/          # Express routers
├── Middlewares/      # Validation & error handling
├── Fixtures/          # Test fixtures
├── Tests/              # Jest test suites
├── index.js             # App entry point
└── package.json
```

</details>

<br/>

## 🛠️ Built With

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,jest,js" />

</div>

<br/>

## 🤝 Contributing

```bash
1. Fork the project
2. git checkout -b feature/AmazingFeature
3. git commit -m 'Add some AmazingFeature'
4. git push origin feature/AmazingFeature
5. Open a Pull Request
```

<br/>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:00A86B,100:0F9D58&height=120&section=footer"/>

<div align="center">
<sub>Licensed under ISC • Built with Node.js, Express & MongoDB</sub>
</div>