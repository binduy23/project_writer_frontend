import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({ country: "", about: "" });
  const API = import.meta.env.VITE_API_URL;

  // Get logged-in user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setLoggedInUserId(decoded.id);
    }
  }, []);

  // Fetch user info and posts
  useEffect(() => {
    fetch(`${API}/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEditFields({ country: data.country || "", about: data.about || "" });
      })
      .catch((err) => console.log(err));

    fetch(`${API}/api/posts/user/${id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.log(err));
  }, [id]);

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const res = await fetch(
        `${API}/api/posts/${postId}/comments`
      );
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.log(err);
    }
  };

  // Update user profile
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editFields),
    });
    if (res.ok) {
      const updatedUser = { ...user, ...editFields };
      setUser(updatedUser);
      setEditMode(false);
      alert("Profile updated!");
    } else {
      alert("Error updating profile");
    }
  };

  if (!user) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div style={{ padding: "40px" }} className="page-container">
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>

      {/* Editable fields */}
      {loggedInUserId === user.id && (
        <div style={{ marginBottom: "20px" }}>
          {editMode ? (
            <>
              <div>
                <label>Country: </label>
                <input
                  value={editFields.country}
                  onChange={(e) =>
                    setEditFields((prev) => ({ ...prev, country: e.target.value }))
                  }
                />
              </div>
              <div>
                <label>About: </label>
                <textarea
                  rows="3"
                  value={editFields.about}
                  onChange={(e) =>
                    setEditFields((prev) => ({ ...prev, about: e.target.value }))
                  }
                />
              </div>
              <button className="btn btn-primary" onClick={handleProfileUpdate}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>Country: {user.country || "-"}</p>
              <p>About: {user.about || "-"}</p>
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      )}

      <hr />
      <h3>Posts</h3>
      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
          className="card"
        >
          <h4>{post.title}</h4>
          <p>Posted on: {new Date(post.created_at).toLocaleDateString()}</p>

          {/* ================= BUTTONS ================= */}
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            {post.user_id === loggedInUserId && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/edit/${post.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    const res = await fetch(
                      `${API}/api/posts/${post.id}`,
                      {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (res.ok) setPosts(posts.filter((p) => p.id !== post.id));
                  }}
                >
                  Delete
                </button>
              </>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => {
                const isShown = showComments[post.id];
                if (!isShown) fetchComments(post.id);
                setShowComments((prev) => ({
                  ...prev,
                  [post.id]: !isShown,
                }));
              }}
            >
              Comments
            </button>
          </div>

          {/* ================= COMMENTS SECTION ================= */}
          {showComments[post.id] && (
            <div style={{ marginTop: "15px" }}>
              <h5>Comments</h5>
              {Array.isArray(comments[post.id]) &&
                comments[post.id].map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      background: "#f1f5f9",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>{comment.username}</strong>
                    <p>{comment.content}</p>
                  </div>
                ))}

              {/* Add comment */}
              <textarea
                rows="2"
                placeholder="Write a comment..."
                value={commentText[post.id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
              />
              <button
                className="btn btn-primary"
                style={{ marginTop: "5px" }}
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    `${API}/api/posts/${post.id}/comments`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        content: commentText[post.id],
                      }),
                    }
                  );
                  const data = await res.json();
                  if (res.ok) {
                    const newComment = {
                      id: Date.now(),
                      username: "You",
                      content: commentText[post.id],
                    };
                    setComments((prev) => ({
                      ...prev,
                      [post.id]: [newComment, ...(prev[post.id] || [])],
                    }));
                    setCommentText((prev) => ({ ...prev, [post.id]: "" }));
                  } else alert("Error adding comment");
                }}
              >
                Add Comment
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Profile;