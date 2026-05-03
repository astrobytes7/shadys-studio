const axios = require('axios');
const BLOXLINK_API_KEY = "Bloxlink Key";

async function getRobloxAccount(guildId, userId) {
  try {
    const res = await axios.get(
      `https://api.blox.link/v4/public/guilds/${guildId}/discord-to-roblox/${userId}`,
      { headers: { Authorization: BLOXLINK_API_KEY } }
    );

    const data = res.data;

    if (!data.robloxID) {
      return null;
    }

    let username = 'Unknown';
    try {
      const userRes = await axios.get(`https://users.roblox.com/v1/users/${data.robloxID}`);
      const userData = userRes.data;
      if (userData.name) username = userData.name;
    } catch (e) {
      console.error('Failed to fetch Roblox username:', e);
    }

    return {
      id: data.robloxID,
      username,
      format: `**[${username}](https://www.roblox.com/users/${data.robloxID}/profile)**`,
      account: `**[${username}](https://www.roblox.com/users/${data.robloxID}/profile)** (${data.robloxID})`,
      link: `https://www.roblox.com/users/${data.robloxID}/profile`
    };
  } catch (error) {
    if (error.response?.status !== 404) {
        console.error('Bloxlink API Error:', error.response?.data || error.message);
    }
    return null;
  }
}

module.exports = { getRobloxAccount };