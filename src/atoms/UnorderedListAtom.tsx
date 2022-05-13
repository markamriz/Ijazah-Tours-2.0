import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import DivAtom from './DivAtom';
import IconAtom from './IconAtom';

interface UnorderedListAtomProps {
  type: string;
  allChildren: { id: string, val: string }[];
  onEditItem: (type: string, id: string) => void;
  onDeleteItem: (type: string, id: string) => void;
}

function UnorderedListAtom({
  type,
  allChildren,
  onEditItem,
  onDeleteItem,
}: UnorderedListAtomProps) {
  return (
    <ul>
      {allChildren.map((val) => (
        <DivAtom key={val.id} style={{ display: 'flex', alignItems: 'center' }}>
          <li style={{ width: '150px' }}>{val.val}</li>
          <IconAtom size="small" onClick={() => onEditItem(type, val.id)} style={{ color: 'green' }}>
            <EditOutlinedIcon />
          </IconAtom>
          <IconAtom size="small" onClick={() => onDeleteItem(type, val.id)} style={{ color: 'red' }}>
            <DeleteOutlinedIcon />
          </IconAtom>
        </DivAtom>
      ))}
    </ul>
  );
}

export default UnorderedListAtom;
