import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Todo } from "../../interfaces/Todo"
import axios from "axios"
import Config from '../../config/config'
import CreateTodoDto from "../../interfaces/CreateTodoDto"
import FilteredTodoDto from "../../interfaces/FilteredTodoDto"

interface TodoState {
    todos: Todo[] | null
    pendingTodos: Todo[] | null
    completedTodos: Todo[] | null
    openTodoLoading:boolean|false,
    completedLoading:boolean|false,
    createdLoading: boolean|false
    loading: boolean | false
    todo:Todo | null
    filterActive:boolean | false
    errors: string[]
}

const initialState: TodoState = {
    todos:[],
    pendingTodos:[],
    completedTodos:[],
    todo: null,
    openTodoLoading:false,
    completedLoading:false,
    createdLoading:false,
    loading:false,
    filterActive:false,
    errors:[]
}

const _config = new Config(import.meta.env)

// action/process to dispatch
export const getTodos = createAsyncThunk<Todo[]>(
    "todo/getList",
    async(_, thunkAPI) => {
        try{
            const response = await axios.get(`${_config.GetAPIURL()}/todo`)
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)
export const getCompletedTodos = createAsyncThunk<Todo[]>(
    "todo/getCompletedList",
    async(_, thunkAPI) => {
        try{
            const response = await axios.get(`${_config.GetAPIURL()}/todo/completed`)
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const getPendingTodos = createAsyncThunk<Todo[]>(
    "todo/getPendingList",
    async(_, thunkAPI) => {
        try{
            const response = await axios.get(`${_config.GetAPIURL()}/todo/pending`)
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const filterTodos = createAsyncThunk<FilteredTodoDto, string>(
    "todo/getFilteredTodoList",
    async(query, thunkAPI) => {
        try{
            const response = await axios.get(`${_config.GetAPIURL()}/todo/filter/${query}`)
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const createNewTodo = createAsyncThunk<Todo, CreateTodoDto>(
    "todo/createTodo",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(`${_config.GetAPIURL()}/todo`, data);

            //thunkAPI.dispatch(getTodos());
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const completeTodoByID = createAsyncThunk<Todo, Todo>(
    "todo/completeTodoByID",
    async(todo, thunkAPI) => {
        try{
            let data = {
                isComplete:true
            }
            const response = await axios.put(`${_config.GetAPIURL()}/todo/${todo._id}`,data)
            
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const deleteTodoByID = createAsyncThunk<Todo, Todo>(
    "todo/deleteTodo",
    async(todo, thunkAPI) => {
        try{
            const response = await axios.delete(`${_config.GetAPIURL()}/todo/${todo._id}`)
            thunkAPI.dispatch(getCompletedTodos());
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const deleteAllTodos = createAsyncThunk<any>(
    "todo/deleteAllTodo",
    async(todo, thunkAPI) => {
        try{
            const response = await axios.delete(`${_config.GetAPIURL()}/todo`)
            thunkAPI.dispatch(getCompletedTodos());
            thunkAPI.dispatch(getPendingTodos());
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

// reducers
export const todoSlice = createSlice({
    name:"todos",
    initialState,
    reducers:{
        setTodos: (state, action: PayloadAction<Todo[]>) => {
            state.todos = action.payload
            state.pendingTodos = action.payload
            state.loading = false
            state.todo = null
        },
        setCompletedTodos: (state, action: PayloadAction<Todo>) => {
            state.completedTodos?.unshift(action.payload)!
            state.pendingTodos?.filter(todo => todo != action.payload)!
            if(state.completedTodos?.length! > 10){
                state.completedTodos?.pop()
            } 
            state.filterActive = false
        },
        setTodo: (state, action: PayloadAction<Todo>) => {
            state.todos = state.todos?.filter(todo => todo._id !== action.payload._id)!
        },
        createTodo: (state, action: PayloadAction<Todo>) => {
            console.log('action', action)
            state.pendingTodos?.push(action.payload)
            if(state.filterActive){

            }
        },
        filteredTodo: (state, action: PayloadAction<FilteredTodoDto>) => {
            state.pendingTodos = action.payload.openTodos!
            state.completedTodos = action.payload.completedTodos!

            state.filterActive = true
            if( !action.payload.completedTodos &&  !action.payload.completedTodos){
                state.filterActive = false
            }
            
        },
    },
    extraReducers: (builder) => {
        //Get Collection
        builder.addCase(getTodos.pending, (state, action) => {
            state.loading = true
        })
        .addCase(getTodos.fulfilled, (state, action) => {
            state.todos = action.payload
            state.pendingTodos = action.payload.filter(todo => !todo.isComplete)
            state.loading = false
            state.filterActive = false
        })
        .addCase(getTodos.rejected, (state) => {
            state.loading = false
        })
        // Get all completed items
        builder.addCase(getCompletedTodos.pending, (state, action) => {
            state.loading = true
        })
        .addCase(getCompletedTodos.fulfilled, (state, action) => {
            state.completedTodos = action.payload
            state.loading = false
            state.filterActive = false
        })
        .addCase(getCompletedTodos.rejected, (state) => {
            state.loading = false
        })
        // Get all pending items
        builder.addCase(getPendingTodos.pending, (state, action) => {
            state.loading = true
        })
        .addCase(getPendingTodos.fulfilled, (state, action) => {
            state.pendingTodos = action.payload
            state.loading = false
        })
        .addCase(getPendingTodos.rejected, (state) => {
            state.loading = false
        })
        // Get Filtered Result
        .addCase(filterTodos.fulfilled, (state, action) => {
            state.filterActive = true
            state.pendingTodos = action.payload.openTodos!
            state.completedTodos = action.payload.completedTodos! 
            state.loading = false
        })
        // Complete Todo
        .addCase(completeTodoByID.fulfilled, (state, action) => {
            state.pendingTodos = state?.pendingTodos!.filter(todo=> todo._id !== action.payload._id)!
            state.completedTodos?.unshift(action.payload)!
            if(state.completedTodos?.length! > 10){
                state.completedTodos?.pop()
            } 
            state.loading = false
        })
     
        //Create Todo
        .addCase(createNewTodo.pending, (state) => {
            state.createdLoading = true
        })
        .addCase(createNewTodo.fulfilled, (state, action) => {
            if(state.filterActive){

            } else {
                state.pendingTodos?.unshift(action.payload)
            }
            
            state.createdLoading = false
        })
        .addCase(createNewTodo.rejected, (state) => {
            state.createdLoading = false
        })


        .addCase(deleteAllTodos.fulfilled, (state) => {
            state = initialState
            // state.todos= []
            // state.pendingTodos = []
            // state.completedTodos = []
            // state.completedLoading = false
            // state.createdLoading = false
        })

        
        

      
        
        
    }
})
export default todoSlice.reducer
export const { setTodos, setCompletedTodos, setTodo, createTodo, filteredTodo } = todoSlice.actions
