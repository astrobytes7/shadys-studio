require('dotenv').config();
const { Events, ActivityType, Client, PermissionsBitField } = require('discord.js');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "GuildPresences",
        "DirectMessages",
        "MessageContent"
    ]
});

client.config = require('./config.js');
client.cooldowns = new Map();
client.cache = new Map();
client.messages = new Map();

require('./utils/ComponentLoader.js')(client);
require('./utils/EventLoader.js')(client);
require('./utils/RegisterCommands.js')(client);

(async function () {
    if (!client.config.mongoURL) {
        console.warn('Skipping database connection');
        return;
    }
    await mongoose.connect(client.config.mongoURL);
    console.log('I have connected to the database succesfully');
})();

client.login(client.config.TOKEN);

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('Shady is so amazing...', { type: ActivityType.Custom });
});


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const prefix = client.config.prefix;
    if (!prefix || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.messages.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply(`There was an error running this command:\n\`\`\`${error.message || error}\`\`\``);
    }
});

async function InteractionHandler(interaction, type) {
    const component = client[type].get(interaction.customId ?? interaction.commandName);
    if (!component) return;
    try {
        await component.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        await interaction.editReply({
            content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``,
            embeds: [],
            components: [],
            files: []
        }).catch(() => { });
    }
}

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) return InteractionHandler(interaction, 'commands');
    if (interaction.isButton()) return InteractionHandler(interaction, 'buttons');
    if (interaction.isStringSelectMenu()) return InteractionHandler(interaction, 'dropdowns');
    if (interaction.isModalSubmit()) return InteractionHandler(interaction, 'modals');
});
