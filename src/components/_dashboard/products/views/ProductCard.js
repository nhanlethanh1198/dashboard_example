import PropTypes from 'prop-types';
import {useCallback, useLayoutEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useStoreState, useStoreActions} from 'easy-peasy';
// material
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  Select,
  MenuItem,
  InputBase,
  Tooltip,
  Button,
} from '@mui/material';
import {experimentalStyled as styled} from '@mui/material/styles';
// utils
import {fVNCurrency} from 'src/utils/formatNumber';
import {useForm, FormProvider, Controller} from 'react-hook-form';
import ProductStatus from './ProductStatus';
import {useCopyToClipboard} from 'src/hooks';
import {useSnackbar} from 'notistack';
import {Icon} from '@iconify/react';
import copyFill from '@iconify/icons-eva/copy-fill';

//
// import Label from 'src/components/Label';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({product}) {
  const navigate = useNavigate();
  const {avatar_img, name: productName, status, code} = product;
  const [, copy] = useCopyToClipboard(code);
  const {enqueueSnackbar} = useSnackbar();

  const {setDialog, setShowDialog} = useStoreActions((actions) => actions.dialog);
  const {setLockProduct} = useStoreActions((actions) => actions.products);
  const {confirm} = useStoreState((state) => state.dialog);

  const [statusChange, setStatusChange] = useState(status);
  const [statusCode, setStatusCode] = useState(status);
  const [price, setPrice] = useState({
    price: 0,
    price_sale: 0,
    weight: 0,
    unit: 'kg',
  });
  // const [dPrice, setDPrice] = useState(0);
  // const [sPrice, setSPrice] = useState(null);

  const setPrices = useCallback(() => {
    if (typeof product.price === 'object') {
      setPrice(product.price);
    } else {
      setPrice({
        price: product.price,
        price_sale: product.price_sale,
        weight: product.weight,
        unit: product.unit,
      });
    }
  }, [product]);

  // React-hook-form
  const methods = useForm({
    defaultValues: {
      status: status,
    },
    mode: 'onChange',
  });
  const {control, setValue} = methods;
  const handleChange = (e) => {
    const {name, value} = e.target;
    if (name === 'status') {
      setStatusChange(value);
      setLockProduct({
        code: code,
        value: value,
      });
      setDialog({
        dialogType: 'update_product',
        dialogHeader: `Cảnh báo thay đổi trạng thái!`,
        dialogMessage: `Bạn muốn thay đổi trạng thái sản phẩm ${productName}?`,
      });
      setShowDialog(true);
    }
  };

  //lắng nghe dialog store thay đổi thì change giá trị cũ
  useLayoutEffect(() => {
    // check price
    setPrices();

    if (confirm.accept === false) {
      setValue('status', statusCode);
    }
    if (confirm.accept === true) {
      setStatusCode(statusChange);
    }
    // eslint-disable-next-line
  }, [confirm, setValue, status]);

  const clickToCopy = useCallback(() => {
    copy();
    enqueueSnackbar(`Đã thêm ${code} vào clipboard!`, {variant: 'success'});
  }, [copy, code, enqueueSnackbar]);

  return (
    <Card>
      <Box sx={{pt: '100%', position: 'relative'}}>
        <ProductImgStyle alt={productName} src={avatar_img} loading="eager" />
      </Box>

      <Stack spacing={2} sx={{p: 3}}>
        <Stack direction="row" flexWrap="nowrap" justifyContent="space-between">
          <Link
            color="inherit"
            underline="hover"
            onClick={() => navigate(`/dashboard/products/update_product/${code}`, {replace: true})}
            sx={{cursor: 'pointer'}}
          >
            <Typography variant="subtitle2" noWrap>
              {productName}
            </Typography>
          </Link>
          <Typography variant="subtitle3" noWrap>
            {price?.weight || 'Cân nặng?'} {price?.unit || 'Đơn vị?'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="column" alignItems="flex-start">
            <Typography variant="subtitle1">
              <Typography
                component="span"
                variant={price?.price_sale < price?.price ? 'body1' : 'subtitle1'}
                sx={{
                  color: price?.price_sale < price?.price ? 'text.disable' : 'text.primary',
                  textDecoration: price?.price_sale < price?.price ? 'line-through' : 'none',
                }}
              >
                {fVNCurrency.format(price?.price || 0)}
              </Typography>
            </Typography>
            {price.price_sale < price.price && (
              <Typography variant="subtitle1" component="span">
                {fVNCurrency.format(price?.price_sale || 0)}
              </Typography>
            )}
          </Stack>
          <Stack direction="column">
            <Button variant="text" color="secondary" onClick={clickToCopy}>
              <Tooltip title="Nhấn để copy">
                <Typography variant="body2" sx={{whiteSpace: 'nowrap'}}>
                  Code <Icon icon={copyFill} />: {code}
                </Typography>
              </Tooltip>
            </Button>
            <Typography variant="body2" sx={{pl: 1}}>
              Tồn kho: {product?.stock}
            </Typography>
          </Stack>
        </Stack>
        <FormProvider {...methods}>
          <Box component="form" noValidate>
            <Controller
              name="status"
              control={control}
              defaultValue={status ?? 0}
              render={({field}) => {
                return (
                  <Select
                    {...field}
                    input={<InputBase p={0} />}
                    value={parseInt(field.value)}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                      handleChange(e);
                    }}
                    renderValue={(selected) => {
                      return <ProductStatus status={selected} />;
                    }}
                  >
                    <MenuItem value={0} sx={{display: 'none'}}>
                      Lỗi
                    </MenuItem>
                    <MenuItem value={1}>Còn hàng</MenuItem>
                    <MenuItem value={2}>Hết hàng</MenuItem>
                    <MenuItem value={3}>Đang nhập hàng</MenuItem>
                    <MenuItem value={4}>Đã khóa</MenuItem>
                  </Select>
                );
              }}
            />
          </Box>
        </FormProvider>
      </Stack>
    </Card>
  );
}
