import PropTypes from 'prop-types';
import {
  useEffect,
  // useState
} from 'react';
import {Link as RouterLink, useLocation} from 'react-router-dom';
// material
import {experimentalStyled as styled} from '@mui/material/styles';
import {
  Box,
  Link,
  // Button,
  // Stack,
  Drawer,
  Typography,
  Avatar,
  // Tooltip,
} from '@mui/material';
// import AppleIcon from '@mui/icons-material/Apple';
// import AndroidIcon from '@mui/icons-material/Android';

// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import {MHidden} from '../../components/@material-extend';
//
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';

// import {getVersion} from 'src/api/version';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({isOpenSidebar, onCloseSidebar}) {
  const {pathname} = useLocation();
  let staff_info = JSON.parse(window.localStorage.getItem('staff_info'));
  // const [appVersion, setAppVersion] = useState({
  //   android: '',
  //   ios: '',
  // });

  // const getAppVersion = async () => {
  //   const {
  //     data: {data},
  //   } = await getVersion();
  //   setAppVersion({
  //     android: data.android,
  //     ios: data.ios,
  //   });
  // };

  useEffect(() => {
    // getAppVersion();
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    return () => null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {height: '100%', display: 'flex', flexDirection: 'column'},
      }}
    >
      <Box sx={{px: 2.5, py: 2}}>
        <Box component={RouterLink} to="/" sx={{display: 'inline-flex'}}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{mb: 5, mx: 2.5}}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={staff_info?.avartar_image} alt="photoURL" imgProps={{loading: 'eager'}} />
            <Box sx={{ml: 2}}>
              <Typography variant="subtitle2" sx={{color: 'text.primary'}}>
                {staff_info?.fullname}
              </Typography>
              <Typography variant="body2" sx={{color: 'text.secondary'}}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{flexGrow: 1}} />
      {/* 
      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'grey.200'
          }}
        >
          <Box
            component="img"
            src="/static/illustrations/illustration_rocket.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button
            fullWidth
            href="https://material-ui.com/store/items/minimal-dashboard/"
            target="_blank"
            variant="contained"
          >
            Upgrade to Pro
          </Button>
        </Stack>
      </Box> */}
      {/* <Box sx={{flexGrow: 0.08}}>
        <Stack
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          direction="row"
          sx={{pl: 4}}
        >
          <Tooltip title={`Android version: v${appVersion.android}`}>
            <Typography variant="subtitle2" sx={{color: 'grey.400'}}>
              <AppleIcon fontSize="small" sx={{fontSize: '0.8rem'}} />

              <Typography component="span" sx={{fontSize: '0.8rem'}}>
                v{appVersion.ios}
              </Typography>
            </Typography>
          </Tooltip>
          <Tooltip title={`iOS version: v${appVersion.ios}`}>
            <Typography variant="subtitle2" sx={{color: 'grey.400'}}>
              <AndroidIcon fontSize="small" sx={{fontSize: '0.8rem'}} />{' '}
              <Typography component="span" sx={{fontSize: '0.8rem'}}>
                v{appVersion.ios}
              </Typography>
            </Typography>
          </Tooltip>
        </Stack>
      </Box> */}
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {width: DRAWER_WIDTH},
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
