import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageCircle, ChevronUp, ChevronDown, Trash, CheckCircle } from 'lucide-react';

const Doubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newDoubt, setNewDoubt] = useState({ question: '', tags: '' });

    useEffect(() => {
        fetchDoubts();
    }, [search]);

    const fetchDoubts = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/doubts?search=${search}`);
            setDoubts(res.data.doubts);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/doubts', {
                question: newDoubt.question,
                tags: newDoubt.tags.split(',').map(t => t.trim())
            });
            setShowForm(false);
            setNewDoubt({ question: '', tags: '' });
            fetchDoubts();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this doubt?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/doubts/${id}`);
            fetchDoubts();
        } catch (err) { console.error(err); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Community Doubts</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Plus size={20} /> Ask Doubt
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
                            <textarea
                                className="input"
                                placeholder="What's your question?"
                                value={newDoubt.question}
                                onChange={e => setNewDoubt({ ...newDoubt, question: e.target.value })}
                                required
                            />
                            <input
                                className="input"
                                placeholder="Tags (comma separated)"
                                value={newDoubt.tags}
                                onChange={e => setNewDoubt({ ...newDoubt, tags: e.target.value })}
                            />
                            <button type="submit" className="btn btn-primary">Post & Earn +10 Credits</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div style={{ position: 'relative', marginBottom: '30px' }}>
                <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={20} />
                <input className="input" style={{ paddingLeft: '40px' }} placeholder="Search doubts..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {doubts.map(doubt => (
                    <DoubtCard key={doubt._id} doubt={doubt} onDelete={handleDelete} />
                ))}
            </div>
        </motion.div>
    );
};

const DoubtCard = ({ doubt, onDelete }) => {
    const [answers, setAnswers] = useState(doubt.answers);
    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [newAnswer, setNewAnswer] = useState('');
    const [votes, setVotes] = useState(doubt.votes || 0);

    const handleVote = async (type) => {
        // Optimistic
        setVotes(prev => type === 'up' ? prev + 1 : prev - 1);
        try {
            await axios.post(`http://localhost:5001/api/doubts/${doubt._id}/vote`, { type });
        } catch (err) {
            console.error(err);
            setVotes(prev => type === 'up' ? prev - 1 : prev + 1); // Revert
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5001/api/doubts/${doubt._id}/answers`, { content: newAnswer });
            setAnswers(res.data.answers);
            setNewAnswer('');
            setShowAnswerForm(false);
        } catch (err) { console.error(err); }
    };

    return (
        <motion.div layout className="card" style={{ display: 'flex', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minWidth: '40px' }}>
                <button onClick={() => handleVote('up')} style={{ background: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><ChevronUp /></button>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: votes > 0 ? 'var(--success)' : votes < 0 ? 'var(--secondary)' : 'var(--text)' }}>{votes}</span>
                <button onClick={() => handleVote('down')} style={{ background: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><ChevronDown /></button>
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{doubt.question}</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {doubt.tags.map((tag, i) => (
                                <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-dim)' }}>#{tag}</span>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => onDelete(doubt._id)} style={{ color: 'var(--text-dim)', background: 'none' }}><Trash size={16} /></button>
                </div>

                <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <MessageCircle size={18} color="var(--primary)" />
                        <span style={{ fontWeight: 'bold' }}>{answers.length} Answers</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {answers.map((ans, i) => (
                            <div key={i} style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                                <p style={{ fontSize: '0.9rem' }}>{ans.content}</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>- {ans.author}</span>
                            </div>
                        ))}
                    </div>

                    {!showAnswerForm ? (
                        <button onClick={() => setShowAnswerForm(true)} className="btn btn-secondary" style={{ marginTop: '15px', fontSize: '0.85rem' }}>
                            Answer (+20 Credits)
                        </button>
                    ) : (
                        <form onSubmit={handleAnswerSubmit} style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <input
                                className="input"
                                placeholder="Type your answer..."
                                value={newAnswer}
                                onChange={e => setNewAnswer(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">Post</button>
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Doubts;
