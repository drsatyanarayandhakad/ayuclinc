import "dotenv/config";
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { generateSitemap } from "../sitemap";
import { sdk } from "./sdk";
import { getSessionCookieOptions } from "./cookies";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);

  // Admin login route
  app.post("/auth/admin/login", async (req: Request, res: Response) => {
    const { password } = req.body as { password?: string };
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      res.status(500).json({ error: "ADMIN_PASSWORD env var not configured" });
      return;
    }
    if (!password || password !== adminPassword) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const ADMIN_OPEN_ID = "admin";
    await db.upsertUser({
      openId: ADMIN_OPEN_ID,
      name: "Admin",
      email: null,
      loginMethod: "password",
      role: "admin",
      lastSignedIn: new Date(),
    });

    const token = await sdk.createSessionToken(ADMIN_OPEN_ID, {
      name: "Admin",
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    res.json({ success: true });
  });
  
  // Health check — used by anti-sleep self-ping
  app.get("/healthz", (_req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });

  // Sitemap route
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const sitemap = generateSitemap(baseUrl);
    res.type("application/xml");
    res.send(sitemap);
  });
  
  // tRPC API
  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

// Anti-sleep self-ping — keeps the server awake even with no visitors
// Pings every 4 minutes so Replit deployment never goes idle
setTimeout(() => {
  const PING_INTERVAL_MS = 4 * 60 * 1000;
  const selfPing = () => {
    const port = parseInt(process.env.PORT || "3000");
    const url = `http://localhost:${port}/healthz`;
    fetch(url).catch(() => {});
  };
  setInterval(selfPing, PING_INTERVAL_MS);
  console.log("[anti-sleep] Self-ping enabled every 4 minutes");
}, 10000);
