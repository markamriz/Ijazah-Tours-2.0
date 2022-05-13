import { CSSProperties } from 'react';

import Avatar from '@material-ui/core/Avatar';

interface AvatarAtomProps {
  image: string;
  alt: string;
  variant?: 'square' | 'rounded';
  style?: CSSProperties;
}

function AvatarAtom({
  image, alt, variant, style,
}: AvatarAtomProps) {
  return (
    <Avatar
      style={style}
      variant={variant}
      src={image}
      alt={alt}
    />
  );
}

export default AvatarAtom;
