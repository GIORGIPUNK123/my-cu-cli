#!/usr/bin/env node
'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const commander_1 = require('commander');
const main_1 = require('./src/main');
(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    commander_1.program.version('1.0.0').description('Check My Cu From CLI ');
    commander_1.program
      .command('info <pirn>') // Use 'info' as the command name
      .description('Get Latest Info From My Cu')
      .action((pirn) =>
        __awaiter(void 0, void 0, void 0, function* () {
          console.log(yield (0, main_1.mainFunc)(pirn));
        })
      );
    yield commander_1.program.parseAsync(process.argv);
  }))();
