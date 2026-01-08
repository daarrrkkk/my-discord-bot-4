const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bir üyeyi sunucudan banlar")
    .addUserOption(opt => opt.setName("user").setDescription("Banlanacak kullanıcı").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Sebep").setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: "Yönetici yetkin yok!", ephemeral: true });

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "Sebep belirtilmedi";
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply("Kullanıcı bulunamadı!");

    try {
      await member.ban({ reason });
      await interaction.reply(`${user.tag} banlandı. Sebep: ${reason}`);
    } catch (e) {
      console.error(e);
      await interaction.reply("Ban işlemi başarısız oldu!");
    }
  }
};
