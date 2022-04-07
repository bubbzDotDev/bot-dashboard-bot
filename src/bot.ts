import { config } from 'dotenv';
config();
import 'reflect-metadata';
import { registerCommands, registerEvents } from './utils/registry';
import DiscordClient from './client/client';
import { Collection, Intents } from 'discord.js';
import { AppDataSource } from './typeorm/data-source';
import { GuildConfiguration } from './typeorm/entities/GuildConfiguration';
import { io } from 'socket.io-client';

const client = new DiscordClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

(async () => {
  const socket = io(process.env.API_HOST);

  socket.on('guildConfigUpdate', (config: GuildConfiguration) => {
    client.configs.set(config.guildId, config);
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
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();

