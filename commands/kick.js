const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Bir üyeyi sunucudan atar")
    .addUserOption(opt => opt.setName("user").setDescription("Atılacak kullanıcı").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Sebep").setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: "Yönetici yetkin yok!", ephemeral: true });

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "Sebep belirtilmedi";
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply("Kullanıcı bulunamadı!");

    try {
      await member.kick(reason);
      await interaction.reply(`${user.tag} sunucudan atıldı. Sebep: ${reason}`);
    } catch (e) {
      console.error(e);
      await interaction.reply("Kick işlemi başarısız oldu!");
    }
  }
};
