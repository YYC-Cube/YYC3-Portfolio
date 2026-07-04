// src/lib/infra/logger.ts
var SilentLogger = class {
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};
function createLogger(prefix) {
  {
    return new SilentLogger();
  }
}
var logger = new Proxy({}, {
  get(_target, prop) {
    const current = createLogger();
    const fn = current[prop];
    if (typeof fn === "function") {
      return fn.bind(current);
    }
    return void 0;
  }
});

export { logger };
//# sourceMappingURL=chunk-3NJY7HIT.js.map
//# sourceMappingURL=chunk-3NJY7HIT.js.map