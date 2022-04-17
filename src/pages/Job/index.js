import { filter } from 'lodash';

import { useState, useEffect } from 'react';

// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';

// components
import Page from 'src/components/Page';
import Label from 'src/components/Label';
import Scrollbar from 'src/components/Scrollbar';
import SearchNotFound from 'src/components/SearchNotFound';
import {
  JobListHead,
  JobListToolbar,
  JobMoreMenu,
} from 'src/components/_dashboard/job';

import axios from 'axios';

import moment from 'moment';

import numeral from 'numeral';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'job_id', label: '#', alignRight: false },
  { id: 'type_job', label: 'Loại', alignRight: false },
  { id: 'phone', label: 'Số điện thoại', alignRight: false },
  { id: 'address', label: 'Địa chỉ', alignRight: false },
  { id: 'time', label: 'Thời gian làm việc', alignRight: false },
  { id: 'price', label: 'Phí', alignRight: false },
  { id: 'date_created', label: 'Ngày tạo', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.fullname.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function statusJob(status) {
  switch (status) {
    case 1:
      return {
        color: 'success',
        message: 'Chưa có người làm',
      };
    case 2:
      return {
        color: 'success',
        message: 'Đã chọn người làm',
      };
    case 4:
      return {
        color: 'error',
        message: 'Đã huỷ',
      };
    default:
      return {
        color: 'error',
        message: 'Đã huỷ',
      };
  }
}

export default function Job() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobs, setJob] = useState([]);

  let access_token = window.localStorage.getItem('access_token');
  const getJobs = () => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
    });
    return instance.get('tasks/staff-get-list-task');
  };

  useEffect(() => {
    let mounted = true;
    let result = getJobs()
      .then((list) => {
        if (mounted) {
          setJob(list.data.data);
        }
        return true;
      })
      .catch((error) => {
        return false;
      });
    if (result) {
      return () => (mounted = false);
    }
    // eslint-disable-next-line
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = jobs.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobs.length) : 0;

  const filteredJobs = applySortFilter(
    jobs,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredJobs.length === 0;

  return (
    <Page title='Công việc'>
      <Container maxWidth={'xl'}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
        </Stack>

        <Card>
          <JobListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <JobListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={jobs.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredJobs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        fullname,
                        address,
                        status,
                        phone,
                        created_at,
                        type_task,
                        total_price,
                        start_time,
                        end_time,
                        start_date,
                      } = row;
                      const isItemSelected = selected.indexOf(fullname) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role='checkbox'
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell align='left'>{id}</TableCell>
                          <TableCell align='left'>{type_task}</TableCell>
                          <TableCell align='left'>{phone}</TableCell>
                          <TableCell align='left'>{address}</TableCell>
                          <TableCell align='left'>
                            {start_time} - {end_time},{' '}
                            {moment(start_date).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell align='left'>
                            {numeral(total_price * 1000).format('0,0')}
                          </TableCell>
                          <TableCell align='left'>
                            {moment(created_at).format('hh:mm:ss, DD/MM/YYYY')}
                          </TableCell>
                          <TableCell align='left'>
                            <Label
                              variant='ghost'
                              color={statusJob(status).color}
                            >
                              {/* {sentenceCase(status)} */}
                              {statusJob(status).message}
                            </Label>
                          </TableCell>

                          <TableCell align='right'>
                            <JobMoreMenu />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align='center' colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={jobs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
