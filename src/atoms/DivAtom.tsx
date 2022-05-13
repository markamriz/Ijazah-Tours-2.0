import { ReactNode, CSSProperties } from 'react';

interface DivAtomProps {
  children?: ReactNode;
  style?: CSSProperties;
}

function DivAtom({ style, ...props }: DivAtomProps) {
  return <div style={style}>{props.children}</div>;
}

export default DivAtom;
