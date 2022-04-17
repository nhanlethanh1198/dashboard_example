import PropTypes from 'prop-types';
import {memo} from 'react';
import {
  Button,
  Collapse,
  Grid,
  LinearProgress,
  Tooltip,
  Typography,
  Zoom,
  Stack,
} from '@mui/material';
import {ProductTabPanelList, ProductTabPanelOrderList} from '.';
import Scrollbar from 'src/components/Scrollbar';

const ProductTabPanelBody = ({
  loading,
  productList,
  setOrderedProductList,
  isChangedArr,
  handleUpdateProductSalePosition,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={9}>
        {loading && <LinearProgress color="success" />}
        <Collapse in={!loading} timeout={1000} unmountOnExit>
          <Scrollbar sx={{maxHeight: '60vh', px: 2, pb: 4}}>
            <ProductTabPanelList productList={productList} />
          </Scrollbar>
        </Collapse>
      </Grid>
      {/* <Divider orientation="vertical" flexItem /> */}
      <Grid item xs={3}>
        <Tooltip
          title="Danh sách này sẽ hiện lên đầu trang"
          arrow
          placement="bottom"
          TransitionComponent={Zoom}
        >
          <Typography variant="subtitle1" align="center" gutterBottom>
            Sắp xếp danh sách
          </Typography>
        </Tooltip>
        <Collapse in={productList.length > 0} timeout="auto">
          <ProductTabPanelOrderList
            productList={productList}
            setOrderedProductList={setOrderedProductList}
          />
        </Collapse>
        <Stack direction="row" justifyContent="center" alignItems="center" mt={2}>
          <Zoom in={isChangedArr}>
            <Button
              size="small"
              color="warning"
              variant="contained"
              onClick={handleUpdateProductSalePosition}
            >
              Update danh sách
            </Button>
          </Zoom>
        </Stack>
      </Grid>
    </Grid>
  );
};

ProductTabPanelBody.propTypes = {
  productList: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  loading: PropTypes.bool,
  isChangedArr: PropTypes.bool,
  handleUpdateProductSalePosition: PropTypes.func,
};

ProductTabPanelBody.defaultProps = {
  productList: [],
  isRequired: false,
};

export default memo(ProductTabPanelBody);
