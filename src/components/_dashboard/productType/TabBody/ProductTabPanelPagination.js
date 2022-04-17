import PropTypes from 'prop-types';
import {Pagination} from '@mui/material';

const ProductTabPanelPagination = ({total_page, page, handleChangePage, next_page, prev_page}) => {
  return (
    <Pagination
      color="primary"
      size="large"
      count={total_page}
      defaultPage={1}
      page={page}
      onChange={handleChangePage}
      hidePrevButton={!!next_page}
      hideNextButton={!!prev_page}
      sx={{display: 'flex', justifyContent: 'center', gap: 3, mt: 3}}
    />
  );
};

ProductTabPanelPagination.propTypes = {
  total_page: PropTypes.number,
  page: PropTypes.number,
  handleChangePage: PropTypes.func,
  next_page: PropTypes.number,
  prev_page: PropTypes.number,
};

export default ProductTabPanelPagination;
