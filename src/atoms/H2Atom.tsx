import { CSSProperties } from 'react';

interface H2AtomProps {
  text: string;
  style?: CSSProperties,
}

function H2Atom({ text, style }: H2AtomProps) {
  return <h2 style={style}>{text}</h2>;
}

export default H2Atom;
