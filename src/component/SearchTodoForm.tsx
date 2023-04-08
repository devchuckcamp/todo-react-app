import { useAppDispatch } from "../store/store"
import Grid from '@mui/material/Grid';
import { useState, useCallback, useEffect } from "react"
import { filterTodos, getCompletedTodos, getPendingTodos, getTodos } from '../features/todos/todoSlice'
import Box from "@mui/material/Box";
import React from 'react';
import { TextField } from "@mui/material";
import Stack from '@mui/material/Stack';

const SearchTodoForm: React.FC = () => {
    const dispatch = useAppDispatch()
    const [query, setQuery] = useState("")
    const [filterActiive, setfilterActiive] = useState(false)
    const searchTodo = (event: React.KeyboardEvent<HTMLDivElement>) => {
        let val = (event.target as HTMLInputElement).value
        console.log('refreshList', refreshList)
        setQuery(val)
        if(val.length>=3){
            setfilterActiive(true)
            searchQuery(val)
        }
        if(val === ""){
            setfilterActiive(false)
            refreshList()
        }
    }
    const searchQuery = useCallback(async (query:string) => {
        console.log(query)
        await dispatch(filterTodos(query))
    }, [])

    const refreshList = useCallback(async () => {
        console.log('refresh')
        await dispatch(getPendingTodos())
        await dispatch(getCompletedTodos())
    }, [])


    return (
        <Box sx={{ flexGrow: 1, marginY: 1, marginX:1 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} md={4} xl={4}>
                <TextField
                    hiddenLabel
                    id="search-todo-field"
                    defaultValue={query}
                    placeholder="Search Item"
                    variant="filled"
                    size="small"
                    onKeyUp={(e) => {
                        searchTodo(e)
                      }}
                />
                 <Stack spacing={2} direction="row">
                </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}
export default SearchTodoForm