import {useEffect, useLayoutEffect} from 'react';
import {useTheme} from '@mui/material/styles';
import {get} from 'lodash'
import {Avatar, Box, Chip, CircularProgress, MenuItem, OutlinedInput, Select, Stack,} from '@mui/material';
import {getListCategory} from 'src/api/categories';
import {useStoreActions, useStoreState} from 'easy-peasy';
import ProductFormStore from 'src/localmodal/ProductFormStore';
import {useSnackbar} from "notistack";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultipleSelectChip({idlist}) {
    const theme = useTheme();
    const {categories} = useStoreState((state) => state.categories);
    const {setListCategory} = useStoreActions((actions) => actions.categories);
    const {setCategoryList} = ProductFormStore.useStoreActions(
        (actions) => actions
    );
    const {categoryList} = ProductFormStore.useStoreState((state) => state);
    const {enqueueSnackbar} = useSnackbar()
    // setCategoryList(filterCategory)
    useEffect(() => {
        const getCategory = () => {
            if (categories.length === 0) {
                Promise.all([getListCategory()])
                    .then((res) => {
                        const data = get(res[0], 'data.data', [])
                        setListCategory(data);
                    })
                    .catch((error) => {
                        console.error(error);
                        enqueueSnackbar('Lỗi! Không tải được danh sách danh mục! Hãy thử lại!', {variant: 'error'})
                    });
            }
        };
        getCategory();
        return () => null;
        // eslint-disable-next-line
    }, []);

    useLayoutEffect(() => {
        if (!!idlist) {
            try {
                const filterList = categories.filter(i => {
                    if (Array.isArray(idlist)) {
                        return idlist.includes(i.id)
                    } else {
                        return i.id === idlist
                    }
                })
                setCategoryList(filterList)
            } catch (err) {
                console.error('Error while init categoryID')
            }
        }
        // eslint-disable-next-line
    }, [idlist, categories])


    const handleChange = (event) => {
        setCategoryList(event.target.value);
    };

    const handleDelete = (chipToDelete) => () => {
        const temp = categoryList.filter((chip) => chip.id !== chipToDelete.id);
        setCategoryList(temp);
    };

    if (categories.length > 0) {
        return (
            <Select
                labelId='select_categories'
                id='demo-multiple-chip'
                multiple
                defaultValue={categoryList}
                value={categoryList}
                onChange={handleChange}
                autoWidth
                input={<OutlinedInput/>}
                sx={{minWidth: 500, maxWidth: 700}}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', padding: '3px'}}>
                        {selected.map((value) => {
                            return (
                                <Chip
                                    sx={{p: '3px'}}
                                    onMouseDown={(event) => {
                                        event.stopPropagation();
                                    }}
                                    clickable
                                    onDelete={handleDelete(value)}
                                    avatar={
                                        <Avatar
                                            imgProps={{loading: 'eager'}}
                                            sx={{width: 10, height: 10}}
                                            alt={value.name}
                                            src={value.image}
                                        />
                                    }
                                    key={value.id}
                                    label={value.name}
                                />
                            );
                        })}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {categories.map((category) => (
                    <MenuItem
                        key={category.id}
                        value={category}
                        style={getStyles(category.name, categoryList, theme)}
                    >
                        <Avatar
                            imgProps={{loading: 'eager'}}
                            src={category.image}
                            alt={category.name}
                            sx={{width: 25, height: 25, mr: 2}}
                        />{' '}
                        {category.name}
                    </MenuItem>
                ))}
            </Select>
        );
    }

    return (
        <Stack sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            <CircularProgress/>
        </Stack>
    );
}
