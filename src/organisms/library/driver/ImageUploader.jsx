import styled from 'styled-components';

import Uploader from '../../../molecules/Uploader';

function ImageUploader({
  insurance,
  setInsurance,
  profilePic,
  setProfilePic,
  vehiclePic,
  setVehiclePic,
}) {
  return (
    <ImageUploadContainer>
      <Uploader images={insurance} setter={setInsurance} btnText="Upload Full Insurance" />
      <Uploader
        images={profilePic}
        setter={setProfilePic}
        btnText="Upload Profile"
      />
      <Uploader
        images={vehiclePic}
        setter={setVehiclePic}
        btnText="Upload Vehicle Image"
      />
    </ImageUploadContainer>
  );
}

export default ImageUploader;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-top: 2rem;

  button.upload-img-button,
  button.remove-img-button {
    width: 20rem;

    :first-child {
      margin-bottom: 1rem;
    }
  }

  @media screen and (max-width: 750px) {
    flex-direction: column;
    align-items: center;

    button.upload-img-button:last-child {
      margin-top: 1rem;
    }

    button.remove-img-button {
      margin-bottom: 2rem;
    }
  }
`;
