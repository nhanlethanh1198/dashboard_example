import { instance } from './instance';

const getListStaff = async () =>
  await instance.get(`tasks/staff-get-list-staff`);

export { getListStaff };
