const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sil")
    .setDescription("Belirtilen sayıda mesaj siler")
    .addIntegerOption(opt => opt.setName("miktar").setDescription("Silinecek mesaj sayısı").setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: "Yönetici yetkin yok!", ephemeral: true });

    const amount = interaction.options.getInteger("miktar");
    if (amount < 1 || amount > 100)
      return interaction.reply({ content: "1-100 arasında bir sayı girin!", ephemeral: true });

    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `${messages.size} mesaj silindi!`, ephemeral: true });
    } catch (e) {
      console.error(e);
      await interaction.reply({ content: "Mesajlar silinemedi!", ephemeral: true });
    }
  }
};
