import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import { GuildConfiguration } from '../typeorm/entities/GuildConfiguration';

export default class DiscordClient extends Client {

  private _events = new Collection<string, BaseEvent>();
  private _prefix: string = 'a!';
  private _configs = new Collection<string, GuildConfiguration>();

  constructor(options?: ClientOptions) {
    super(options);
  }

  get events(): Collection<string, BaseEvent> { return this._events; }

  get prefix(): string { return this._prefix; }

  set prefix(prefix: string) { this._prefix = prefix; }

  get configs() {
    return this._configs;
  }

  set configs(guildConfigs: Collection<string, GuildConfiguration>) {
    this._configs = guildConfigs;
  }
}
