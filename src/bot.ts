import { config } from 'dotenv';
config();
import 'reflect-metadata';
import { REST } from '@discordjs/rest';
import { registerCommands, registerEvents } from './utils/registry';
import DiscordClient from './client/client';
import { Collection, Guild, TextChannel, IntentsBitField, Routes } from 'discord.js';
import { AppDataSource } from './typeorm/data-source';
import { GuildConfiguration } from './typeorm/entities/GuildConfiguration';
import { io } from 'socket.io-client';
import HelpCommand from "./commands/help/HelpCommand";

const token = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(token);

const client = new DiscordClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
  ],
});

(async () => {
  const socket = io(process.env.API_HOST);

  socket.on('guildConfigUpdate', (config: GuildConfiguration) => {
    client.configs.set(config.guildId, config);
  });

  socket.on('announce', (payload) => {
    const guild = client.guilds.cache.get(payload.guildId) as Guild;
    const channel = guild.channels.cache.get(payload.channelId) as TextChannel;
    try {
      channel.send({ embeds: payload.embeds });
    } catch(err) {
      console.log(err);
    }
  });

  await AppDataSource.initialize()
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((error) => console.log(error));
  
  const configRepo = AppDataSource.manager.getRepository(GuildConfiguration);
  const guildConfigs = await configRepo.find();
  const configs = new Collection<string, GuildConfiguration>();
  guildConfigs.forEach(config => {
    configs.set(config.guildId, config);
  });
  client.configs = configs;
  await registerEvents(client, '../events');

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
      const config = client.configs.get(interaction.guildId);
      if (!config) {
        await interaction.reply({ content: 'One second. Connecting the bot to the new dashboard now.', ephemeral: true});

        const newConfig = configRepo.create({ guildId: interaction.guildId });
        const savedConfig = await configRepo.save(newConfig);
        client.configs.set(interaction.guildId, savedConfig);

        await interaction.followUp({ content: 'All set! Try your command again.', ephemeral: true});
        return;
      }
      await interaction.reply('Visit https://www.announcementbot.live to access the new dashboard!');
    }
  });

  const commands = [
    HelpCommand,
  ];

  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    await client.login(token);
  } catch (err) {
    console.log(err);
  }
})();

