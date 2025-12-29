import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, stat } from "fs/promises";
import { resolve } from "path";

console.log("[build] Starting build process");
console.log("[build] CWD:", process.cwd());
console.log("[build] Node version:", process.version);

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
    const distPath = resolve(process.cwd(), "dist");
    console.log("[build] Target dist path:", distPath);
    
    await rm("dist", { recursive: true, force: true });
    console.log("[build] Cleaned dist directory");

    console.log("[build] Building client with vite...");
    const viteResult = await viteBuild();
    console.log("[build] Vite result:", viteResult);
    console.log("[build] Client build completed");

    console.log("[build] Building server with esbuild...");
    const pkg = JSON.parse(await readFile("package.json", "utf-8"));
    const allDeps = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    const externals = allDeps.filter((dep) => !allowlist.includes(dep));

    const esbuildResult = await esbuild({
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
    console.log("[build] Esbuild result:", esbuildResult);
    console.log("[build] Server bundle created");

    // Verify the output file exists
    const outputPath = resolve(process.cwd(), "dist/index.cjs");
    console.log("[build] Checking for output at:", outputPath);
    
    try {
      const stats = await stat(outputPath);
      console.log(`[build] SUCCESS: dist/index.cjs exists (${stats.size} bytes)`);
    } catch (err) {
      console.error("[build] FAILED: dist/index.cjs not found at", outputPath);
      throw new Error("Build failed: output file not created");
    }

    console.log("[build] Build completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("[build] BUILD FAILED WITH ERROR:");
    console.error(err);
    process.exit(1);
  }
}

buildAll();
