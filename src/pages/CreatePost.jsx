import { useState } from "react";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      console.log(data);
      alert("Post created!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="page-container">
    <div className="card">
      <h2>Create Post</h2>

      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Post content"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  </div>
);
}

export default CreatePost;