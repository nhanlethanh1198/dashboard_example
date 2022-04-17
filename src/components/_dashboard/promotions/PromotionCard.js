import PropTypes from 'prop-types';
import {useState, useEffect, useCallback, memo} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Grid,
  Stack,
  Tooltip,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Collapse,
} from '@mui/material';
import Label from 'src/components/Label';
import moment from 'moment';
import 'moment/locale/vi';
import {putUpdatePromotion} from 'src/api/promotions';
import {useSnackbar} from 'notistack';

const setCol = {
  2: {
    xs: 12,
    md: 6,
  },
  3: {
    xs: 12,
    md: 4,
  },
  4: {
    xs: 12,
    md: 3,
  },
};

const promotionLabel = {
  "system": "Áp dụng toàn bộ hệ thống",
  "user": "Chỉ một số người dùng",
  "order": "Voucher cho đơn hàng",
  "task": "Voucher cho công việc",
  "odd-shift": "Voucher cho ca lẻ",
  "fixed-shift": "Voucher cho ca cố định"
}

const PromotionCard = memo(({data, image, col, type}) => {
  const {enqueueSnackbar} = useSnackbar();
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    setIsActive(data?.is_active);
  }, [data, setIsActive]);

  const handleChange = useCallback(
    async (e) => {
      setIsActive(e.target.checked);

      const formData = new FormData();
      formData.append('status', e.target.checked);

      await putUpdatePromotion(data?.id, formData)
        .then((res) => {
          enqueueSnackbar('Thay đổi trạng thái thành công.', {
            variant: 'success',
            preventDuplicate: false,
          });
        })
        .catch((err) => {
          enqueueSnackbar('Thay đổi trạng thái thất bại!', {
            variant: 'error',
            preventDuplicate: false,
          });
        });
      return () => {};
    },
    [data.id, enqueueSnackbar]
  );

  const settings = (type) => {
    if (type === 'review') {
      return {
        xs: 12,
      };
    } else if (type === 'show') {
      return {...setCol[col]};
    } else {
      return {
        xs: 12,
        md: 4,
      };
    }
  };

  return (
    <Grid item {...settings(type)}>
      <Card>
        <CardMedia
          image={
            image ||
            'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
          }
          height="200"
          component="img"
          alt={data?.title || 'Chưa đặt.'}
        />
        <CardContent>
          <Stack spacing={'5px'}>
            <Tooltip title={data?.detail || 'Chưa đặt thông tin chi tiết cho mã CODE này.'}>
              {type === 'show' ? (
                <Typography
                  component={RouterLink}
                  to={`update/${data?.id}`}
                  color="primary"
                  variant="h5"
                  sx={{minHeight: '80px'}}
                >
                  {data?.title || 'Tiêu đề mã khuyến mãi'}
                </Typography>
              ) : (
                <Typography variant="h5">{data?.title || 'Tiêu đề mã khuyến mãi'}</Typography>
              )}
            </Tooltip>
            <Collapse
              in={data.detail !== ''}
              mountOnEnter
              appear
              exit
              timeout={{
                appear: 500,
                enter: 300,
                exit: 500,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {data?.detail}
              </Typography>
            </Collapse>

            <Label color="primary">
              {promotionLabel[data?.promotion_type]}
            </Label>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack
                  direction="column"
                  sx={{
                    height: '100px',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Label color="secondary">{data?.code?.toUpperCase() || 'CODE'}</Label>

                  {type === 'show' && (
                    <FormGroup sx={{width: '150px'}}>
                      <FormControlLabel
                        control={<Switch checked={isActive} onChange={handleChange} />}
                        label={
                          isActive ? (
                            <Label color="primary">Đang áp dụng</Label>
                          ) : (
                            <Label color="error">Đã khóa</Label>
                          )
                        }
                      />
                    </FormGroup>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="column" sx={{width: '220px'}}>
                  <Typography>
                    Bắt đầu: <br />
                    {!!data?.time_from
                      ? moment(data?.time_from).locale('vi').format('DD/MM/YYYY HH:mm:ss')
                      : 'Chưa đặt'}
                  </Typography>
                  <Typography>
                    Kết thúc: <br />
                    {!!data?.time_to
                      ? moment(data?.time_to).locale('vi').format('DD/MM/YYYY HH:mm:ss')
                      : 'Chưa đặt'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
});

PromotionCard.propTypes = {
  data: PropTypes.object.isRequired,
  col: PropTypes.number,
};

export default PromotionCard;
