import PropTypes from 'prop-types';
import {Grid} from '@mui/material';
import {BannerCard} from '.';

const BannerCardList = ({bannerList}) => {
  return (
    <Grid container spacing={3}>
      {bannerList.map((item, index) => (
        <Grid key={index} item xs={12} md={4}>
          <BannerCard item={item} type="show" image={item?.image} />
        </Grid>
      ))}
    </Grid>
  );
};

BannerCardList.propTypes = {
  bannerList: PropTypes.array.isRequired,
};

export default BannerCardList;
