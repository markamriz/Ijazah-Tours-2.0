import { ReactNode, CSSProperties, MouseEventHandler } from 'react';

import IconButton from '@material-ui/core/IconButton';

interface IconAtomProps {
  size: 'small' | 'medium';
  onClick: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  style?: CSSProperties;
}

function IconAtom({
  onClick, size, style, ...props
}: IconAtomProps) {
  return (
    <IconButton style={style} size={size} onClick={onClick}>
      {props.children}
    </IconButton>
  );
}

export default IconAtom;
