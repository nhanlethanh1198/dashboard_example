import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Stack, Card, CardMedia, Button, Typography} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

const StaffUploadImage = ({initImage, register, isAvatar, label, name}) => {
  const [imageReview, setImageReview] = useState(null);

  useEffect(() => {
    initImage && setImageReview(initImage[name]);
  }, [initImage, name]);

  return (
    <Stack spacing={3}>
      <Typography variant="h6" align="center">
        {label}
      </Typography>
      <Card>
        <CardMedia
          component="img"
          src={
            imageReview ||
            'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
          }
          alt=""
          height="200"
          sx={{
            width: isAvatar ? '200px' : '300px',
          }}
        />
      </Card>

      <Stack direction="row" justifyContent="center">
        <label htmlFor={`${name}_upload_handler_label`}>
          <input
            id={`${name}_upload_handler_label`}
            style={{display: 'none'}}
            type="file"
            accept="image/*"
            {...register(name)}
          />

          <Button
            variant="contained"
            component="span"
            startIcon={imageReview ? <ChangeCircleIcon /> : <FileUploadIcon />}
            color={imageReview ? 'warning' : 'primary'}
          >
            {imageReview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
          </Button>
        </label>
      </Stack>
    </Stack>
  );
};

StaffUploadImage.propTypes = {
  initImage: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.any,
  isAvatar: PropTypes.bool,
};

StaffUploadImage.defaultProps = {
  isAvatar: false,
};

export default StaffUploadImage;
