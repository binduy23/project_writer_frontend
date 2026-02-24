// src/components/CollapsibleText.jsx
import { useState } from "react";

function CollapsibleText({ text, maxLines = 4 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split text into lines
  const lines = text.split("\n");

  return (
    <div>
      <p style={{ whiteSpace: "pre-wrap" }}>
        {isExpanded ? text : lines.slice(0, maxLines).join("\n")}
        {!isExpanded && lines.length > maxLines ? "..." : ""}
      </p>

      {lines.length > maxLines && (
        <button
          className="btn btn-link"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ padding: 0, marginTop: "5px" }}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}

export default CollapsibleText;