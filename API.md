# PeerSphere API Documentation

Base URL: `http://localhost:5001/api`

## Videos
- **GET /videos**
    - Query Params: `page`, `limit`, `search`, `category`, `sort` (oldest, views)
    - Response: List of videos with pagination metadata.
- **POST /videos**
    - Body: `{ title, url, category, description }`
- **GET /videos/:id**
    - Response: Single video details. Increments view count.
- **DELETE /videos/:id**
    - Delete a video.

## Doubts
- **GET /doubts**
    - Query Params: `search`, `page`, `limit`
    - Response: List of doubts.
- **POST /doubts**
    - Body: `{ question, author }`
- **POST /doubts/:id/answers**
    - Body: `{ content, author }`
- **DELETE /doubts/:id**
    - Delete a doubt.

## ToDo
- **GET /todos**
    - Query Params: `sort` (priority)
    - Response: List of tasks.
- **POST /todos**
    - Body: `{ task, priority, dueDate }`
- **PUT /todos/:id**
    - Body: `{ isCompleted, task, ... }`
- **DELETE /todos/:id**
    - Delete a task.

## Pomodoro
- **POST /pomodoro**
    - Body: `{ duration }` (in minutes)
    - Action: Logs session, updates user study minutes and credits.
- **GET /pomodoro**
    - Response: Recent study sessions.

## Progress
- **GET /progress**
    - Response: User stats (credits, study minutes), ToDo stats, and last 7 days study data for graphs.
