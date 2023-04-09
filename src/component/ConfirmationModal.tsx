import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ButtonGroup } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../store/store';
import { deleteAllTodos } from '../features/todos/todoSlice';
import { useCallback } from 'react';
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const ConfirmationModal: React.FC = () => {
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const dispatch = useAppDispatch()
    const onDeleteAllTodo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        deleteAllTodo()
    }
    const deleteAllTodo = useCallback(async () => {
        await dispatch(deleteAllTodos())
        setOpen(false)
    }, [dispatch])

    return (
        <div>
            <Button variant="outlined" color="error" onClick={handleOpen}>Delete All</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure you want to delete all items?
                    </Typography> 
                        <ButtonGroup sx={{ width:'100%', justifyContent:'space-around' }} variant="outlined" aria-label="outlined primary button group">
                            <Button color="error" onClick={(e)=>onDeleteAllTodo(e)}>Yes</Button>
                            <Button color="primary"onClick={handleClose} >No</Button>
                        </ButtonGroup>
                    

                </Box>
            </Modal>
        </div>
    );
}

export default ConfirmationModal