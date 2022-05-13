import { CSSProperties } from 'react';

interface SpanAtomProps {
  text?: string;
  style?: CSSProperties;
}

function SpanAtom({ text, style }: SpanAtomProps) {
  return (
    <span style={style}>
      {text}
    </span>
  );
}

export default SpanAtom;
