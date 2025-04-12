// Node.js type declarations
declare namespace NodeJS {
  interface Process {
    exit(code?: number): never;
  }

  interface Global {
    process: Process;
  }
}

declare var process: NodeJS.Process; 