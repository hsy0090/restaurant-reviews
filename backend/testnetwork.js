import dns from "dns/promises";

dns.resolveSrv("_mongodb._tcp.cluster0.njruqlw.mongodb.net")
  .then(res => console.log("✅ SRV records:", res))
  .catch(err => console.error("❌ SRV failed:", err));