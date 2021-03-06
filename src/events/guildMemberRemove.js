const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client, { guild, user }) => {const { models } = global.sequelize;
  const { config } = await models.guild.findByPk(guild.id, { include: "config" });

  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  await client.user.setActivity(`${users} in ${guilds}`, { type: "WATCHING" });

  const data = await models.user.findByPk(user.id);
  if (data) await data.destroy();

  console.log(chalk`{yellow {bold ${user.tag}} has left {bold ${guild.name}}.}`);

  const channel = guild.channels.cache.find(channel => channel.name === "member-log");

  if (channel) {
    return channel.send({
      embed: {
        color: config.colors.default,
        author: { iconURL: user.displayAvatarURL(), name: user.tag },
        footer: { text: "User Joined" }
      }
    });
  }
};