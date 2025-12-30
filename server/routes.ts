import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Quick uptime check (no DB hit) - useful for monitoring
  app.get("/api/status", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  app.post(api.subscribers.create.path, async (req, res) => {
    try {
      console.log('[subscribe] Received request:', req.body);
      const input = api.subscribers.create.input.parse(req.body);
      console.log('[subscribe] Validated input:', input);
      
      const existing = await storage.getSubscriberByEmail(input.email);
      console.log('[subscribe] Existing subscriber:', existing);
      
      if (existing) {
        console.log('[subscribe] Email already subscribed');
        return res.status(409).json({ message: "Email already subscribed" });
      }

      const subscriber = await storage.createSubscriber(input);
      console.log('[subscribe] Created subscriber:', subscriber);
      res.status(201).json(subscriber);
    } catch (err) {
      console.error('[subscribe] Error:', err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Lightweight healthcheck that validates DB connectivity
  app.get("/health", async (_req, res) => {
    const started = Date.now();
    try {
      await pool.query("SELECT 1");
      return res.status(200).json({
        status: "ok",
        db: "up",
        responseTimeMs: Date.now() - started,
        uptimeSec: Math.floor(process.uptime()),
      });
    } catch (err: any) {
      return res.status(503).json({
        status: "degraded",
        db: "down",
        error: err?.message ?? "unknown",
        responseTimeMs: Date.now() - started,
        uptimeSec: Math.floor(process.uptime()),
      });
    }
  });

  return httpServer;
}
