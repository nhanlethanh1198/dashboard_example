import PropTypes from 'prop-types';
import {Grid} from '@mui/material';
import {ProductCard} from '../../products';

const ProductTabPanelList = ({productList}) => {
  return (
    <Grid container spacing={3}>
      {productList.map((product) => (
        <Grid item key={product.code} xs={12} sm={6} md={4}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

ProductTabPanelList.propTypes = {
  productList: PropTypes.array.isRequired,
};

ProductTabPanelList.defaultProps = {
  productList: [],
};

export default ProductTabPanelList;
