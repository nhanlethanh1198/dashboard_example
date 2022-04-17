import {useState, useLayoutEffect, memo} from 'react';
import {useFormContext} from 'react-hook-form';
import {styled} from '@mui/material/styles';
import {Button, Box, Card, CardMedia, Typography, Stack} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const RootStyle = styled(Stack)({
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
});

const ProductImagePicker = ({name, header, id, initImage, ...order}) => {
  const [image, setImage] = useState(null);
  const methods = useFormContext();

  useLayoutEffect(() => {
    if (initImage) {
      setImage(initImage);
    }
    return () => setImage(null);
  }, [initImage]);

  const {register, watch, setValue} = methods;

  const imageFile = watch(name);

  useLayoutEffect(() => {
    register(name);
    let url = null;
    if (imageFile && imageFile?.length > 0) {
      const file = imageFile[0];
      url = URL.createObjectURL(file);
      setImage(url);
    }
    return () => URL.revokeObjectURL(url);
  }, [imageFile, register, name]);

  const resetInput = () => {
    setImage(null);
    // reset({[name]: undefined});
    setValue(name, undefined);
  };

  return (
    <Box>
      {header && (
        <Typography align="center" variant="h6">
          {header}
        </Typography>
      )}
      <RootStyle {...order}>
        <Card {...order} variant="elevation">
          <CardMedia
            component="img"
            src={
              image ||
              'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
            }
            {...order}
          />
        </Card>
        <Stack
          direction="row"
          justifyContent={name === 'avatar_img' ? 'center' : 'space-between'}
          spacing={1}
        >
          <label htmlFor={`${name}_label`}>
            <input
              type="file"
              {...register(name)}
              style={{display: 'none'}}
              id={`${name}_label`}
              accept="image/*"
            />
            <Button
              variant="contained"
              component="span"
              color={image ? 'warning' : 'primary'}
              startIcon={<FileUploadIcon />}
              size="small"
            >
              {!image ? 'Tải ảnh lên' : 'Đổi ảnh'}
            </Button>
          </label>
          {name !== 'avatar_img' && image && (
            <Button
              color="error"
              onClick={resetInput}
              startIcon={<DeleteIcon />}
              variant="outlined"
              size="small"
            >
              Xóa
            </Button>
          )}
        </Stack>
      </RootStyle>
    </Box>
  );
};

export default memo(ProductImagePicker);
