// Global TypeScript declarations

declare namespace jest {
  function mock(moduleName: string, factory?: any): any;
  function fn(): jest.Mock;
  function clearAllMocks(): void;
  
  interface Mock<T = any, Y extends any[] = any> {
    (...args: Y): T;
    mockImplementation(fn: (...args: Y) => T): this;
    mockReturnValue(value: T): this;
    mockReturnThis(): this;
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: any): this;
  }
  
  interface Matchers<R> {
    toEqual(expected: any): R;
    toHaveBeenCalled(): R;
    toHaveBeenCalledWith(...args: any[]): R;
    toBeCalledWith(...args: any[]): R;
    toThrow(message?: string | Error | RegExp): R;
    not: Matchers<R>;
    rejects: Matchers<Promise<R>>;
  }
  
  type DoneCallback = (error?: any) => void;
}

// Add the expect.any() method
interface ExpectStatic extends jest.Matchers<void> {
  any(constructor: any): any;
}

declare function describe(name: string, fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function afterEach(fn: () => void): void;
declare function it(name: string, fn: (done?: jest.DoneCallback) => void | Promise<any>, timeout?: number): void;
declare function expect<T>(value: T): jest.Matchers<T>;

// Add the static methods to expect
declare namespace expect {
  const any: (constructor: any) => any;
}

declare namespace NodeJS {
  interface Global {
    expect: typeof expect;
  }
}

// Add missing Node.js module declarations
declare var module: { 
  id: string;
  exports: any;
  require: NodeRequire;
  filename: string;
  loaded: boolean;
  parent: NodeModule | null;
  children: NodeModule[];
  path: string;
  paths: string[];
};

declare var require: NodeRequire; 