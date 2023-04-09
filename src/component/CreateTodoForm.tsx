import { useAppDispatch, useAppSelector } from "../store/store"
import Grid from '@mui/material/Grid';
import { useState, useCallback, useEffect, useRef } from "react"
import { createNewTodo, filterTodos, getPendingTodos } from '../features/todos/todoSlice'
import Box from "@mui/material/Box";
import React from 'react';
import { ButtonGroup, TextField } from "@mui/material";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CreateTodoDto from "../interfaces/CreateTodoDto";
import { current } from "@reduxjs/toolkit";

interface InputChangeInterface {
    target: HTMLInputElement;
  }



const CreateTodoForm: React.FC = () => {
    const [todoName, setTodoName] = useState("");
    
    const dispatch = useAppDispatch()
    let { createdLoading, filterActive, query } = useAppSelector(state => state.todos)


    const addTodo =  (event: React.MouseEvent<any>) => {
        event.preventDefault();
        let obj:CreateTodoDto = {
            name:todoName
        }
        handleCreateTodo(obj)
    }
    const onInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        let val = (event.target as HTMLInputElement).value
        setTodoName(val)
       
    }
  
    const handleCreateTodo = useCallback(async (obj:CreateTodoDto) => {
        await dispatch(createNewTodo(obj))
        
        //refreshList()
        setTodoName("")
    }, [dispatch])

    // const refreshList =  useCallback(async () => {
    //     console.log('filterActive', filterActive)
    //     console.log('query', query)
    //     await dispatch(filterTodos(query))
    // }, [dispatch])


    return (
        <Box sx={{ flexGrow: 1, marginY: 1, marginX:1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} xl={6}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <TextField
                    hiddenLabel
                    id="create-todo-field"
                    value={todoName}
                    placeholder="Task Name"
                    variant="filled"
                    size="small"
                    onInput={onInput}
                />
                 <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={addTodo} disabled={createdLoading}>Add</Button>
                </Stack>
                </ButtonGroup>
                </Grid>
            </Grid>
        </Box>
    )
}
export default CreateTodoForm