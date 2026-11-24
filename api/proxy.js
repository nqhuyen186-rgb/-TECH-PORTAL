const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzLrG6EfZwzndK5AZQCgFy0r7vVCtI0ovlYltyXuL6MGsz-CYLVLm23tyOeE0AoO9pg/exec";

export default async function handler(req, res) {
  try {
    const queryString = new URL(req.url, "http://localhost").search;
    const targetUrl = `${APPS_SCRIPT_URL}${queryString}`;

    const fetchOptions = {
      method: req.method,
      redirect: "follow"
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const bodyData =
        typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
      fetchOptions.headers = { "Content-Type": "text/plain;charset=utf-8" };
      fetchOptions.body = bodyData;
    }

    const gsRes = await fetch(targetUrl, fetchOptions);
    const text = await gsRes.text();

    res.status(gsRes.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(text);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Proxy error: " + err.message
    });
  }
}
