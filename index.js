const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("ws");
const dotenv = require("dotenv");
const pollRoutes = require("./routes/polls");
const { initDB } = require("./db/init");
const { startKafkaConsumer } = require("./kafka/consumer");
const { setupWebSocket } = require("./websockets/socket");
const cors = require("cors");
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

app.use(express.static(path.join(__dirname, "frontend")));
app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "*", // or wherever your frontend is running
  })
);

app.use("/polls", pollRoutes);

app.get("/polls", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.question, 
             json_agg(json_build_object('id', o.id, 'text', o.text)) AS options
      FROM polls p
      JOIN poll_options o ON p.id = o.poll_id
      GROUP BY p.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching polls:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

setupWebSocket(wss);

(async () => {
  await initDB();
  startKafkaConsumer(); // Real-time vote processing
  server.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})();
