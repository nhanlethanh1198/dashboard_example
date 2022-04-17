import * as y from 'yup';

const FILE_SIZE = 20971520;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const AddProductSchema = y.object().shape({
  name: y.string().required('Tên sản phẩm là bắt buộc!'),
  category_id: y
    .number()
    .typeError('Bạn phải nhập số vào trường này.')
    .required('Hãy chọn danh mục cho sản phẩm!'),
  belong_to_store: y.number().required('Hãy chọn nhà cung cấp cho sản phẩm này!'),
  location: y.number().test(
    'default',
    'Hãy chọn khu vực cho sản phẩm này',
    number => number !== 0,
  ),
  unit: y.string().required('Hãy chọn đơn vị cân nặng!'),
  weight: y.number().typeError('Cân nặng phải là số.').required('Hãy đặt khối lượng cho sản phẩm!'),
  stock: y.number().typeError('Tồn kho phải là số.').required('Hãy đặt số lượng tồn của sản phẩm!'),
  price: y.number().typeError('Giá tiền phải là số.').required('Hãy đặt giá cho sản phẩm'),
  sale_price: y.number().typeError('Bạn phải nhập số vào trường này.'),
  description: y.string(),
  note: y.string(),
  tag: y.string(),
  brand: y.string(),
  guide: y.string(),
  preserve: y.string(),
  make_in: y.string(),
  make_by: y.string(),
  day_to_shipping: y.string(),
  avatar_img: y
    .mixed()
    .test('file', 'Ảnh đại diện là bắt buộc!', async (value) => {
      const file = await value[0];
      return Boolean(file)
    })
    .test('fileSize', 'Kích thước ảnh đại diện quá lớn', async (value) => {
      const file = await value[0];
      if (file !== undefined) {
        const size = await file.size;
        console.log(size);
        return (await size) < FILE_SIZE;
      }
    })
    .test('fileType', 'Không đúng định dạng ảnh', async (value) => {
      const file = await value[0];
      if (file !== undefined) {
        const type = file.type;
        return await SUPPORTED_FORMATS.includes(type);
      }
    })
    .required('Hãy chọn ảnh đại diện cho sản phẩm!'),
  // image_1: y
  //   .mixed()
  //   .test('fileSize', 'Kích thước ảnh tải lên quá lớn', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const size = await file.size;
  //       return size < FILE_SIZE;
  //     }
  //   })
  //   .test('fileType', 'Không đúng định dạng ảnh', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const type = file.type;
  //       return await SUPPORTED_FORMATS.includes(type);
  //     }
  //   }),
  // image_2: y
  //   .mixed()
  //   .test('fileSize', 'Kích thước ảnh tải lên quá lớn', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const size = await file.size;
  //       return size < FILE_SIZE;
  //     }
  //   })
  //   .test('fileType', 'Không đúng định dạng ảnh', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const type = file.type;
  //       return await SUPPORTED_FORMATS.includes(type);
  //     }
  //   }),
  // image_3: y
  //   .mixed()
  //   .test('fileSize', 'Kích thước ảnh tải lên quá lớn', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const size = await file.size;
  //       return size < FILE_SIZE;
  //     }
  //   })
  //   .test('fileType', 'Không đúng định dạng ảnh', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const type = file.type;
  //       return await SUPPORTED_FORMATS.includes(type);
  //     }
  //   }),
  // image_4: y
  //   .mixed()
  //   .test('fileSize', 'Kích thước ảnh tải lên quá lớn', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const size = await file.size;
  //       return size < FILE_SIZE;
  //     }
  //   })
  //   .test('fileType', 'Không đúng định dạng ảnh', async (value) => {
  //     const file = await value[0];
  //     if (file !== undefined) {
  //       const type = file.type;
  //       return await SUPPORTED_FORMATS.includes(type);
  //     }
  //   }),
});

export default AddProductSchema;
