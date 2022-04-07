import BaseEvent from '../../utils/structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { AppDataSource } from '../../typeorm/data-source';
import { GuildConfiguration } from '../../typeorm/entities/GuildConfiguration';

export default class MessageEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository = AppDataSource.manager.getRepository(GuildConfiguration)
  ) {
    super('messageCreate');
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;

    const config = client.configs.get(message.guildId);
    if (!config) {
      message.channel.send('No configuration set. Creating one now.');

      const newConfig = this.guildConfigRepository.create({ guildId: message.guildId });
      const savedConfig = await this.guildConfigRepository.save(newConfig);
      client.configs.set(message.guildId, savedConfig);

      message.channel.send('All set! Try your command again.');
      return;
    }

    if (message.content.startsWith(config.prefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/\s+/);
      const command = client.commands.get(cmdName);
      if (command) {
        command.run(client, message, cmdArgs);
      }
    }
  }
}