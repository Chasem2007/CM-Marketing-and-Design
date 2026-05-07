const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  let body;
  try { body = JSON.parse(event.body || "{}"); } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }
  const { action, key, value } = body;
  if (!action || !key) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing action or key" }) };
  }
  try {
    const store = getStore("cm-portal");
    if (action === "get") {
      const data = await store.get(key, { type: "text" });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: data }),
      };
    }
    if (action === "set") {
      if (value === undefined) return { statusCode: 400, body: JSON.stringify({ error: "Missing value" }) };
      await store.set(key, value);
      return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
    }
    if (action === "delete") {
      await store.delete(key);
      return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
    }
    return { statusCode: 400, body: JSON.stringify({ error: "Unknown action" }) };
  } catch(e) {
    console.error("KV error:", e.message);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
