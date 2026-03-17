declare module 'react-katex' {
  import { ComponentType } from 'react';

  interface MathComponentProps {
    children?: string;
    math?: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
  }

  export const InlineMath: ComponentType<MathComponentProps>;
  export const BlockMath: ComponentType<MathComponentProps>;
}
