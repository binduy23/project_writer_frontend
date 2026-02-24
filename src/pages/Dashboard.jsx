import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({}); // to toggle comments section
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decoded = jwtDecode(token);
            setLoggedInUserId(decoded.id);
        }

        fetch(`${API}/api/posts`)
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((err) => console.log(err));
    }, []);

    // Fetch comments for a post when toggled
    const handleToggleComments = async (postId) => {
        if (!showComments[postId]) {
            try {
                const res = await fetch(`${API}/api/posts/${postId}/comments`);
                const data = await res.json();
                setComments((prev) => ({ ...prev, [postId]: data }));
            } catch (err) {
                console.log(err);
            }
        }

        setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleAddComment = async (postId) => {
        const token = localStorage.getItem("token");

        if (!commentText[postId] || !commentText[postId].trim()) return;

        try {
            const res = await fetch(`${API}/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: commentText[postId] }),
            });

            if (res.ok) {
                const newComment = { id: Date.now(), username: "You", content: commentText[postId] };
                setComments((prev) => ({
                    ...prev,
                    [postId]: [newComment, ...(prev[postId] || [])],
                }));
                setCommentText((prev) => ({ ...prev, [postId]: "" }));
            } else {
                alert("Error adding comment");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="page-container">
            

            {posts.map((post) => (
                <div key={post.id} className="card" style={{ padding: "15px", marginBottom: "20px" }}>
                    {/* ===== POST CONTENT ===== */}
                    <h3>{post.title}</h3>
                    <p>
                        Posted by:{" "}
                        <span className="link" onClick={() => navigate(`/profile/${post.user_id}`)}>
                            {post.username}
                        </span>
                    </p>
                    <p>{post.content}</p>

                    {/* ===== BUTTONS ===== */}
                    <div style={{ marginTop: "10px" }}>
                        {post.user_id === loggedInUserId && (
                            <>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/edit/${post.id}`)}
                                    style={{ marginRight: "5px" }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={async () => {
                                        const token = localStorage.getItem("token");
                                        const res = await fetch(`${API}/api/posts/${post.id}`, {
                                            method: "DELETE",
                                            headers: { Authorization: `Bearer ${token}` },
                                        });
                                        if (res.ok) {
                                            setPosts(posts.filter((p) => p.id !== post.id));
                                        } else {
                                            alert("Not authorized to delete this post");
                                        }
                                    }}
                                    style={{ marginRight: "5px" }}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleToggleComments(post.id)}
                        >
                            {showComments[post.id] ? "Hide Comments" : "Comments"}
                        </button>
                    </div>

                    {/* ===== COMMENTS SECTION ===== */}
                    {showComments[post.id] && (
                        <div style={{ marginTop: "15px" }}>
                            {/* Add comment */}
                            <textarea
                                rows="2"
                                placeholder="Write a comment..."
                                value={commentText[post.id] || ""}
                                onChange={(e) =>
                                    setCommentText({ ...commentText, [post.id]: e.target.value })
                                }
                                style={{ width: "100%" }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => handleAddComment(post.id)}
                                style={{ marginTop: "5px" }}
                            >
                                Add Comment
                            </button>

                            {/* Comments list */}
                            {Array.isArray(comments[post.id]) &&
                                comments[post.id].map((comment) => (
                                    <div
                                        key={comment.id}
                                        style={{
                                            background: "#f1f5f9",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        <strong>{comment.username}</strong>
                                        <p style={{ marginTop: "5px" }}>{comment.content}</p>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Dashboard;