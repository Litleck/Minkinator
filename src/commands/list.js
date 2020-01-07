module.exports = {
  name: 'list',
  description: 'Lists items available to buy.',
  async execute (client, message, args) {
    const items = (await client.models[message.guild.name].variables.findByPk('items')).value;
    const prefix = (await client.models[message.guild.name].variables.findByPk('prefix')).value;
    const currency = await client.config.currency;

    const listingEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('The Shop')
      .setDescription(`Buy items using \`\`${prefix}buy [item] <amount>\`\` \n Sell items using \`\`${prefix}sell [item] [amount] [price]\`\``);

    items.map(item => {
      listingEmbed.addField(item.name, `${currency}${item.price}`);
    });

    return message.channel.send(listingEmbed);
  }
};