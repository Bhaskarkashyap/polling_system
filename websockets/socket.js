let wss;

const setupWebSocket = (server) => {
  wss = server;
  console.log("WebSocket server running");
};

const broadcastPollUpdate = (pollId) => {
  const data = JSON.stringify({ type: "pollUpdate", pollId });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
};

const broadcastLeaderboardUpdate = () => {
  const data = JSON.stringify({ type: "leaderboardUpdate" });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
};

module.exports = {
  setupWebSocket,
  broadcastPollUpdate,
  broadcastLeaderboardUpdate,
};
