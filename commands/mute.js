const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms'); // npm i ms

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Bir üyeyi susturur")
    .addUserOption(opt => opt.setName("user").setDescription("Susturulacak kullanıcı").setRequired(true))
    .addStringOption(opt => opt.setName("time").setDescription("Süre (10m,1h)").setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: "Yönetici yetkin yok!", ephemeral: true });

    const user = interaction.options.getUser("user");
    const time = interaction.options.getString("time");
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply("Kullanıcı bulunamadı!");

    try {
      await member.timeout(ms(time), `Mute komutu kullanıldı: ${interaction.user.tag}`);
      await interaction.reply(`${user.tag} ${time} boyunca susturuldu.`);
    } catch (e) {
      console.error(e);
      await interaction.reply("Mute işlemi başarısız oldu!");
    }
  }
};
