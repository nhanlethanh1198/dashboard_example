import {PRODUCT_STATUS} from 'src/constants/productStatus';
import {memo} from 'react';
import {Stack, Typography} from '@mui/material';
import Label from 'src/components/Label';

const ProductStatus = memo(({status}) => {
  return (
    <Stack direction="row" justifyContent="flex-start">
      <Typography variant="body2">
        Trạng thái:{' '}
        <Label color={PRODUCT_STATUS[status]?.color || 'error'}>{PRODUCT_STATUS[status]?.label || 'Lỗi'}</Label>
      </Typography>
    </Stack>
  );
});

export default ProductStatus;
