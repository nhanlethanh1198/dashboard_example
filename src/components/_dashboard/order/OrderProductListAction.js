import {useRef, useState} from 'react';
import {IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Box} from '@mui/material';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import {Icon} from '@iconify/react';
import {Link as RouterLink} from 'react-router-dom';
import OrderEditProductQuantity from './OrderEditProductQuantity';

const OrderProductListAction = ({data, pListLength, deleteProduct, setProductCount}) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {minWidth: 200, maxWidth: '100%', py: 0},
        }}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <MenuItem
          component={RouterLink}
          sx={{color: 'info.main', p: 0}}
          to={`../../../products/update_product/${data?.code}`}
        >
          <ListItem>
            <ListItemIcon sx={{justifyContent: 'center'}}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              primary="Thông tin sản phẩm"
              primaryTypographyProps={{variant: 'body2'}}
            />
          </ListItem>
        </MenuItem>
        {pListLength > 1 && (
          <MenuItem
            component={Box}
            sx={{color: 'error.main', p: 0}}
            onClick={() => deleteProduct(data?.id)}
          >
            <ListItem>
              <ListItemIcon sx={{justifyContent: 'center'}}>
                <CancelIcon />
              </ListItemIcon>
              <ListItemText primary="Xóa sản phẩm" primaryTypographyProps={{variant: 'body2'}} />
            </ListItem>
          </MenuItem>
        )}
        <MenuItem
          component={Box}
          sx={{color: 'warning.main', p: 0}}
          onClick={() => {
            setShowDialog(true);
            setIsOpen(false);
          }}
        >
          <ListItem>
            <ListItemIcon sx={{justifyContent: 'center'}}>
              <ModeEditOutlineRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Chỉnh sửa số lượng"
              primaryTypographyProps={{variant: 'body2'}}
            />
          </ListItem>
        </MenuItem>
      </Menu>

      <OrderEditProductQuantity
        data={data}
        setProductCount={setProductCount}
        open={showDialog}
        handleClose={() => setShowDialog(false)}
        message={{
          title: `Chỉnh sửa số lượng sản phẩm "${data.product_name}"!`,
        }}
      />
    </>
  );
};

export default OrderProductListAction;
