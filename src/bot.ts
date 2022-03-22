import { config } from 'dotenv';
config();
import { registerCommands, registerEvents } from './utils/registry';
import DiscordClient from './client/client';
import { Collection, Intents } from 'discord.js';

const client = new DiscordClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

(async () => {
  client.prefix = process.env.DISCORD_BOT_PREFIX || client.prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();

