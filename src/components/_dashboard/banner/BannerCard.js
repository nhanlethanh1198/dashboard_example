import PropTypes from 'prop-types';
import {
  Card,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  CardMedia,
  CardActions,
} from '@mui/material';
import {memo} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import Label from 'src/components/Label';
import {useState} from 'react';
import {putBannerById} from 'src/api/banner';
import {useSnackbar} from 'notistack';

const BannerCard = ({item, image, type}) => {
  const {enqueueSnackbar} = useSnackbar();
  const [isActive, setIsActive] = useState(item?.is_active);

  const handleChange = (e) => {
    const checked = e.target.checked;
    setIsActive(checked);

    const formData = new FormData();
    formData.append('is_active', checked);

    putBannerById(item.id, formData)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar('Thay đổi trạng thái thành công.', {
            variant: 'success',
            preventDuplicate: false,
          });
        }
      })
      .catch((err) => {
        console.error(err.message);
        setIsActive(!checked);
        enqueueSnackbar('Thay đổi trạng thái thất bại!', {
          variant: 'error',
          preventDuplicate: false,
        });
      });
  };

  return (
    <Card>
      <CardMedia
        component="img"
        image={
          image ||
          'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
        }
        title={item?.title || 'Title...'}
        height="300"
      />
      <CardActions
        sx={{mb: 2, px: 2, justifyContent: type === 'show' ? 'space-between' : 'center'}}
      >
        <Typography
          variant="h6"
          component={type === 'show' ? RouterLink : 'h6'}
          to={`/dashboard/banners/update/${item.id}`}
          color="grey.700"
        >
          {item?.title || 'Tiêu đề ...'}
        </Typography>
        {type === 'show' && (
          <FormGroup sx={{width: '100px'}}>
            <FormControlLabel
              control={<Switch checked={isActive} onChange={handleChange} />}
              label={
                isActive ? <Label color="primary">Bật</Label> : <Label color="error">Tắt</Label>
              }
            />
          </FormGroup>
        )}
      </CardActions>
    </Card>
  );
};

BannerCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default memo(BannerCard);
