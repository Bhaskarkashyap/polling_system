const { pool } = require("../db/init");

exports.createPoll = async (req, res) => {
  const { question, options } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const pollRes = await client.query(
      "INSERT INTO polls(question) VALUES($1) RETURNING id",
      [question]
    );
    const pollId = pollRes.rows[0].id;

    for (const option of options) {
      await client.query("INSERT INTO options(poll_id, text) VALUES($1, $2)", [
        pollId,
        option,
      ]);
    }

    await client.query("COMMIT");
    res.status(201).json({ pollId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to create poll" });
  } finally {
    client.release();
  }
};

exports.getPollResults = async (req, res) => {
  const { id } = req.params;
  try {
    const options = await pool.query(
      "SELECT id, text, vote_count FROM options WHERE poll_id = $1",
      [id]
    );
    res.json({ pollId: id, results: options.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to get poll results" });
  }
};
