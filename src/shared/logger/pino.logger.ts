import { pino, transport } from 'pino';
import { resolve } from 'node:path';
import { Logger } from './logger.interface.js';
import { getCurrentModuleDirectoryPath } from '../helpers/index.js';
import { injectable } from 'inversify';

@injectable()
export class PinoLogger implements Logger {
  private readonly modulePath = getCurrentModuleDirectoryPath();
  private readonly logFilePath = 'logs/rest.log';
  private readonly destination = resolve(
    this.modulePath,
    '../../../',
    this.logFilePath
  );

  private readonly multiTransport = transport({
    targets: [
      {
        target: 'pino/file',
        options: { destination: this.destination },
        level: 'debug',
      },
      {
        target: 'pino/file',
        level: 'info',
        options: {},
      },
    ],
  });

  private readonly logger = pino({}, this.multiTransport);

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
