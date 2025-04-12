// Type declarations for GraphQL modules
declare module 'graphql-tag' {
  export function gql(literals: string | readonly string[], ...placeholders: any[]): any;
} 