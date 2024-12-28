const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/spotify/playlists/:playlistId", async (req, res) => {
  const { playlistId } = req.params;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Authorization token missing");
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: token } }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).send("Failed to fetch playlist");
  }
});

app.listen(PORT, () => {
  console.log("Backend is running");
});
