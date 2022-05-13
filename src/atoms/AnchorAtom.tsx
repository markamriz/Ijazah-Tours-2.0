import { CSSProperties } from 'react';

interface AnchorAtomProps {
  title: string;
  href: string;
  style?: CSSProperties;
}

function AnchorAtom({
  title,
  href,
  style,
}: AnchorAtomProps) {
  return (
    <a style={style} href={href} target="_blank">
      {title}
    </a>
  );
}

export default AnchorAtom;
