export type OverloadParameters<
  TFunc extends (...args: TArgs) => any,
  TArgs extends any[]
> = TFunc extends (...args: infer P) => any
  ? TArgs extends P
    ? P
    : never
  : never;
