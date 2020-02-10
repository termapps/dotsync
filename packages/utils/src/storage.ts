import { Callback } from './error';

export interface StoragePromptAnswers {
  [key: string]: string
}

export interface StorageSettings {
  method: string
  location: string
}

export interface StorageOptions {
  configdir: string
  settings: StorageSettings
}

export abstract class Storage {
  name: string
  description: string
  location: string
  configdir: string
  settings: StorageSettings

  constructor(name: string, description: string, location: string, opts: StorageOptions) {
    this.name = name;
    this.description = description;
    this.location = location;

    this.configdir = opts.configdir;
    this.settings = opts.settings;
  }

  abstract datadir(): string
  abstract validate(cb: (err?: Error, m?: string) => void): void

  init(cb: (err?: Error, m?: string) => void): void {
    return cb();
  }

  abstract latestVersion(cb: (err: Error | null, version?: string) => void): void
  abstract beforeRestore(cb: Callback): void
  abstract afterBackup(cb: Callback): void
}
