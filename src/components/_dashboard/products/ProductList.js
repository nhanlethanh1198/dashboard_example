import PropTypes from 'prop-types';
// material
import { Grid, LinearProgress, Box } from '@mui/material';
import ShopProductCard from './views/ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProductList({ products, ...other }) {
  if (products.length > 0) {
    return (
      <Grid container spacing={3} {...other}>
        {products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={3}>
            <ShopProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    );
  } else {
    return <Box sx={{ width: '100%' }}>
      <LinearProgress color='inherit' sx={{height: '5px'}} />
    </Box>
  }
}
