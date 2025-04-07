const { Kafka } = require("kafkajs");
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

const sendVoteToKafka = async (vote) => {
  await producer.connect();
  await producer.send({
    topic: "votes",
    messages: [{ value: JSON.stringify(vote) }],
  });
  await producer.disconnect();
};

module.exports = { sendVoteToKafka };
