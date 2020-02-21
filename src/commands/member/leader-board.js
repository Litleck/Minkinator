module.exports = {
  description: 'Leader board for user stats',
  aliases: ['lb'],
  parameters: [
    {
      name: 'stat',
      type: String,
      required: true
    },
    {
      name: 'page',
      type: Number
    }
  ],
  async execute (client, message, args) {
    const stat = args[0];

    if (!(stat in client.database.members.rawAttributes)) return message.channel.send(`${stat} is not a statistic.`);

    const members = await client.database.members.findAll({ order: [[stat, 'DESC']] });
    const leaderBoardEmbed = new client.discord.MessageEmbed();
    const pages = Math.ceil(members.length / 10);

    const indexedPage = args[1] - 1 || 0;
    const nonIndexedPage = args[1] || 1;

    let page = 1;

    leaderBoardEmbed.setColor(client.config.embed.color);
    leaderBoardEmbed.setTitle(`Member ${args[0]} leader board`);
    leaderBoardEmbed.setFooter(`Page ${nonIndexedPage} of ${pages}`);

    if (nonIndexedPage > pages || nonIndexedPage < 1 || isNaN(nonIndexedPage)) return message.channel.send(`Page ${nonIndexedPage} does not exist.`);

    members.slice(indexedPage * 10, nonIndexedPage * 10).map((member, index) => {
      leaderBoardEmbed.addField(`${index + 1 + indexedPage * 10}. ${member.name}:`, member[stat].toLocaleString());
    });

    const leaderBoardMessage = await message.channel.send(leaderBoardEmbed);

    if (pages > 1) leaderBoardMessage.react('➡️');

    leaderBoardMessage.react('❌');

    const filter = (reaction, user) => user.id === message.author.id && (
      reaction.emoji.name === '🏠' ||
        reaction.emoji.name === '⬅️' ||
        reaction.emoji.name === '➡️' ||
        reaction.emoji.name === '❌'
    );

    const collector = leaderBoardMessage.createReactionCollector(filter);

    collector.on('collect', async reaction => {
      const emoji = reaction.emoji.name;

      switch (emoji) {
        case '🏠':
          page = 1;
          leaderBoardMessage.reactions.removeAll();

          if (pages > 1) leaderBoardMessage.react('➡️');

          leaderBoardMessage.react('❌');
          break;
        case '⬅️':
          page--;
          leaderBoardMessage.reactions.removeAll();

          if (page !== 1) leaderBoardMessage.react('🏠');

          leaderBoardMessage.react('➡️');
          leaderBoardMessage.react('❌');
          break;
        case '➡️':
          page++;
          leaderBoardMessage.reactions.removeAll();
          leaderBoardMessage.react('🏠');
          leaderBoardMessage.react('⬅️');

          if (pages > page) leaderBoardMessage.react('➡️');

          leaderBoardMessage.react('❌');
          break;
        case '❌':
          return leaderBoardMessage.delete();
      }

      leaderBoardEmbed.fields = [];

      members.slice(indexedPage * 10, page * 10).map((member, index) => {
        leaderBoardEmbed.addField(`${index + 1 + (page - 1) * 10}. ${member.name}:`, member[stat].toLocaleString());
      });

      leaderBoardEmbed.setFooter(`Page ${page} of ${pages}`);

      leaderBoardMessage.edit(leaderBoardEmbed);
    });
  }
};