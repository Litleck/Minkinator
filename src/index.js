const config = global.config = require("./config/config.json");
const auth = global.auth = require("./config/auth.json");
const Discord = global.Discord = require("discord.js");

const client = global.client = new Discord.Client(config.clientOptions);

const moment = require("moment");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

global.util = require("./util/functions.js");

// Set client properties
client.database = require("./models/");
client.coolDowns = new Map();

// Set up event handler
client.loadEvents = async () => {
  const eventsDir = path.join(__dirname, "events");

  client.events = fs.readdirSync(eventsDir).map(eventName => {
    const eventPath = path.join(eventsDir, eventName);
    delete require.cache[eventPath];
    const event = require(eventPath);

    client.on(path.parse(eventName).name, event.bind(null, client));

    return event;
  });

  console.log(chalk.green(`(${moment().format("HH:mm M/D/Y")})`), `Successfully loaded ${client.events.length} events.`);
};

// Set up command handler
client.loadCommands = async () => {
  client.commands = [];

  const commandsDir = path.join(__dirname, "commands");

  fs.readdirSync(commandsDir).forEach(category => {
    const categoryDir = path.join(commandsDir, category);

    fs.readdirSync(categoryDir).forEach(commandName => {
      const commandPath = path.join(categoryDir, commandName);
      delete require.cache[commandPath];

      let command;

      try {
        command = require(commandPath);
      } catch (error) {
        console.log(chalk.green(`(${moment().format("HH:mm M/D/Y")})`), `Failed to load ${commandName}, skipping.`);
        return console.error(error);
      }

      if (category === "owner") command.ownerOnly = true;

      command.name = commandName.replace(".js", "");
      command.category = category;

      client.commands.push(command);
    });
  });

  console.log(chalk.green(`(${moment().format("HH:mm M/D/Y")})`), `Successfully loaded ${client.commands.length} commands.`);
};

// Load events and commands
client.loadEvents();
client.loadCommands();

// Login to Discord API
if (!auth.discord) return console.error("No token provided, enter a token in to the auth file to login.");

client.login(auth.discord);

// Handle promise rejections
process.on("unhandledRejection", error => console.error(error));

// Take input from stdin
process.stdin.on("data", async data => {
  try {
    console.log(await eval(`(async()=>{${data.toString()}})()`));
  } catch (error) {
    console.error(error.message);
  }
});

process.on("SIGINT", function() {
  client.destroy();
  process.exit();
});