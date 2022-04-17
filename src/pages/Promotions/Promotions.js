import {useEffect, useState} from 'react';
import {Container, Typography, Stack, Button} from '@mui/material';
import Page from 'src/components/Page';
import {PromotionBody} from 'src/components/_dashboard/promotions';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom';
import {getAllPromotions} from 'src/api/promotions';
import {useSnackbar} from 'notistack';

const Promotions = (props) => {
  const [promotions, setPromotions] = useState([]);
  const [col] = useState(3);
  const {enqueueSnackbar} = useSnackbar();

  const navigate = useNavigate();

  useEffect(() => {
    // call api here
    Promise.all([getAllPromotions()])
      .then((res) => {
        const promotions = res[0].data.data;
        setPromotions(promotions);
      })
      .catch((error) => {
        enqueueSnackbar('Lỗi mạng, không tải được danh sách mã khuyến mãi', {variant: 'error'});
      });
    // setPromotions();
  }, [setPromotions, enqueueSnackbar]);

  return (
    <Page title="Khuyến mãi">
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" mb={5}>
            Danh sách mã khuyến mãi
          </Typography>
          <Button
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
            size="small"
            onClick={() => navigate('/dashboard/promotions/add', {replace: true})}
            sx={{my: 3}}
          >
            Thêm mã khuyến mãi
          </Button>
        </Stack>
        <PromotionBody promotionsData={promotions} col={col} spacing={4} />
      </Container>
    </Page>
  );
};

export default Promotions;
