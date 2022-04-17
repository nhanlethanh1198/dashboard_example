import {Icon} from '@iconify/react';
import {useRef, useState, useLayoutEffect} from 'react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import {alpha} from '@mui/material/styles';
import {Button, Box, Divider, MenuItem, Typography, Avatar, IconButton} from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
//
// import account from '../../_mocks_/account'

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let staff_info = JSON.parse(window.localStorage.getItem('staff_info'));

  useLayoutEffect(() => {
    if (!staff_info?.staff_id) {
      navigate('/login');
    }
  }, [staff_info, navigate]);

  const LogOut = () => {
    window.localStorage.clear();
    navigate('/login');
  };

  const MENU_OPTIONS = [
    {
      label: 'Trang chủ',
      icon: homeFill,
      linkTo: '/',
    },
    {
      label: 'Thông tin tài khoản',
      icon: personFill,
      linkTo: `staff/update-staff-info/${staff_info?.staff_id}`,
    },
    {
      label: 'Cài đặt',
      icon: settings2Fill,
      linkTo: '#',
    },
  ];

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar src={staff_info?.avartar_image} alt="photoURL" imgProps={{loading: 'eager'}} />
      </IconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{width: 220}}>
        <Box sx={{my: 1.5, px: 2.5}}>
          <Typography variant="subtitle1" noWrap>
            {staff_info?.fullname}
          </Typography>
          <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
            {staff_info?.email}
          </Typography>
        </Box>

        <Divider sx={{my: 1}} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{typography: 'body2', py: 1, px: 2.5}}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24,
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{p: 2, pt: 1.5}}>
          <Button onClick={() => LogOut()} fullWidth color="inherit" variant="outlined">
            Đăng xuất
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
