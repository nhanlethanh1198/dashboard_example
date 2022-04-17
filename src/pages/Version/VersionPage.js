import {useState, useEffect, useCallback} from 'react';
import Page from 'src/components/Page';
import {useSnackbar} from 'notistack';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import {getVersion, updateVersion} from 'src/api/version';
import {EditVersionDialog} from 'src/components/_dashboard/version';

const VersionPage = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [versionInfo, setVersionInfo] = useState({
    android: '',
    ios: '',
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = useCallback((data) => {
    setOpenDialog(false);
  }, []);

  // Get Version Info
  const getVersionInfo = useCallback(() => {
    getVersion()
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.data;
          setVersionInfo({
            ...data,
          });
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
        enqueueSnackbar('App Version không tải được!', {variant: 'error'});
      });
  }, [enqueueSnackbar]);

  // Handle Submit
  const onSubmit = useCallback(
    (data) => {
      const formData = new URLSearchParams();

      formData.append('android', data.android);
      formData.append('ios', data.ios);
      updateVersion(versionInfo.id, formData)
        .then(() => {
          enqueueSnackbar('Cập nhật thành công', {variant: 'success'});
          setOpenDialog(false);
        })
        .then(() => getVersionInfo())
        .catch((err) => {
          console.error(err.message);
          enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'});
          enqueueSnackbar(err.message, {variant: 'error'});
        });
    },
    [enqueueSnackbar, versionInfo, getVersionInfo]
  );

  useEffect(() => {
    getVersionInfo();
    return () => null;
  }, [getVersionInfo]);

  return (
    <>
      <Page title="Phiên bản">
        <Container>
          <Typography variant="h4" gutterBottom>
            Phiên bản hiện tại
          </Typography>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{minHeight: '50vh'}}
          >
            <Grid item xs={12} md={6}>
            <Card sx={{width: '100%'}}>
                  <CardHeader
                    title={<Typography variant="h4">Phiên bản hiện tại</Typography>}
                    action={
                      <Tooltip title="Chỉnh sửa phiên bản" arrow>
                        <IconButton onClick={() => setOpenDialog(true)}>
                          <ModeEditOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={3}
                      >
                        <Typography variant="h6">Android version:</Typography>
                        <Typography variant="inherit">v{versionInfo.android}</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={3}
                      >
                        <Typography variant="h6">IOS version:</Typography>
                        <Typography variant="inherit">v{versionInfo.ios}</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              {/* <Box sx={{display: 'inline-block'}}>
                
              </Box> */}
            </Grid>
          </Grid>
        </Container>
      </Page>
      <EditVersionDialog
        open={openDialog}
        handleCloseDialog={handleCloseDialog}
        versionInfo={versionInfo}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default VersionPage;
