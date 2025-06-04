import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678/webhook/travel2";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(N8N_WEBHOOK_URL, {
        params: { query }
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: "Something went wrong." });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Globetrotter AI</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask your travel question..."
          style={{ width: "80%", padding: 8, fontSize: 16 }}
          required
        />
        <button type="submit" style={{ padding: "8px 16px", marginLeft: 8 }} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {result && (
        <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
