import PropTypes from 'prop-types';
import {Grid} from '@mui/material';
import {PromotionCard} from '.';

const PromotionBody = ({col, promotionsData, spacing}) => {
  return (
    <Grid container spacing={!!spacing ? spacing : 3}>
      {promotionsData.map((item, index) => (
        <PromotionCard key={index} col={!!col ? col : 4} data={item} image={item.image} type='show' />
      ))}
    </Grid>
  );
};

PromotionBody.propTypes = {
  col: PropTypes.number.isRequired,
  spacing: PropTypes.number.isRequired,
  promotionsData: PropTypes.array.isRequired,
};

export default PromotionBody;
