import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Filter, Search, Plus, Trash, Heart, MessageCircle, Upload, Link as LinkIcon, X } from 'lucide-react';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Upload State
    const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
    const [newVideo, setNewVideo] = useState({ title: '', url: '', category: 'General', description: '' });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, [search]);

    const fetchVideos = async () => {
        try {
            const res = await axios.get(`/videos?search=${search}`);
            setVideos(res.data.videos);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', newVideo.title);
            formData.append('category', newVideo.category);
            formData.append('description', newVideo.description);

            if (uploadMode === 'url') {
                formData.append('url', newVideo.url);
            } else {
                if (selectedFile) {
                    formData.append('video', selectedFile);
                }
            }

            // Note: axios automatically sets Content-Type to multipart/form-data
            await axios.post('/videos', formData);

            setShowForm(false);
            setNewVideo({ title: '', url: '', category: 'General', description: '' });
            setSelectedFile(null);
            fetchVideos();
        } catch (err) {
            console.error(err);
            alert("Upload failed. Check console.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/videos/${id}`);
            fetchVideos();
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Learning Hub</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Plus size={20} /> Share Video
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="card"
                        style={{ marginBottom: '30px', overflow: 'hidden' }}
                        onSubmit={handleSubmit}
                    >
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <button type="button" onClick={() => setUploadMode('url')} className={`btn ${uploadMode === 'url' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>
                                    <LinkIcon size={16} /> Link URL
                                </button>
                                <button type="button" onClick={() => setUploadMode('file')} className={`btn ${uploadMode === 'file' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>
                                    <Upload size={16} /> Upload File
                                </button>
                            </div>

                            <input
                                className="input"
                                placeholder="Video Title"
                                value={newVideo.title}
                                onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                                required
                            />

                            <textarea
                                className="input"
                                placeholder="Description"
                                value={newVideo.description}
                                onChange={e => setNewVideo({ ...newVideo, description: e.target.value })}
                            />

                            {uploadMode === 'url' ? (
                                <input
                                    className="input"
                                    placeholder="YouTube/Vimeo URL"
                                    value={newVideo.url}
                                    onChange={e => setNewVideo({ ...newVideo, url: e.target.value })}
                                    required
                                />
                            ) : (
                                <div style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        required
                                        style={{ color: 'var(--text)' }}
                                    />
                                    <p style={{ marginTop: '10px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>Max size 50MB</p>
                                </div>
                            )}

                            <select
                                className="input"
                                value={newVideo.category}
                                onChange={e => setNewVideo({ ...newVideo, category: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="Coding">Coding</option>
                                <option value="Design">Design</option>
                                <option value="Math">Math</option>
                            </select>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                Publish & Earn Credits
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={20} />
                    <input className="input" style={{ paddingLeft: '40px' }} placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {videos.map(video => (
                    <VideoCard
                        key={video._id}
                        video={video}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const VideoCard = ({ video, onDelete }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    // Local state for optimistic updates
    const [likes, setLikes] = useState(video.likes);
    const [comments, setComments] = useState(video.comments);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        setLikes(video.likes);
        setComments(video.comments);
    }, [video]);

    const getVideoSrc = () => {
        if (video.isUploaded && video.filePath) {
            // Convert server path format to URL
            // server/uploads/videos/filename -> http://localhost:5001/uploads/videos/filename
            const relativePath = video.filePath.replace('server/', '');
            return `http://localhost:5001/${relativePath}`;
        }
        return video.url;
    };

    const handleLike = async () => {
        if (hasLiked) return; // Prevent double liking in session

        // Optimistic Update
        setLikes(prev => prev + 1);
        setHasLiked(true);

        try {
            await axios.post(`/videos/${video._id}/like`);
        } catch (err) {
            console.error(err);
            setLikes(prev => prev - 1);
            setHasLiked(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        // Optimistic Update
        const newComment = { text: commentText, author: 'You' };
        setComments(prev => [...prev, newComment]);
        setCommentText('');

        try {
            await axios.post(`/videos/${video._id}/comments`, { text: newComment.text });
        } catch (err) {
            console.error(err);
            setComments(prev => prev.slice(0, -1)); // Revert
        }
    };

    return (
        <motion.div layout className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#000', aspectRatio: '16/9', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                {video.isUploaded ? (
                    <video controls src={getVideoSrc()} style={{ width: '100%', height: '100%' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                        <Play size={40} color="white" />
                        <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: '10px', color: 'var(--primary)', textDecoration: 'underline' }}>
                            Watch External Link
                        </a>
                    </div>
                )}
            </div>

            <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px' }}>
                        {video.category}
                    </span>
                    <button onClick={() => onDelete(video._id)} style={{ background: 'none', color: 'var(--text-dim)', padding: '4px' }}>
                        <Trash size={14} />
                    </button>
                </div>

                <h3 style={{ margin: '10px 0 5px', fontSize: '1.1rem' }}>{video.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '15px' }}>{video.description}</p>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                    <button
                        onClick={handleLike}
                        disabled={hasLiked}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', color: hasLiked ? 'var(--secondary)' : 'var(--text-dim)', cursor: hasLiked ? 'default' : 'pointer' }}
                    >
                        <Heart size={18} fill={hasLiked ? "currentColor" : "none"} />
                        <span>{likes}</span>
                    </button>
                    <button onClick={() => setShowComments(!showComments)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', color: 'var(--text-dim)' }}>
                        <MessageCircle size={18} />
                        <span>{comments.length}</span>
                    </button>
                </div>

                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', marginTop: '15px' }}
                        >
                            <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {comments.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No comments yet.</p>}
                                {comments.map((c, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'var(--primary)' }}>{c.author || 'User'}:</span>
                                            {c.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleComment} style={{ display: 'flex', gap: '5px' }}>
                                <input
                                    className="input"
                                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    placeholder="Add comment..."
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary" style={{ padding: '6px 10px' }}><Plus size={16} /></button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Videos;
