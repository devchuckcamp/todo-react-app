import  TodoListPendingTable  from '../../component/TodoPendingList'
import  TodoListCompleteTable  from '../../component/TodoCompleteList'
import Box from "@mui/material/Box"
import Grid from '@mui/material/Grid';
import CreateTodoForm from '../../component/CreateTodoForm';
import SearchTodoForm from '../../component/SearchTodoForm';
import { ButtonGroup, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { useCallback } from 'react';
import { useAppDispatch } from '../../store/store';
import { deleteAllTodos } from '../../features/todos/todoSlice'
import ConfirmationModal from '../../component/ConfirmationModal';

const TodoListPage: React.FC = () => {
    const dispatch = useAppDispatch()
    // const onDeleteAllTodo = (event: React.MouseEvent<HTMLInputElement>) => {
    //     event.preventDefault()
    //     deleteAllTodo()

    // }

    const onDeleteAllTodo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        deleteAllTodo()
    }
    const deleteAllTodo = useCallback(async () => {
        await dispatch(deleteAllTodos())
    }, [dispatch])
    
    return (
        <>
        <Box sx={{ flexGrow: 1, marginTop: 3 }}>
            <Grid container spacing={2} justifyContent="flex-end">
                <ConfirmationModal/>
            </Grid>
            <Grid container spacing={2}>
                <CreateTodoForm/>
                <SearchTodoForm/>
            </Grid>
            <Grid container spacing={2}>
                <TodoListPendingTable/>
                <TodoListCompleteTable/>
            </Grid>
        </Box>
        </>
    )

}
export default TodoListPage