import AvatarAtom from '../atoms/AvatarAtom';
import DivAtom from '../atoms/DivAtom';
import ParagraphAtom from '../atoms/ParagraphAtom';
import { guestProfileStyles } from '../styles';

interface GuestProfileProps {
  image: string;
  title: string;
  subtitle?: string;
  paraColor?: string;
  titleWeight?: number;
}

function GuestProfile({
  image,
  title,
  subtitle,
  paraColor,
  titleWeight,
}: GuestProfileProps) {
  return (
    <DivAtom style={guestProfileStyles.container}>
      <AvatarAtom
        image={image}
        alt="guest"
        variant="rounded"
        style={guestProfileStyles.avatar}
      />
      <DivAtom style={guestProfileStyles.innerContainer}>
        <ParagraphAtom
          style={{ ...guestProfileStyles.paragraph, fontWeight: titleWeight, color: paraColor }}
          text={title}
        />
        {subtitle && (
          <ParagraphAtom
            style={{ ...guestProfileStyles.paragraph, color: paraColor }}
            text={subtitle}
          />
        )}
      </DivAtom>
    </DivAtom>
  );
}

export default GuestProfile;
