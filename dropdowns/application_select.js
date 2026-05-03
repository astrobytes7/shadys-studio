module.exports = {
    customID: 'application_select',
    async execute(interaction) {
        const selection = interaction.values[0];
        
        // This is a placeholder for actual application logic (e.g., opening a modal)
        if (selection === 'apply_designer') {
            await interaction.reply({ content: "Designer applications are currently closed or under construction.", ephemeral: true });
        } else if (selection === 'apply_support') {
            await interaction.reply({ content: "Support applications are currently closed or under construction.", ephemeral: true });
        }
    }
};
