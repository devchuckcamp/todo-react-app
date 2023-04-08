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
import { useCallback, useEffect } from "react"
import { getPendingTodos, completeTodoByID } from '../features/todos/todoSlice'
import Checkbox from '@mui/material/Checkbox';

import  React from 'react';



interface Column {
    id: 'status' | 'open'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}

const columns: readonly Column[] = [
    { id: 'status', label: '', minWidth: 10, },
    { id: 'open', label: 'Open', minWidth: 100 },
];


const TodoListPendingTable: React.FC = () => {
    const { pendingTodos, openTodoLoading } = useAppSelector(state => state.todos)
    const dispatch = useAppDispatch()
    const initPendingTodos = useCallback(async () => {
        await dispatch(getPendingTodos())
    }, [dispatch])
   
    const onTodoComplete = (event: React.ChangeEvent<HTMLInputElement>, todo:Todo) => {
        event.preventDefault()
        compelteTodo(todo)
        return true
    }

    const compelteTodo = useCallback(async (todo:Todo) => {
        await dispatch(completeTodoByID(todo))
    }, [dispatch])

    useEffect(() => {
        initPendingTodos()
    }, [])
    return (

        <Grid item xs={12} md={6} xl={6}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }} className="bs-none">
                <TableContainer sx={{ minHeight: 840 }} className="bs-none">
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
                            {openTodoLoading ?
                                <TableRow >
                                    <TableCell align="center">Fetching Item</TableCell>
                                </TableRow>
                                :
                                !openTodoLoading && pendingTodos?.length ?
                                    pendingTodos
                                        .map((todo: Todo) =>

                                            <TableRow hover tabIndex={-1} key={`pending-${todo._id}`}>
                                                <TableCell >
                                                    <Checkbox
                                                        color="primary"
                                                        onChange={(e) => onTodoComplete(e, todo!)}
                                                    />
                                                </TableCell>
                                                <TableCell>{todo.name} </TableCell>
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
export default TodoListPendingTable