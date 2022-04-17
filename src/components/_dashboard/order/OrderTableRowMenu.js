import { useRef, useState } from 'react'
import { IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill'
import InfoIcon from '@mui/icons-material/Info';
import { Icon } from '@iconify/react'
import { Link as RouterLink } from 'react-router-dom'


const OrderTableRowMenu = ({ data }) => {
    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false)

    // const onClick = (e) => {
    //     console.log(e)
    // }

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Icon icon={moreVerticalFill} width={20} height={20} />
            </IconButton>
            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' }
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    component={RouterLink}
                    to={`order-info/${data.order_id}`}
                    sx={{ color: 'info.main' }}
                    // onClick={onClick}
                >
                    <ListItem>
                        <ListItemText
                            primary='Thông tin chi tiết'
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItemIcon sx={{ justifyContent: 'center' }}>
                        <InfoIcon />
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </>
    )
}

export default OrderTableRowMenu;