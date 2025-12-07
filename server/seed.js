const mongoose = require('mongoose');
const Video = require('./models/Video');
require('dotenv').config();

const videos = [
    {
        title: "React in 100 Seconds",
        url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        description: "A quick introduction to React.js core concepts.",
        category: "Coding",
        tags: ["react", "javascript", "web dev"],
        views: 1250,
        likes: 120
    },
    {
        title: "Node.js Tutorial for Beginners: Learn Node in 1 Hour",
        url: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
        description: "Master Node.js fundamentals with this comprehensive guide.",
        category: "Coding",
        tags: ["node", "backend", "express"],
        views: 890,
        likes: 85
    },
    {
        title: "The Art of Typography: UX Design",
        url: "https://www.youtube.com/watch?v=QrNi9FmdlxY",
        description: "Learn how to use fonts effectively in your designs.",
        category: "Design",
        tags: ["ui/ux", "design", "typography"],
        views: 450,
        likes: 55
    },
    {
        title: "Figma 101: Absolute Beginners Design Course",
        url: "https://www.youtube.com/watch?v=Gu1so3pz4bA",
        description: "Start designing with Figma today.",
        category: "Design",
        tags: ["figma", "ui", "prototyping"],
        views: 2100,
        likes: 300
    },
    {
        title: "Calculus: Derivatives Explained",
        url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
        description: "Understanding derivatives intuitively.",
        category: "Math",
        tags: ["calculus", "math", "derivatives"],
        views: 3400,
        likes: 450
    },
    {
        title: "Linear Algebra: Vectors and Spaces",
        url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
        description: "3Blue1Brown's masterpiece on Linear Algebra.",
        category: "Math",
        tags: ["math", "linear algebra"],
        views: 5600,
        likes: 600
    },
    {
        title: "How to Study Effectively for Exams",
        url: "https://www.youtube.com/watch?v=ukLnPbIffxE",
        description: "Scientifically proven study techniques.",
        category: "General",
        tags: ["study tips", "productivity"],
        views: 12000,
        likes: 1500
    },
    {
        title: "Pomodoro Technique Explained",
        url: "https://www.youtube.com/watch?v=mNBmG24djoY",
        description: "Boost your productivity with this simple timer method.",
        category: "General",
        tags: ["productivity", "pomodoro"],
        views: 800,
        likes: 90
    },
    {
        title: "Python for Data Science - Course for Beginners",
        url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
        description: "Learn Python libraries: Pandas, NumPy, Matplotlib.",
        category: "Coding",
        tags: ["python", "data science"],
        views: 300,
        likes: 25
    },
    {
        title: "Color Theory for Designers",
        url: "https://www.youtube.com/watch?v=_2LLXnUdUIc",
        description: "How to pick perfect color palettes.",
        category: "Design",
        tags: ["color", "design theory"],
        views: 670,
        likes: 60
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/peersphere', {})
    .then(async () => {
        console.log('MongoDB Connected for Seed');
        try {
            await Video.deleteMany({ isUploaded: false }); // Clear only external link videos to avoid deleting user uploads
            await Video.insertMany(videos);
            console.log('Seed Data Inserted Successfully');
        } catch (err) {
            console.error('Seed Error:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => {
        console.log(err);
    });
