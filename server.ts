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
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/analytics.readonly%20https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent`;
      return res.json({ url });
    }

    if (platform === "meta") {
      const url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=ads_read,read_insights`;
      return res.json({ url });
    }

    if (platform === "tiktok") {
      const url = `https://business-api.tiktok.com/portal/auth?app_id=${process.env.TIKTOK_APP_ID}&state=your_custom_state&redirect_uri=${encodeURIComponent(redirectUri)}`;
      return res.json({ url });
    }

    if (platform === "klaviyo") {
      const url = `https://www.klaviyo.com/oauth/authorize?response_type=code&client_id=${process.env.KLAVIYO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=accounts:read`;
      return res.json({ url });
    }

    res.status(400).json({ error: "Unsupported platform" });
  });

  // Auth: OAuth Callback
  app.get("/api/auth/:platform/callback", (req, res) => {
    const { platform } = req.params;
    const { code } = req.query;
    
    // Sends a message back to the opener window (ConnectorsSetup)
    // The frontend then POSTs the code to /exchange-and-accounts to finish the flow securely
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { type: 'OAUTH_SUCCESS', platform: '${platform}', code: '${code}' },
              '*'
            );
            window.close();
          </script>
          <p>Authentication complete. Closing window...</p>
        </body>
      </html>
    `);
  });

  // Auth: Token Exchange & Account Fetching
  app.post("/api/auth/:platform/exchange-and-accounts", async (req, res) => {
    const { platform } = req.params;
    const { code } = req.body;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
    const redirectUri = `${protocol}://${host}/api/auth/${platform}/callback`;

    try {
      if (platform === "google") {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
          throw new Error("Missing Google OAuth credentials in backend environment.");
        }
        // 1. Exchange
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          })
        });

        if (!tokenRes.ok) {
           const errText = await tokenRes.text();
           throw new Error(`Google token exchange failed: ${errText}`);
        }

        const tokens: any = await tokenRes.json();
        const access_token = tokens.access_token;
        
        // 2. Fetch Accounts (e.g. GA4 Account summaries)
        const accRes = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
           headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!accRes.ok) {
           throw new Error("Failed to fetch Google accounts with token");
        }
        const accData: any = await accRes.json();
        
        const accounts = (accData.accountSummaries || []).map((acc: any) => ({
           id: acc.account,
           name: acc.displayName
        }));

        return res.json({ access_token, accounts });
      }

      if (platform === "meta") {
        if (!process.env.META_APP_ID || !process.env.META_APP_SECRET) {
          throw new Error("Missing Meta OAuth credentials.");
        }
        // 1. Exchange Code
        const tokenRes = await fetch(`https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${process.env.META_APP_SECRET}&code=${code}`);
        if (!tokenRes.ok) throw new Error("Meta token exchange failed");
        
        const tokens: any = await tokenRes.json();
        const access_token = tokens.access_token;

        // 2. Fetch Ad Accounts associated with the user
        const accRes = await fetch(`https://graph.facebook.com/v12.0/me/adaccounts?fields=name,account_id&access_token=${access_token}`);
        if (!accRes.ok) throw new Error("Failed to fetch Meta accounts");

        const accData: any = await accRes.json();
        const accounts = (accData.data || []).map((acc: any) => ({
           id: acc.account_id,
           name: acc.name
        }));

        return res.json({ access_token, accounts });
      }

      if (platform === "tiktok" || platform === "klaviyo") {
        throw new Error(`${platform} Exchange API unimplemented in demo`);
      }

      res.status(400).json({ error: "Unsupported platform or misconfiguration." });

    } catch (err: any) {
      console.error(`OAuth error for ${platform}:`, err.message);
      res.status(500).json({ error: err.message });
    }
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
