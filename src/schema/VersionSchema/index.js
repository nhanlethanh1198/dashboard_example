import * as y from 'yup';

const VersionSchema = y.object().shape({
  android: y.string().required('Không được để trống Android Version!'),
  ios: y.string().required('Không được để trống iOS Version!'),
});

export default VersionSchema;
