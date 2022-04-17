import { useFieldArray } from 'react-hook-form'
import { Button, Stack } from '@mui/material'
import { experimentalStyled as styled } from '@mui/material/styles';

const InputImageWrapper = styled(Button)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    border: `2px solid ${theme.palette.grey[500_32]}`,
    borderRadius: theme.spacing(1),
    cursor: 'default',
    p: 0,
    input: {
        display: 'none',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    '.custom_image_action': {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
}));


const ImageAdding = ({ control, register, imageList }) => {
    const { fields } = useFieldArray({
        control,
        name: "image_list"
    });

    return (
        <>
            {fields.map((field, index) => {
                return (
                    <Stack key={field.id} sx={{ mr: 3 }}>
                        <InputImageWrapper sx={{ flexDirection: 'column' }}>
                            <input
                                id={`image_list[${index}]`}
                                type='file'
                                className='image_list'
                                {...register(`image_list[${index}]`, {
                                    defaultValue: '',
                                })}
                            />
                            {!!imageList.image_list[index] && (
                                <img
                                    src={imageList.image_list[index]}
                                    alt={`image_list.[${index}]`}
                                />
                            )}
                            <div className='custom_image_action'>
                                <label htmlFor={`image_list[${index}]`}>
                                    <Button
                                        disableRipple
                                        disableFocusRipple
                                        variant='text'
                                        component='span'
                                    >
                                        {!!imageList.image_list[index]
                                            ? 'Thay đổi ảnh'
                                            : 'Thêm ảnh'}
                                    </Button>
                                </label>
                            </div>
                        </InputImageWrapper>
                    </Stack>
                );
            })}
        </>
    )
}

export default ImageAdding