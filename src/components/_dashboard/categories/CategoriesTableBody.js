import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Label from 'src/components/Label'
// import { experimentalStyled as styled } from '@mui/material/styles'
import UserMoreMenu from 'src/components/_dashboard/user/UserMoreMenu'

const TableHead = [
  {
    disableColumnMenu: true,
    id: 'id',
    field: 'id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    flex: 0.4,
  },
  {
    disableColumnMenu: true,
    id: 'image',
    field: 'image',
    headerName: 'Ảnh',
    description: 'Ảnh của danh mục',
    editable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    flex: 0.6,
    renderCell: (params) => {
      return (
        <Box sx={{
          width: 90, height: 90,
          display: 'flex',
          justifyContent: 'center',
          alignItem: 'center',
          '& img': {
            marginTop: 1,
            marginBottom: 1,
            borderRadius: 1
          }
        }}>
          <img src={params.row.image} alt={params.row.name} loading='eager' />
        </Box>
      )
    },
  },
  {
    disableColumnMenu: true,
    id: 'name',
    field: 'name',
    headerName: 'Tên danh mục',
    description: 'Tên danh mục này',
    editable: false,
    headerAlign: 'center',
    align: 'center',
    flex: 0.8,
  },
  {
    disableColumnMenu: true,
    id: 'parent_id',
    field: 'parent',
    headerName: 'Danh mục cha',
    description: 'Danh mục cha danh mục này',
    flex: 0.8,
    editable: false,
    headerAlign: 'center', align: 'center',
    renderCell: (params) => {
      const parent_id = params.row.parent_id
      return parent_id === null ? (
        <Box>
          <Typography variant='string'><Label variant='filled' color='error'>
            Lỗi
          </Label></Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant='string'>
            {!parent_id ? 'Không có danh mục.' : parent_id}
          </Typography>
        </Box>
      )
    },
  },
  {
    disableColumnMenu: true,
    id: 'total_products',
    field: 'total_products',
    headerName: 'Sản phẩm',
    description: 'Tổng sản phầm của danh mục này',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
  },
  {
    disableColumnMenu: true,
    id: 'is_active',
    field: 'is_active',
    headerName: 'Trạng thái',
    renderCell: (params) => {
      return (
        <Label variant='ghost' color={params.value ? 'success' : 'error'}>
          {params.value ? 'Đang hoạt động' : 'Đã bị khoá'}
        </Label>
      )
    },
    headerAlign: 'center',
    align: 'center',
    flex: 1,
  },
  {

    disableColumnMenu: true,
    id: 'lock_staff',
    field: 'lock_staff',
    headerName: "",
    sortable: false,
    flex: 0.2,
    renderHeader: (params) => {
      return (
        <></>
      )
    },
    renderCell: (params) => {
      const row = params.row
      return (
        <UserMoreMenu
          id={row.id}
          fullname={row.name}
          is_active={row.is_active}
          type="category"
        />)
    }
  }
]



const CategoriesTableBody = (props) => {
  const [pageSize, setPageSize] = useState(50)
  const [page, setPage] = useState(0)
  const categories = props.categories
  const sortCategory = categories.slice().sort((a, b) => {
    if (a.created_at > b.created_at) return 1
    if (a.created_at < b.created_at) return -1
    return 0
  })

  const [sortModel, setSortModel] = useState([
    {
      field: 'id',
      sort: 'desc',
    },
  ]);



  return (
    <>
      <DataGrid
        sortModel={sortModel}
        sortingOrder={['desc', 'asc', null]}
        onSortModelChange={(model) => setSortModel(model)}
        columns={TableHead}
        rows={sortCategory}
        autoHeight={true}
        disableSelectionOnClick
        headerHeight={70}
        rowHeight={80}
        rowsPerPageOptions={[5, 10, 20, 50]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>

  )
}

export default CategoriesTableBody
