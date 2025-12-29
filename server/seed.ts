import { storage } from "./storage";

async function runSeed() {
  const existing = await storage.getSubscriberByEmail("hello@eliviar.com");
  if (!existing) {
    await storage.createSubscriber({ email: "hello@eliviar.com" });
    console.log("Seeded hello@eliviar.com");
  } else {
    console.log("Already seeded");
  }
}

runSeed().catch(console.error);
