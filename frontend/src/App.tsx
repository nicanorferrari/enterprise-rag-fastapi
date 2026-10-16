import React, { useState } from "react";
import { StreamingRagClient } from "./ragClient";

export const RagChatApp: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const client = new StreamingRagClient();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResponse("");

    try {
      const generator = client.streamQuery(query);
      for await (const token of generator) {
        setResponse((prev) => prev + token);
      }
    } catch (err) {
      console.error("Stream execution failed", err);
      setResponse("Error connecting to enterprise RAG backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>Enterprise RAG - Knowledge Assistant</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a technical enterprise question..."
          style={{ width: "80%", padding: "10px" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Synthesizing..." : "Submit"}
        </button>
      </form>
      <div style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", minHeight: 120 }}>
        {response || "Streaming responses with pgvector semantic context will render here."}
      </div>
    </div>
  );
};