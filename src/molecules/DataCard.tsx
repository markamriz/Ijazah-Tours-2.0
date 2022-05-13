import { CSSProperties } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import ParagraphAtom from '../atoms/ParagraphAtom';
import { selectWithNavbarWidth } from '../redux/containerSizeSlice';
import { DataCardStyles } from '../styles';
import { widthHeightDynamicStyle } from '../utils/helpers';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    height: 120,
  },
});

interface DataCardProps {
  title: string;
  total: number;
  style?: CSSProperties;
}

export default function DataCard({ title, total, style }: DataCardProps) {
  const width = useSelector(selectWithNavbarWidth);

  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      style={{ ...style, marginBottom: widthHeightDynamicStyle(width, 768, '1rem', 0) }}
      variant="outlined"
    >
      <CardContent>
        <ParagraphAtom text={title} style={DataCardStyles.title} />
        <ParagraphAtom text={total} style={DataCardStyles.total} />
      </CardContent>
    </Card>
  );
}
