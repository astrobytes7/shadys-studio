const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

module.exports = async (client) => {

    console.log('Started refreshing application (/) commands.');
    
    const commands = [];
    const devCommands = [];
    const commandNames = [];
    for (const [_, command] of client.commands) {
        const commandData = command.data?.toJSON();
        commandData.dm_permission ??= false;
        try {
            if (!commandData) throw `No command.data found - Did you forget to save the file?`;
            if (commandNames.includes(commandData?.name)) continue;
			commandNames.push(commandData.name);
            if (command.dev) {
                devCommands.push(commandData);
            } else {
                commands.push(commandData);
            }
        } catch(error) {
            console.error(`[REGISTER] Failed to register ${command.data.name}: ${error}`);
        }
    }

    if (devCommands.length > 0 && !client.config.DEV_GUILD_ID) {
        console.warn(`You have dev commands but no DEV_GUILD_ID in config.json - These will not be registered!`);
    }

    const rest = new REST({ version: '10' }).setToken(client.config.TOKEN);
    try {
        // Fetch existing commands to identify and preserve Entry Point commands (type 4)
        const existingCommands = await rest.get(Routes.applicationCommands(client.config.APP_ID));
        const entryPointCommands = existingCommands.filter(cmd => cmd.type === 4);
        
        for (const entryPoint of entryPointCommands) {
            if (!commandNames.includes(entryPoint.name)) {
                commands.push(entryPoint);
                commandNames.push(entryPoint.name);
            }
        }

        await rest.put(
            Routes.applicationCommands(client.config.APP_ID),
            { body: commands },
        );

        if (typeof client.config.DEV_GUILD_ID === 'string') {
            await rest.put(
                Routes.applicationGuildCommands(client.config.APP_ID, client.config.DEV_GUILD_ID),
                { body: devCommands },
            );
        }

        console.info('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

