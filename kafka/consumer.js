const { Kafka } = require("kafkajs");
const { pool } = require("../db/init");
const {
  broadcastPollUpdate,
  broadcastLeaderboardUpdate,
} = require("../websockets/socket");

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });

const consumer = kafka.consumer({ groupId: "vote-group" });

const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "votes", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const vote = JSON.parse(message.value.toString());
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          "UPDATE options SET vote_count = vote_count + 1 WHERE id = $1",
          [vote.optionId]
        );
        await client.query(
          "INSERT INTO votes_log(poll_id, option_id) VALUES($1, $2)",
          [vote.pollId, vote.optionId]
        );
        await client.query("COMMIT");
        broadcastPollUpdate(vote.pollId);
        broadcastLeaderboardUpdate(); // Optional step
      } catch (err) {
        console.error("Kafka consumer error:", err);
        await client.query("ROLLBACK");
      } finally {
        client.release();
      }
    },
  });
};

module.exports = { startKafkaConsumer };
