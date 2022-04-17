import {instance} from './instance';

export const getTaskList = async ({...params}) => await instance.get('/tasks/staff-get-list-task', {
  params: {
    ...params,
  },
});