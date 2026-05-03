const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'copy',
    description: 'Copies a custom emoji from another server and adds it to this server.',

    async execute(message, args) {
        // 1. Permission Check
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
            return message.reply({
                content: '<:Click:1497789500175290519> You need the **Manage Emojis and Stickers** permission to use this command.',
                allowedMentions: { repliedUser: false }
            });
        }

        // 2. Input Validation
        if (!args[0]) {
            return message.reply({
                content: 'Please provide a custom emoji to copy. Usage: `-copy <emoji>`',
                allowedMentions: { repliedUser: false }
            });
        }

        // 3. Parse Emoji
        // Regex for Discord custom emojis: <:name:id> or <a:name:id>
        const emojiRegex = /<(a?):(\w+):(\d+)>/;
        const match = args[0].match(emojiRegex);

        if (!match) {
            return message.reply({
                content: 'Invalid custom emoji. Only custom emojis from other servers can be copied.',
                allowedMentions: { repliedUser: false }
            });
        }

        const animated = match[1] === 'a';
        const name = match[2];
        const id = match[3];
        const extension = animated ? 'gif' : 'png';
        const url = `https://cdn.discordapp.com/emojis/${id}.${extension}`;

        try {
            // 4. Create the Emoji in the current guild
            const newEmoji = await message.guild.emojis.create({
                attachment: url,
                name: name,
                reason: `Emoji copied by ${message.author.tag} using -copy`
            });

            // 5. Success Message
            return message.reply({
                content: ` I have uploaded this emoji ${newEmoji}`,
                allowedMentions: { repliedUser: false }
            });

        } catch (error) {
            console.error('Error copying emoji:', error);

            let errorMessage = 'An error occurred while trying to copy the emoji.';
            if (error.code === 30008) {
                errorMessage = 'This server has reached its emoji limit.';
            } else if (error.code === 50013) {
                errorMessage = 'The bot does not have permission to manage emojis in this server.';
            }

            return message.reply({
                content: `<:Wrong:1409419053281316864> ${errorMessage} \n\`${error.message}\``,
                allowedMentions: { repliedUser: false }
            });
        }
    }
};
