// import { filter } from "lodash";
import {useState, useEffect, memo, useCallback} from 'react';
// material
import {Box, Card, Container, Typography, Stack} from '@mui/material';
// components
import Page from '../../components/Page';
import {UserTableBody} from 'src/components/_dashboard/user';
import {getListUser} from 'src/api/user';
import {UserSearchByPhoneNum} from 'src/components/_dashboard/user';
import {useStoreState} from 'easy-peasy';
import {useForm, FormProvider} from 'react-hook-form';
import {useSnackbar} from 'notistack';

// ----------------------------------------------------------------------

const User = memo(() => {
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(0);
  const {enqueueSnackbar} = useSnackbar();
  const {render} = useStoreState((state) => state.render);

  const methods = useForm({
    defaultValues: {
      phone: '',
    },
    mode: 'onChange',
  });

  const getUsers = useCallback(async () => {
    try {
      const {data} = await getListUser({
        page: page + 1,
        limit: pageSize,
      });
      setUsers(data.data);
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Không tải được danh sách người dùng! Mời thử lại! ', {variant: 'error'});
    }
    return () => {
    };
  }, [enqueueSnackbar, page, pageSize]);

  useEffect(() => {
    getUsers();
    return () => {
    };
    //eslint-disable-next-line
  }, [render]);

  const onSubmit = useCallback(async (value) => {
    try {
      const {data} = await getListUser(value);
      setUsers(data.data);
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Không tải được danh sách người dùng! Mời thử lại! ', {variant: 'error'});
    }
    return () => {
    };
  }, [enqueueSnackbar]);


  const onError = (data) => {
    console.error(data);
  };

  return (
    <Page title='Danh sách người dùng'>
      <Container maxWidth={'xl'}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Danh sách người dùng
          </Typography>
        </Stack>

        <Card>
          <FormProvider {...methods}>
            <Box
              component='form'
              onSubmit={methods.handleSubmit(onSubmit, onError)}
            >
              <UserSearchByPhoneNum register={methods.register} />
            </Box>
          </FormProvider>
          <UserTableBody
            userList={users}
            page={page}
            setPage={setPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        </Card>
      </Container>
    </Page>
  );
});

export default User;
