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
  app.post(api.subscribers.create.path, async (req, res) => {
    try {
      const input = api.subscribers.create.input.parse(req.body);
      
      const existing = await storage.getSubscriberByEmail(input.email);
      if (existing) {
        return res.status(409).json({ message: "Email already subscribed" });
      }

      const subscriber = await storage.createSubscriber(input);
      res.status(201).json(subscriber);
    } catch (err) {
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
