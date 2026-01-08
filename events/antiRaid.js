const joinMap = new Map();

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    const now = Date.now();
    const data = joinMap.get(member.guild.id) || [];
    data.push(now);
    joinMap.set(member.guild.id, data.filter(t => now - t < 10_000));

    if (data.length >= 5) {
      member.guild.setVerificationLevel(4);
    }
  }
};
