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
      // Format date to ensure it's in YYYY-MM-DD format
      const formattedDate = form.departureDate ? new Date(form.departureDate).toISOString().split('T')[0] : '';
      
      const params = new URLSearchParams({
        origin: form.origin,
        destination: form.destination,
        departureDate: formattedDate,
        adults: form.adults,
        query: form.query
      });
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}?${params.toString()}`
      );
      setResult(res.data);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || err.response?.data?.message || 
               "Failed to fetch travel info. " + (err.response?.data?.errors?.[0]?.detail || ''));
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
      {result && (
        <div style={{ marginTop: 16 }}>
          <h2>Results</h2>
          {result.error ? (
            <div style={{ color: "red", padding: 12, background: "#fff0f0", borderRadius: 6 }}>
              <p><strong>Error:</strong> {result.message || "Unknown error"}</p>
              {result.details && <pre>{JSON.stringify(result.details, null, 2)}</pre>}
            </div>
          ) : result.data ? (
            <div>
              <h3>Flight Offers ({result.data.length})</h3>
              {result.data.map((offer, idx) => (
                <div key={offer.id} style={{ 
                  marginBottom: 16, 
                  padding: 12, 
                  background: "#f4f4f4", 
                  borderRadius: 6,
                  border: "1px solid #ddd" 
                }}>
                  <h4>Option {idx + 1} - ${offer.price.total}</h4>
                  {offer.itineraries.map((itinerary, itinIdx) => (
                    <div key={itinIdx} style={{ marginBottom: 8 }}>
                      <p><strong>Duration:</strong> {itinerary.duration}</p>
                      {itinerary.segments.map((segment, segIdx) => (
                        <div key={segIdx} style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          marginBottom: 4,
                          padding: 8,
                          background: "#fff",
                          borderRadius: 4
                        }}>
                          <div>
                            <strong>{segment.departure.iataCode}</strong> → <strong>{segment.arrival.iataCode}</strong>
                          </div>
                          <div>
                            {new Date(segment.departure.at).toLocaleTimeString()} - {new Date(segment.arrival.at).toLocaleTimeString()}
                          </div>
                          <div>
                            {segment.carrierCode} {segment.number}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : result.answer ? (
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              background: "#f0f8ff", 
              borderRadius: 6,
              border: "1px solid #cce5ff" 
            }}>
              <h3>Travel Recommendation</h3>
              <p>{result.answer}</p>
              {result.details && (
                <div style={{ marginTop: 8 }}>
                  <p><strong>Destination:</strong> {result.details.city}, {result.details.country}</p>
                  <p><strong>Best Season:</strong> {result.details.bestSeason}</p>
                  <p><strong>Highlights:</strong> {result.details.highlights.join(', ')}</p>
                </div>
              )}
            </div>
          ) : (
            <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 6 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
