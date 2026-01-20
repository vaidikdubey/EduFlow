import { db } from '../db/db.js';
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

const healthCheck = asyncHandler(async (req, res) => {
  let dbStatus = "Unknown";
  let dbHealthy = false;

  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = "Connected";
    dbHealthy = true;
  } catch (error) {
    dbStatus = "Disconnected / Error";
    console.error("DB health check failed:", error.message);
  }

  return res.status(dbHealthy ? 200 : 503).json(
    new ApiResponse(
      dbHealthy ? 200 : 503,
      {
        uptime: process.uptime().toFixed(0) + "s",
        database: dbStatus,
        timestamp: new Date().toISOString(),
      },
      dbHealthy ? "Server is healthy 🚀" : "Database connection issue"
    )
  );
});

export { healthCheck };