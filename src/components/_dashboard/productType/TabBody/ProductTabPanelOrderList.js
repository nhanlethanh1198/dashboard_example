import PropTypes from 'prop-types';
import {forwardRef, memo} from 'react';
import {Card, IconButton, Stack, Tooltip, Typography, Zoom} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Scrollbar from 'src/components/Scrollbar';
import {styled} from '@mui/material/styles';

// Drag and drop
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

const CustomCard = styled(Card)(({theme}) => ({
  boxShadow: theme.customShadows.z8,
}));

const ProductItem = forwardRef(({product, index}, ref) => (
  <Zoom
    in={!!product?.code}
    unmountOnExit
    style={{transitionDelay: index === 0 ? '0ms' : `${index * 50}ms`}}
    ref={ref}
  >
    <CustomCard sx={{p: 1}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant={'h6'}>
          {`${index + 1}. `}
          {product.name}
          {` (${product.code})`}
        </Typography>
        <Tooltip
          title={'Kéo vào sắp xếp sản phẩm'}
          arrow
          placement="top"
          TransitionComponent={Zoom}
        >
          <IconButton sx={{cursor: 'grab'}} disableRipple>
            <DragHandleIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </CustomCard>
  </Zoom>
));

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

ProductItem.defaultProps = {
  product: {
    name: '',
  },
};

const StackDroppable = forwardRef(({children, ...order}, ref) => (
  <Stack ref={ref} {...order}>
    {children}
  </Stack>
));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ProductTabPanelOrderList = ({productList, setOrderedProductList}) => {
  // handleDrag
  const onDragEnd = (result) => {
    // Drag outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newProductList = reorder(productList, result.source.index, result.destination.index);

    setOrderedProductList(newProductList);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Scrollbar sx={{maxHeight: '60vh'}}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <StackDroppable
              {...provided.droppableProps}
              ref={provided.innerRef}
              spacing={2}
              sx={{m: 2}}
            >
              {productList?.map((product, index) => {
                return (
                  <Draggable key={product.code} draggableId={product.code} index={index}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <ProductItem product={product} index={index} />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </StackDroppable>
          )}
        </Droppable>
      </Scrollbar>
    </DragDropContext>
  );
};

ProductTabPanelOrderList.propTypes = {
  productList: PropTypes.array.isRequired,
  setOrderedProductList: PropTypes.func.isRequired,
};

ProductTabPanelOrderList.defaultProps = {
  productList: [],
};

export default memo(ProductTabPanelOrderList);
