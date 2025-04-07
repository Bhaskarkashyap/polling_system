const express = require("express");
const { createPoll, getPollResults } = require("../controllers/polls");
const { sendVoteToKafka } = require("../kafka/producer");

const router = express.Router();

router.post("/", createPoll);

router.post("/:id/vote", async (req, res) => {
  const { id } = req.params;
  const { optionId } = req.body;
  try {
    await sendVoteToKafka({
      pollId: parseInt(id),
      optionId: parseInt(optionId),
    });
    res.status(200).json({ message: "Vote sent to Kafka" });
  } catch (err) {
    console.error("Vote error", err);
    res.status(500).json({ error: "Failed to send vote" });
  }
});

router.get("/:id", getPollResults);

module.exports = router;
