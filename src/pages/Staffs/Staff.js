import {filter} from 'lodash';
import {Icon} from '@iconify/react';
import {useState, useEffect} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import {Link as RouterLink} from 'react-router-dom';
// material
import {Card, Stack, Button, Container, Typography, CardActions, TablePagination} from '@mui/material';
// components
import Page from 'src/components/Page';
import Scrollbar from 'src/components/Scrollbar';
import {UserListToolbar} from 'src/components/_dashboard/user';
import StaffListBody from 'src/components/_dashboard/staff/StaffListBody';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {getStaffListAPI} from 'src/api/staff';
import {useSnackbar} from 'notistack';
// ----------------------------------------------------------------------

function applySortFilter(array, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (query) {
    return filter(
      array,
      (_staff) => _staff.fullname.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Staff() {
  const [filterName, setFilterName] = useState('');
  const {setStaffList} = useStoreActions((actions) => actions.staff);
  const {staffList} = useStoreState((state) => state.staff);
  const {render} = useStoreState((state) => state.render);
  const {enqueueSnackbar} = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);

  useEffect(() => {
    Promise.all([getStaffListAPI()])
      .then((result) => {
        setStaffList(result[0].data.data);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Tải danh sách nhân viên thất bại, mời thử lại!', {variant: 'error'});
      });
    return () => {};
    // eslint-disable-next-line
  }, [render]);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredUsers = applySortFilter(staffList, filterName);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Page title="Nhân viên">
        <Container maxWidth={'xl'}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Danh sách nhân viên
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="add_staff"
              startIcon={<Icon icon={plusFill} />}
            >
              Tạo nhân viên
            </Button>
          </Stack>
          <Card>
            <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />
            <Scrollbar>
              <StaffListBody staffList={filteredUsers} />
            </Scrollbar>
            <CardActions sx={{justifyContent: 'flex-end'}}>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={filteredUsers?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardActions>
          </Card>
        </Container>
      </Page>
    </>
  );
}
