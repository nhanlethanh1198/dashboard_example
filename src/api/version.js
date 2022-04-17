import {instance, instanceApplication} from './instance';

const getVersion = async () => await instance.get('/versions/get-version');

const updateVersion = async (version_id, data) =>
  await instanceApplication.put(`/versions/update-version/${version_id}`, data);

export {getVersion, updateVersion};
