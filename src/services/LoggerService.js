import winston from 'winston';

export default class LoggerService {
    constructor(env) {
        this.options = {
            levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                info: 3,
                http: 4,
                debug: 5,
            }
        };
        this.logger = this.createLogger(env);
    }

    createLogger = (env) => {
        const format = winston.format.combine(
            winston.format.simple()
        );

        switch (env) {
            case 'dev':
                return winston.createLogger({
                    levels: this.options.levels,
                    format,
                    transports: [
                        new winston.transports.Console({level: 'debug'}),
                        new winston.transports.File({level: 'error', filename: './errors.log'}),
                    ],
                });
            case 'prod':
                return winston.createLogger({
                    levels: this.options.levels,
                    format,
                    transports: [
                        new winston.transports.Console({level:'info'}),
                        new winston.transports.File({level:'error', filename:'./errors.log'}),
                    ],
                });
        }
    };
}