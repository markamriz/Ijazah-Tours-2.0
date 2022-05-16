import { Button } from '@material-ui/core';
import ImageUploading from 'react-images-uploading';
import { v4 as uuid } from 'uuid';

export default function Uploader({ images, setter, btnText }) {
  return (
    <ImageUploading
      value={images}
      onChange={(imageList) => setter(imageList)}
      maxNumber={1}
      dataURLKey="data_url"
    >
      {({
        imageList, onImageUpdate, onImageRemove, isDragging, dragProps,
      }) => (
        <div className="upload-img-container">
          <Button
            className="upload-img-button"
            style={
              isDragging
                ? { color: 'white', backgroundColor: '#4C5A7B' }
                : { color: '#4C5A7B', border: '1px solid #4C5A7B' }
            }
            onClick={onImageUpdate}
            {...dragProps}
          >
            {btnText}
          </Button>

          {imageList.map((image, index) => (
            <div key={uuid()}>
              <img
                style={{ margin: '1rem 0' }}
                src={image.data_url || image}
                alt=""
                width="320"
              />
              <div>
                <Button
                  className="remove-img-button"
                  style={{ color: 'red', border: '1px solid red' }}
                  onClick={() => onImageRemove(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
}
