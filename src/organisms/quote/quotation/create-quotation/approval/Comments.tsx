import CheckboxAtom from '../../../../../atoms/CheckboxAtom';
import DivAtom from '../../../../../atoms/DivAtom';
import ParagraphAtom from '../../../../../atoms/ParagraphAtom';
import { approvalStyles } from '../../../../../styles';

interface CommentsProps {
  comments: any;
  setCommentsChecked: any;
  commentsChecked: boolean[];
}

function Comments({
  comments,
  setCommentsChecked,
  commentsChecked,
}: CommentsProps) {
  return (
    <DivAtom style={approvalStyles.offers.container}>
      {comments.map((c: { val: string }, i: number) => (
        <CheckboxAtom
          key={i}
          checked={commentsChecked[i]}
          onChange={() => {
            const updatedCommentsChecked = commentsChecked.map((val, index) => (
              index === i ? !val : val
            ));
            setCommentsChecked(updatedCommentsChecked);
          }}
          label={c.val}
          name={c.val}
        />
      ))}
    </DivAtom>
  );
}

export default Comments;
