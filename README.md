# PeerSphere - A Peer-to-Peer Learning Platform

## Project Proposal
**PeerSphere** is a comprehensive full-stack web application designed to democratize education by enabling peer-to-peer learning. Traditional learning management systems often lack real-time peer interaction and gamification. PeerSphere addresses this by integrating video sharing, doubt resolution, task management, and focus timers into a single, cohesive platform wrapped in a premium, engaging user interface.

## Problem Statement & Solution
**Problem**: Students often struggle with fragmented tools for studying—Youtube for videos, forums for questions, and separate apps for tasks and timers. This context switching reduces productivity.
**Solution**: PeerSphere unifies these study essentials.
- **Video Module**: Students can share and watch learning material organized by category.
- **Doubt Forum**: A collaborative space to ask and answer questions, fostering a community of learners.
- **Productivity Tools**: Integrated To-Do lists and Pomodoro timers help students manage their time effectively without leaving the platform.
- **Gamification**: A credit and ranking system rewards consistency and contribution, keeping users motivated.

## Features
- **Video Library**: Upload, watch, search, filter, and sort educational videos.
- **Doubt Resolution**: Post questions and receive answers from peers.
- **Productivity Suite**:
    - **Task Manager**: Track tasks with priorities and completion status.
    - **Pomodoro Timer**: Focus sessions with automatic study time logging.
- **Progress Tracking**: Visual dashboard with graphs showcasing study momentum and stats.
- **Gamified Experience**: Earn credits for studying and contributing.

## Tech Stack
- **Frontend**: React.js, Vite, Framer Motion (Animations), Recharts (Data Viz), Lucide React (Icons), CSS Modules.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).

## Hosting
**Live URL**: `[Insert Hosted URL Here]`

### Deployment Instructions
1.  **Backend**: Deploy to Render/Railway. Set `MONGO_URI` env variable.
2.  **Frontend**: Deploy to Vercel/Netlify. Update API base URL to point to deployed backend.

## Local Setup
1.  Clone the repository.
2.  **Backend**:
    ```bash
    cd server
    npm install
    npm start
    ```
3.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
