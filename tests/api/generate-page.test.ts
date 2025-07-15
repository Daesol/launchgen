// To run: npx tsx tests/api/generate-page.test.ts
import assert from "assert";

async function testGeneratePageAPI() {
  const res = await fetch("http://localhost:3000/api/generate-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "AI-powered meal planning app for busy professionals" }),
  });
  assert.strictEqual(res.status, 200, "Expected 200 OK");
  const data = await res.json();
  assert(data.config, "Response should contain a config object");
  assert(data.config.hero, "Config should have hero section");
  assert(data.config.features, "Config should have features array");
  console.log("/api/generate-page test passed!");
}

if (require.main === module) {
  testGeneratePageAPI().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
  });
} 