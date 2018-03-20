process.stdin.resume();

import commander from 'commander';
import superagent from 'superagent';

import Config from './lib/config/config';
import Fetcher from './lib/fetcher/fetcher';
import Parser from './lib/parser/parser';
import Monitor from './lib/monitor/monitor';
import Generators from './lib/generators/generators';

import EventEmitter from 'eventemitter3';
import {
  APP_START,
  APP_DONE,
} from './lib/constants';

const emitter = new EventEmitter();

const packagejson = require(`${process.cwd()}/package.json`);

commander
  .version(packagejson.version)
  .usage('[options] [value]')
  .option('-d, --destination [path]', 'Path for generated files')
  .option('-s, --size [size]', 'The sprite\'s height')
  .option('--preproc [preprocessor type]', 'the css preprocessor type (less, sass etc...)')
  .option('-p, --prefix [prefix]', 'The classnames prefix')
  .option('-c, --cache', 'Force cache use (use last cached html and images) Dont use it if you want last released emojis')
  .parse(process.argv);

const config = Config(commander, emitter);
const fetcher = Fetcher(superagent, config, emitter);
const parser = Parser(config, emitter);
const monitor = Monitor(config, emitter);
const generators = Generators(config, emitter);

emitter.emit(APP_START);

emitter.on(APP_DONE, () => {
  process.exit(0);
});

process.on('SIGINT', function () {
  process.exit(2);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception...');
  logger.error(error.stack);
  process.exit(99);
});

process.on('error', (error) => {
  logger.error(error.message);
  logger.error(error.stack);
  process.exit(99);
});