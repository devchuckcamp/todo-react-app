import { Todo } from "../interfaces/Todo"
import { useAppDispatch, useAppSelector } from "../store/store"
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {  useCallback, useEffect } from "react"
import { getCompletedTodos, deleteTodoByID } from '../features/todos/todoSlice'
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab } from "@mui/material";



interface Column {
    id: 'task' | 'status'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}

const columns: readonly Column[] = [
    { id: 'status', label: '', minWidth: 10, },
    { id: 'task', label: 'Completed', minWidth: 100 },
];


const TodoListCompleteTable: React.FC = () => {
    const { completedTodos, completedLoading } = useAppSelector(state => state.todos)
    const dispatch = useAppDispatch()
    const initTodos = useCallback(async () => {
        await dispatch(getCompletedTodos())
    }, [dispatch])

    const onDeleteTodo = (event: React.MouseEvent<HTMLButtonElement>, todo: Todo) => {
        event.preventDefault()
        dispatch(deleteTodoByID(todo))
    }
    useEffect(() => {
        initTodos()
    }, [])
    return (

        <Grid item xs={12} md={6} xl={6}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }} className="bs-none">
                <TableContainer sx={{ maxHeight: 840 }} className="bs-none">
                    <Table stickyHeader aria-label="sticky table" className="bs-none">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {completedLoading ?
                                <TableRow >
                                    <TableCell align="center">Fetching Item</TableCell>
                                </TableRow>
                                :
                                !completedLoading && completedTodos?.length ?
                                    completedTodos
                                        .map((todo: Todo) =>

                                            <TableRow hover tabIndex={-1} key={`completed-${todo._id}`}>
                                                <TableCell>{todo.name} </TableCell>
                                                <TableCell>
                                                    <Fab size="small" color="error" onClick={(event => onDeleteTodo(event, todo))}  aria-label="Delete Task"><DeleteIcon/></Fab>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    :
                                    <TableRow >
                                        <TableCell align="center">No Item</TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Grid>

    )
}
export default TodoListCompleteTable