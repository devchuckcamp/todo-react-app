import { useAppDispatch, useAppSelector } from "../store/store"
import Grid from '@mui/material/Grid';
import { useState, useCallback, useEffect } from "react"
import {  filterTodos, getCompletedTodos, getPendingTodos, getTodos, setSearchQuery, toggleFilter } from '../features/todos/todoSlice'
import Box from "@mui/material/Box";
import React from 'react';
import { TextField } from "@mui/material";
import Stack from '@mui/material/Stack';

const SearchTodoForm: React.FC = () => {
    const dispatch = useAppDispatch()
    const [searchWord, setSearchWord] = useState("")

    const searchTodo = (event: React.KeyboardEvent<HTMLDivElement>) => {
        let val = (event.target as HTMLInputElement).value

        setSearchWord(val)
        dispatch(setSearchQuery(val))
        if(val.length>=3){
            toggleFilterCB(true)
            searchQuery(val)
        } 
        if(val === ""){
            toggleFilterCB(false)
            refreshList()
        }
    }
    const toggleFilterCB = useCallback(async (active:boolean) => {

        await dispatch(toggleFilter(active))
    }, [])

    const searchQuery = useCallback(async (query:string) => {

        await dispatch(filterTodos(query))

    }, [dispatch])
   

    const refreshList = useCallback(async () => {
      
        await dispatch(getPendingTodos())
        await dispatch(getCompletedTodos())
        
       
    }, [dispatch])


    return (
        <Box sx={{ flexGrow: 1, marginY: 1, marginX:1 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} md={4} xl={4}>
                <TextField
                    hiddenLabel
                    id="search-todo-field"
                    defaultValue={searchWord}
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