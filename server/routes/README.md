# This file is designed for developer to test the API

## Define Major Route Categories

The routes are divided into logical modules for better organization:

- **Authentication (auth)**: login, registration, logout, token management.
- **Users (users)**: profile, information modification, follow/unfollow.
- **Posts (posts)**: create, edit, delete posts, retrieve posts.
- **Comments (comments)**: add, delete comments on a post.
- **Likes (likes)**: manage likes (add, remove).
- **Messages (messages)**: send, receive private messages.
- **Notifications (notifications)**: manage alerts for likes, comments, messages, etc.

## Auth API

### Register

`POST http://127.0.0.1:5000/auth/register`

```json
{
    "username" : "test",
    "email" : "test@gmail.com",
    "password" : "password"
}
```

It returns code **201** :

```json
{
    "message": "account created successfully."
}
```

### Login

`POST http://127.0.0.1:5000/auth/login`

```json
{
    "username" : "test",
    "password" : "password"
}
```

It returns code **200** :

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRkYzcwNDEzLTEwOTQtNGY4Zi04Y2ZhLTg3YzhlYzkzMDNlYSIsImV4cCI6MTc0MDE2NjA4OX0.zc2DpJ8J07vy6WPZNeOkmc26dnLfZQQwSbuodxwss5s"
}
```

## User API

### Profile

`POST http://127.0.0.1:5000/user/profile`

In header, you need to add `Authorization` (OAuth 2.0) with the HS256 algo get from login.`

It returns code **200** :

```json
{
    "bio": null,
    "created_at": "Fri, 21 Feb 2025 18:16:21 GMT",
    "email": "test@gmail.com",
    "profile_picture": "default.jpg",
    "username": "test",
    "website": null,
    "gender": null
}
```

### Update Profile

`POST http://127.0.0.1:5000/user/edit-profile`

```json
{
    "username" : "test2"
    "bio" : "I am a developer"
}
```

It returns code **200** :

```json
{
    "message": "Profile updated successfully",
    "user": {
        "bio": "I am a developer",
        "email": "test@gmail.com",
        "id": "28ff42af-b87c-4e4c-8051-3365547674d2",
        "username": "test2",
        "website": null,
        "gender": null
    }
}
```

### Upload Profile Picture

`http://127.0.0.1:5000/user/upload-profile-picture`
