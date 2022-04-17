import Page from 'src/components/Page';
import {Button, Container, Stack, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom';
import {Collapse} from '@mui/material';
import {ComboList} from 'src/components/_dashboard/combo';
import {getListCombo} from 'src/api/combo';
import {useEffect, useState} from 'react';
import {useSnackbar} from 'notistack';

const ComboPage = () => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [comboList, setComboList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListCombo()
      .then((res) => {
        if (res.status === 200) {
          setComboList(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Lỗi không thể tải danh sách combo! Xin thử lại!', {variant: 'error'});
      })
      .finally(() => setLoading(false));

    return () => setLoading(false);
  }, [setComboList, setLoading, enqueueSnackbar]);

  return (
    <Page title="Danh sách combo">
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">Danh sách combo</Typography>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => navigate('add', {replace: true})}
            >
              Thêm combo mới
            </Button>
          </Stack>
        </Stack>
        <Stack sx={{mt: 3}}>
          <Collapse in={!loading && !!comboList.length}>
            <ComboList data={comboList} />
          </Collapse>
        </Stack>
      </Container>
    </Page>
  );
};

export default ComboPage;
