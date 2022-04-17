import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Card, CardContent, Button, Stack, Typography, Collapse} from '@mui/material';
import Page from 'src/components/Page';
import Scrollbar from 'src/components/Scrollbar';
import {BannerCardList} from 'src/components/_dashboard/banner';
import {useSnackbar} from 'notistack';
import AddIcon from '@mui/icons-material/Add';
// api
import {getBannerList} from 'src/api/banner';

const BannerPage = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [bannerList, setBannerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getBannerList()
      .then((res) => {
        setBannerList(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        enqueueSnackbar('Không tải được danh sách banner, hãy thử lại!', {variant: 'error'});
      });
    return () => {
      setLoading(false);
    };
  }, [setBannerList, enqueueSnackbar]);

  return (
    <Page title="Banner">
      <Container maxWidth='xl'>
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">Danh sách Banner</Typography>
            <Button onClick={() => navigate('add')} variant="contained" startIcon={<AddIcon />}>
              Thêm Banner mới
            </Button>
          </Stack>
          <Collapse in={!loading} timeout="auto">
            {!bannerList.length ? (
              <Card>
                <CardContent
                  sx={{
                    height: 300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h4">Danh sách Banner trống</Typography>
                </CardContent>
              </Card>
            ) : (
              <Scrollbar sx={{maxHeight: '65vh'}}>
                <BannerCardList bannerList={bannerList} />
              </Scrollbar>
            )}
          </Collapse>
        </Stack>
      </Container>
    </Page>
  );
};

export default BannerPage;
