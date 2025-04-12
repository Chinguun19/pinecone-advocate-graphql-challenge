// This file adds TypeScript declarations for mongoose
declare module 'mongoose' {
  export interface Document {
    _id: any;
    [key: string]: any;
  }

  export interface Model<T extends Document> {
    find(conditions: any): { sort: (options: any) => Promise<T[]> };
    findOne(conditions: any): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    findByIdAndUpdate(id: string, update: any, options?: any): Promise<T | null>;
    deleteMany(conditions: any): Promise<any>;
    insertMany(docs: any[]): Promise<T[]>;
    save(): Promise<T>;
  }

  export class Schema<T = any> {
    constructor(definition: any, options?: any);
  }

  export function model<T extends Document>(name: string, schema: Schema<T>): Model<T>;
  export function connect(uri: string, options?: any): Promise<typeof mongoose>;

  export const models: {
    [key: string]: Model<any>;
  };

  export const connection: {
    close(): Promise<void>;
  };

  export type Types = {
    ObjectId: any;
  };
} 