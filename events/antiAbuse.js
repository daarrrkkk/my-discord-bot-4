const banMap = new Map();

module.exports = {
  name: "guildBanAdd",
  async execute(ban) {
    const logs = await ban.guild.fetchAuditLogs({ type: 22, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const { executor } = entry;
    if (!executor) return;

    const count = banMap.get(executor.id) || 0;
    banMap.set(executor.id, count + 1);

    if (count + 1 >= 3) {
      const member = await ban.guild.members.fetch(executor.id).catch(() => null);
      if (member) {
        await member.ban({ reason: "Yetkili suistimali (3 ban)" });
      }
    }

    setTimeout(() => banMap.delete(executor.id), 60_000);
  }
};
