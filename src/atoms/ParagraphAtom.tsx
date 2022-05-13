import { CSSProperties } from 'react';

interface ParaAtomProps {
  text: string | number;
  mark?: boolean;
  style?: CSSProperties;
  markStyle?: CSSProperties;
}

function ParagraphAtom({
  text,
  style,
  mark,
  markStyle,
}: ParaAtomProps) {
  return mark ? (
    <p style={style}>
      <mark style={markStyle}>{text}</mark>
    </p>
  ) : (
    <p style={style}>{text}</p>
  );
}

export default ParagraphAtom;
