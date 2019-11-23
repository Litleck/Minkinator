module.exports = {
  name: 'reddit',
  description: 'Retrieves an image from a subreddit.',
  usage: '[subreddit]',
  aliases: ['rdt'],
  args: true,
  async execute (client, message, args) {
    const { body } = await client.snekfetch
      .get(`https://www.reddit.com/r/${args[0]}.json?sort=new`)
      .query({ limit: 128 });

    const posts = body.data.children.filter(post => !post.data.over_18 && (post.data.url.endsWith('.jpg') || post.data.url.endsWith('.png')));

    if (!body.data.children.length) return message.channel.send(`Subreddit \`\`r/${args[0]}\`\` does not exist.`);
    if (!posts.length) return message.channel.send(`No posts found in \`\`r/${args[0]}.\`\``);

    const post = posts[Math.floor(Math.random() * posts.length)].data;

    const embed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`r/${args[0]} ${post.title}`)
      .setURL(`https://reddit.com${post.permalink}`)
      .setDescription(post.selftext ? ',' + post.selftext : '')
      .addField('Author:', post.author, true)
      .addField('Score:', post.score, true);

    if (post.url.endsWith('.jpg') || post.url.endsWith('.png')) embed.setImage(post.url);

    return message.channel.send(embed);
  }
};
