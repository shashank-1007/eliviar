import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, stat } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  try {
    console.log("[build] Starting build process...");
    
    await rm("dist", { recursive: true, force: true });
    console.log("[build] Cleaned dist directory");

    console.log("[build] Building client...");
    await viteBuild();
    console.log("[build] Client build completed successfully");

    console.log("[build] Building server...");
    const pkg = JSON.parse(await readFile("package.json", "utf-8"));
    const allDeps = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    const externals = allDeps.filter((dep) => !allowlist.includes(dep));

    await esbuild({
      entryPoints: ["server/index.ts"],
      platform: "node",
      bundle: true,
      format: "cjs",
      outfile: "dist/index.cjs",
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      minify: true,
      external: externals,
      logLevel: "info",
    });
    console.log("[build] Server build completed successfully");

    // Verify the output file exists
    try {
      const stats = await stat("dist/index.cjs");
      console.log(`[build] Output file created: dist/index.cjs (${stats.size} bytes)`);
    } catch (err) {
      console.error("[build] ERROR: dist/index.cjs was not created!");
      throw new Error("Build failed: output file not found");
    }

    console.log("[build] Build complete - ready for deployment");
  } catch (err) {
    console.error("[build] FATAL ERROR:", err);
    process.exit(1);
  }
}

buildAll();
