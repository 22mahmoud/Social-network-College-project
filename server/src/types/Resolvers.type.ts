export type Resovler = (parent: any, args: any, context: any, info: any) => any;
export interface ResolverMap {
  [key: string]: {
    [key: string]: Resovler;
  };
}
