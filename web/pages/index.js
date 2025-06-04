import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    adults: 1,
    query: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({
        origin: form.origin,
        destination: form.destination,
        departureDate: form.departureDate,
        adults: form.adults,
        query: form.query
      });
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}?${params.toString()}`
      );
      setResult(res.data);
    } catch (err) {
      setError("Failed to fetch travel info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <h1>Globetrotter AI</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          name="origin"
          placeholder="Origin Airport Code (e.g. BOS)"
          value={form.origin}
          onChange={handleChange}
          required
        />
        <input
          name="destination"
          placeholder="Destination Airport Code (e.g. JFK)"
          value={form.destination}
          onChange={handleChange}
          required
        />
        <input
          name="departureDate"
          type="date"
          placeholder="Departure Date"
          value={form.departureDate}
          onChange={handleChange}
          required
        />
        <input
          name="adults"
          type="number"
          min="1"
          max="9"
          placeholder="Number of Adults"
          value={form.adults}
          onChange={handleChange}
          required
        />
        <input
          name="query"
          placeholder="Travel Query (e.g. 'Best time to visit Japan')"
          value={form.query}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Flights & Get Advice"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {result && (
        <pre style={{ marginTop: 16, background: "#f4f4f4", padding: 12, borderRadius: 6 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
