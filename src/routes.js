import {Navigate, useRoutes} from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
//User
import User from './pages/User/User';
import UserInfo from './pages/User/UserInfo';
import DashboardApp from './pages/DashboardApp';
//Products
// import Products from './pages/Products/Products';
// import AddProduct from './pages/Products/AddProduct';
// import UpdateProduct from './pages/Products/UpdateProduct';
import {
  Products,
  //  AddProduct,
  AddProductDemo,
  // UpdateProduct,
  UpdateProductDemo,
  ProductTypesPage,
} from './pages/Products';
//Staff
import {Staff, AddStaff, UpdateStaff} from './pages/Staffs';
// Order
import Order from 'src/pages/Order/Order';
import OrderInfo from 'src/pages/Order/OrderInfo';
// promotions
import {Promotions, AddPromotion, UpdatePromotion} from 'src/pages/Promotions';
// Combo
import {ComboPage, CreateComboPage, EditComboPage} from 'src/pages/ComboPage';
// Banner
import {BannerPage, AddBannerPage, UpdateBannerPage} from 'src/pages/Banner';
// Category Page
import {Categories, AddCategory, UpdateCategory} from './pages/Categories';
// Provider
import {AddStorePage, UpdateStorePage, StoresPage} from 'src/pages/Stores';
// Task
import {TaskPage} from 'src/pages/Task';

// Job
// import Job from 'src/pages/Job';

import NotFound from './pages/Page404';


import {VersionPage} from './pages/Version';

// Redux Store
import ProductStore from 'src/localmodal/ProductStore';
// import ProductFormStore from 'src/localmodal/ProductFormStore';
import OrderStore from 'src/localmodal/OrderStore';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        {element: <Navigate to="/dashboard/app" replace />},
        {path: 'app', element: <DashboardApp />},
        // // Job
        // {path: 'job', element: <Job />},
        // Task
        {path: 'tasks', element: <TaskPage />},

        // Order
        {path: 'order', element: <Order />},
        {
          path: 'order/order-info/:id',
          element: (
            <OrderStore.Provider>
              <OrderInfo />
            </OrderStore.Provider>
          ),
        },
        // Promotions
        {path: 'promotions', element: <Promotions />},
        {path: 'promotions/add', element: <AddPromotion />},
        {path: 'promotions/update/:id', element: <UpdatePromotion />},
        // Combo
        {path: 'combo', element: <ComboPage />},
        {path: 'combo/add', element: <CreateComboPage />},
        {path: 'combo/update/:id', element: <EditComboPage />},
        // Banner
        {
          path: 'banners',
          element: <BannerPage />,
        },
        {
          path: 'banners/add',
          element: <AddBannerPage />,
        },
        {
          path: 'banners/update/:id',
          element: <UpdateBannerPage />,
        },
        // Staffs
        {path: 'staff', element: <Staff />},
        {path: 'staff/add_staff', element: <AddStaff />},
        {path: 'staff/update-staff-info/:staff_id', element: <UpdateStaff />},
        // Users
        {path: 'user', element: <User />},
        {path: 'user/user-info/:id', element: <UserInfo />},
        // Product
        {
          path: 'products',
          element: (
            <ProductStore.Provider>
              <Products />
            </ProductStore.Provider>
          ),
        },
        {
          path: 'products/add_product',
          element: <AddProductDemo />,
        },
        {
          path: 'products/update_product/:code',
          element: <UpdateProductDemo />,
        },
        {
          path: 'product_types',
          element: <ProductTypesPage />,
        },
        // Categories
        {path: 'categories', element: <Categories />},
        {path: 'categories/add_category', element: <AddCategory />},
        {
          path: 'categories/update-category/:category_id',
          element: <UpdateCategory />,
        },
        // Store Page
        {path: 'stores', element: <StoresPage />},
        {path: 'stores/add_store', element: <AddStorePage />},
        {path: 'stores/update_store/:id', element: <UpdateStorePage />},

        // Version Page
        {path: 'version', element: <VersionPage />},
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        {path: 'login', element: <Login />},
        {path: 'register', element: <Register />},
        {path: '404', element: <NotFound />},
        {
          // path: '/',
          element: <Navigate to="/dashboard" replace />,
        },
        {path: '*', element: <Navigate to="/404" />},
      ],
    },

    {path: '*', element: <Navigate to="/404" replace />},
  ]);
}
