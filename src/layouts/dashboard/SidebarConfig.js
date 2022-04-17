import {Icon} from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import cubeFill from '@iconify/icons-eva/cube-fill';
// import fileTextFill from '@iconify/icons-eva/file-text-fill';
// import lockFill from '@iconify/icons-eva/lock-fill';
// import personAddFill from '@iconify/icons-eva/person-add-fill';
// import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import personFill from '@iconify/icons-eva/person-fill';
import shoppingCartFill from '@iconify/icons-eva/shopping-cart-fill';
import calendarFill from '@iconify/icons-eva/calendar-fill';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import fastFood from '@iconify/icons-ion/fast-food';
import imageFill from '@iconify/icons-eva/image-fill';
import buildingFactory20Filled from '@iconify/icons-fluent/building-factory-20-filled';
import optionsOutline from '@iconify/icons-eva/options-outline';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Trang chủ',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'Công việc',
    path: '/dashboard/tasks',
    icon: getIcon(calendarFill),
  },
  {
    title: 'Khách hàng',
    path: '/dashboard/user',
    icon: getIcon(peopleFill),
  },
  {
    title: 'Đơn hàng',
    path: '/dashboard/order',
    icon: getIcon(shoppingCartFill),
  },
  {
    title: 'Combo',
    path: '/dashboard/combo',
    icon: getIcon(fastFood),
  },
  {
    title: 'Mã huyến mãi',
    path: '/dashboard/promotions',
    icon: <LoyaltyIcon />,
  },
  {
    title: 'Banner',
    path: '/dashboard/banners',
    icon: getIcon(imageFill),
  },
  {
    title: 'Nhân viên',
    path: '/dashboard/staff',
    icon: getIcon(personFill),
  },
  {
    title: 'Sản phẩm',
    icon: getIcon(shoppingBagFill),
    children: [
      {
        title: 'Danh sách sản phẩm',
        path: '/dashboard/products',
      },
      {
        title: 'Phân loại sản phẩm',
        path: '/dashboard/product_types',
      },
    ],
  },
  {
    title: 'Danh mục sản phầm',
    path: '/dashboard/categories',
    icon: getIcon(cubeFill),
  },
  {
    title: 'Nhà cung cấp',
    path: '/dashboard/stores',
    icon: getIcon(buildingFactory20Filled),
  },
  {
    title: 'Phiên bản',
    path: '/dashboard/version',
    icon: getIcon(optionsOutline),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon(fileTextFill)
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon(personAddFill)
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon(alertTriangleFill)
  // }
];

export default sidebarConfig;
