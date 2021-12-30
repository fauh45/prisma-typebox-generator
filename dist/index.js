"use strict";

require("core-js/modules/es.promise.js");

var _generatorHelper = require("@prisma/generator-helper");

var _transformDMMF = require("./generator/transformDMMF");

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var _sdk = require("@prisma/sdk");

var _prettier = _interopRequireDefault(require("prettier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(0, _generatorHelper.generatorHandler)({
  onManifest() {
    return {
      defaultOutput: './typebox',
      prettyName: 'Prisma Typebox Generator'
    };
  },

  async onGenerate(options) {
    const payload = (0, _transformDMMF.transformDMMF)(options.dmmf);

    if (options.generator.output) {
      const outputDir = // This ensures previous version of prisma are still supported
      typeof options.generator.output === 'string' ? options.generator.output : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (0, _sdk.parseEnvValue)(options.generator.output);

      try {
        await fs.promises.mkdir(outputDir, {
          recursive: true
        });
        await Promise.all(payload.map(n => {
          const fsPromises = [];
          fsPromises.push(fs.promises.writeFile(path.join(outputDir, n.name + '.ts'), _prettier.default.format(n.rawString, {
            parser: 'babel-ts'
          }), {
            encoding: 'utf-8'
          }));

          if (n.inputRawString) {
            fsPromises.push(fs.promises.writeFile(path.join(outputDir, n.name + 'Input.ts'), _prettier.default.format(n.inputRawString, {
              parser: 'babel-ts'
            }), {
              encoding: 'utf-8'
            }));
          }

          return Promise.all(fsPromises);
        }));
      } catch (e) {
        console.error('Error: unable to write files for Prisma Typebox Generator');
        throw e;
      }
    } else {
      throw new Error('No output was specified for Prisma Typebox Generator');
    }
  }

});