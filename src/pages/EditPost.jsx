import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const post = data.find((p) => p.id === parseInt(id));
        if (post) {
          setTitle(post.title);
          setContent(post.content);
        }
      });
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API}/api/posts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      }
    );

    if (res.ok) {
      alert("Post updated successfully");
      navigate("/dashboard");
    } else {
      alert("Not authorized to edit");
    }
  };

  return (
  <div className="page-container">
    <div className="card">
      <h2>Edit Post</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        rows="5"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />

      <button className="btn btn-primary" onClick={handleUpdate}>
        Update
      </button>
    </div>
  </div>
);
}

export default EditPost;