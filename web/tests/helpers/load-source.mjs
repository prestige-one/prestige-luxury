import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInThisContext } from 'node:vm';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);

/** Execute real server helpers against the checked-in data; only framework request APIs need stubs. */
export function createSourceLoader(stubs = {}) {
  const cache = new Map();
  function load(file) {
    file = resolve(root, file);
    if (!existsSync(file)) file = ['.ts', '.tsx', '.json'].map(ext => file + ext).find(existsSync);
    if (!file) throw new Error('Source module not found');
    if (cache.has(file)) return cache.get(file).exports;
    const sourceModule = { exports: {} };
    cache.set(file, sourceModule);
    if (file.endsWith('.json')) return (sourceModule.exports = JSON.parse(readFileSync(file, 'utf8')));
    const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const localRequire = name => {
      if (Object.hasOwn(stubs, name)) return stubs[name];
      if (name.startsWith('@/')) return load(resolve(root, 'src', name.slice(2)));
      return name.startsWith('.') ? load(resolve(dirname(file), name)) : require(name);
    };
    runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, sourceModule, sourceModule.exports);
    return sourceModule.exports;
  }
  return load;
}
