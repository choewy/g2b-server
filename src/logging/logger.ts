import winston from 'winston';
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { WinstonModule, utilities } from 'nest-winston';

import { LogLevel } from '@nestjs/common';

export class WinstonLogger {
  private static readonly LEVEL = Symbol.for('level');

  private static getFormatByLevel(level: LogLevel) {
    const format = winston.format((info) => {
      if (info[this.LEVEL] === level) {
        return info;
      } else {
        return false;
      }
    });

    return format();
  }

  private static getDailyTransportOptions(level: LogLevel, appName?: string): DailyRotateFileTransportOptions {
    const dirname = './logs';
    const filename = [appName, '%DATE%', level, 'log'].join('.');
    const datePattern = 'YYYY-MM-DD';
    const maxSize = '500mb';
    const maxFiles = '3d';

    return {
      level,
      dirname,
      filename,
      datePattern,
      maxSize,
      maxFiles,
      format: winston.format.combine(this.getFormatByLevel(level), winston.format.timestamp(), winston.format.json()),
    };
  }

  static create(appName?: string) {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: 'silly',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(appName, {
            prettyPrint: true,
            colors: true,
          }),
        ),
      }),
    ];

    transports.push(
      new DailyRotateFile(this.getDailyTransportOptions('verbose', appName)),
      new DailyRotateFile(this.getDailyTransportOptions('warn', appName)),
      new DailyRotateFile(this.getDailyTransportOptions('error', appName)),
    );

    return WinstonModule.createLogger({ transports });
  }
}
