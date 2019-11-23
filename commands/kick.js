module.exports = {
  name: 'kick',
  description: 'Kicks a member.',
  usage: '[member] <reason>',
  permissions: ['KICK_MEMBERS'],
  args: true,
  execute (client, message, args) {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    message.guild.member(member).kick();

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`${member.user.tag} has been kicked`)
      .setDescription(args[2] ? reason : 'No reason provided.')
      .setTimestamp());
  }
};
