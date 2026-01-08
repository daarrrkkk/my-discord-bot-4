const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spam")
    .setDescription("Mesaj spam komutu")
    .addStringOption(opt => opt.setName("message").setDescription("Gönderilecek mesaj").setRequired(true))
    .addIntegerOption(opt => opt.setName("count").setDescription("Kaç kere gönderilecek").setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: "Yönetici yetkin yok!", ephemeral: true });

    const msg = interaction.options.getString("message");
    const count = interaction.options.getInteger("count");
    if (count > 50) return interaction.reply({ content: "Maksimum 50 mesaj gönderebilirsin!", ephemeral: true });

    for (let i = 0; i < count; i++) await interaction.channel.send(msg);
    await interaction.reply({ content: `${count} mesaj gönderildi!`, ephemeral: true });
  }
};
