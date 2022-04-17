import {Grid} from '@mui/material';
import {ComboCard} from '.';

const ComboList = ({data, spacing}) => {
  return (
    <Grid container spacing={spacing || 3}>
      {data?.map((item, index) => (
        <ComboCard
          key={index}
          type="show"
          col={3}
          data={item}
          image={item?.image}
          comboPrice={item.comboPrice}
        />
      ))}
    </Grid>
  );
};

export default ComboList;
