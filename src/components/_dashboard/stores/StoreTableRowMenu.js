import React from 'react';
import {Icon} from '@iconify/react';
import {useRef, useState} from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import {Link as RouterLink} from 'react-router-dom';
import slashOutline from '@iconify/icons-eva/slash-outline';
import checkmarkCircleFill from '@iconify/icons-eva/checkmark-circle-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import {Menu, MenuItem, IconButton, ListItemIcon, ListItemText} from '@mui/material';

// Easy-Peasy
import {useStoreActions} from 'easy-peasy';

// ----------------------------------------------------------------------
const StoreTableRowMenu = (props) => {
  const {id, name, is_active} = {...props};
  const {setDialog, setShowDialog} = useStoreActions((actions) => actions.dialog);
  const {setLockStore} = useStoreActions((actions) => actions.stores);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const clickToLock = () => {
    setLockStore({id, is_active});
    setDialog({
      dialogType: 'lock-store',
      dialogHeader: is_active ? `Cảnh báo khoá nhà cung cấp!` : `Cảnh báo mở khoá nhà cung cấp!`,
      dialogMessage: is_active
        ? `Bạn muốn khoá nhà cung cấp ${name}?`
        : `Bạn muốn mở khoá nhà cung cấp ${name}?`,
    });

    setIsOpen(false);
    setShowDialog(true);
  };

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
          sx: {minWidth: 200, maxWidth: '100%'},
        }}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <MenuItem sx={{color: is_active ? 'error.main' : 'primary.main'}} onClick={clickToLock}>
          <ListItemIcon>
            <Icon icon={is_active ? slashOutline : checkmarkCircleFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={is_active ? 'Khoá nhà cung cấp' : 'Mở khoá nhà cung cấp'}
            primaryTypographyProps={{variant: 'body2'}}
          />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to={`/dashboard/stores/update_store/${id}`}
          sx={{color: 'info.main'}}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={'Chỉnh sửa nhà cung cấp'}
            primaryTypographyProps={{variant: 'body2'}}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default React.memo(StoreTableRowMenu);
