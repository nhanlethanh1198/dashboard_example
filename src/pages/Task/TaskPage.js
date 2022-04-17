import {useState, useEffect, useCallback} from 'react';
// material
import {
  Card,
  Container,
  Typography,
} from '@mui/material';
// Components
import {TaskTable, TaskFilter} from 'src/components/_dashboard/tasks';
import {useSnackbar} from 'notistack';

import Page from 'src/components/Page';
import {getTaskList} from 'src/api/tasks';

const TaskPage = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});

//  Get Task List
  const getTasks = useCallback(async () => {
    try {
      const {data} = await getTaskList({...pagination});
      setTasks(data.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Không thể tải danh sách công việc, xin mời thử lại!', {variant: 'error'});
    }
    return () => {
    };
  }, [enqueueSnackbar, pagination]);

  useEffect(() => {
    getTasks();
    return () => {
    };
  }, [getTasks]);


  return (
    <Page title={'Danh sách công việc'}>
      <Container maxWidth={'xl'}>
        <Typography variant={'h4'} align={'center'} sx={{mb: 3}}>
          Danh sách công việc
        </Typography>
        <Card>
          <TaskFilter />
          <TaskTable taskList={tasks} pagination={pagination} setPagination={setPagination} />
        </Card>
      </Container>
    </Page>
  );


};


export default TaskPage;