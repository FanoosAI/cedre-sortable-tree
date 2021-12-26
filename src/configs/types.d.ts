declare module '*.eot';
declare module '*.ttf';
declare module '*.woff';
declare module '*.woff2';

type SedrahNodeData = import('./main-configs').NodeFields;

type ReactSetState<T> = import('react').Dispatch<
  import('react').SetStateAction<T>
>;
