import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Security: Backend Proxy for Gemini API
  // This keeps the VITE_GEMINI_API_KEY safe on the server
  app.post("/api/generate-narrative", async (req, res) => {
    const { prompt, business, month } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Server API Key not configured" });
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch from Gemini" });
    }
  });

  // OAuth Configuration (Placeholders)
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_GOOGLE_ID";
  const META_APP_ID = process.env.META_APP_ID || "PLACEHOLDER_META_ID";

  // Auth: Get Authorization URL
  app.get("/api/auth/:platform/url", (req, res) => {
    const { platform } = req.params;
    const origin = req.headers.origin || `http://localhost:${PORT}`;
    const redirectUri = `${origin}/api/auth/${platform}/callback`;

    if (platform === "google") {
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/analytics.readonly%20https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent`;
      return res.json({ url });
    }

    if (platform === "meta") {
      const url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=ads_read,read_insights`;
      return res.json({ url });
    }

    res.status(400).json({ error: "Unsupported platform" });
  });

  // Auth: OAuth Callback
  app.get("/api/auth/:platform/callback", (req, res) => {
    const { platform } = req.params;
    const { code } = req.query;

    // In a real app, you'd exchange 'code' for tokens here
    // And store them in the user profile.
    
    // Send a message back to the opener window (ConnectorsSetup)
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { type: 'OAUTH_SUCCESS', platform: '${platform}', code: '${code}' },
              window.location.origin
            );
            window.close();
          </script>
          <p>Authentication successful. Closing window...</p>
        </body>
      </html>
    `);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
