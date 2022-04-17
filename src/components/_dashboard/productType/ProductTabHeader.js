import {Tabs, Tab} from '@mui/material';
import productTabType from 'src/constants/productTabType';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ProductTabHeader = ({tabIndex, onChangeTabIndex}) => {
  return (
    <Tabs value={tabIndex} onChange={onChangeTabIndex} centered sx={{gap: 3}}>
      {productTabType.map((item) => (
        <Tab key={item.label} label={item.label} {...a11yProps(tabIndex)} />
      ))}
    </Tabs>
  );
};

export default ProductTabHeader;
