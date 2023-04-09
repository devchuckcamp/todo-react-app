import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { Todo } from "../../interfaces/Todo"
import axios from "axios"
import Config from '../../config/config'
import CreateTodoDto from "../../interfaces/CreateTodoDto"
import FilteredTodoDto from "../../interfaces/FilteredTodoDto"
import { RootState } from "../../store/store"

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
    query:string | ""
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
    errors:[],
    query:""
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
        const state = thunkAPI.getState() as RootState;
        try {
            const response = await axios.post(`${_config.GetAPIURL()}/todo`, data);
            if(state.todos.filterActive){

                thunkAPI.dispatch(filterTodos(state.todos.query));
            } else {
                thunkAPI.dispatch(getPendingTodos());
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const completeTodoByID = createAsyncThunk<FilteredTodoDto, Todo>(
    "todo/completeTodoByID",
    async(todo, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        try{
            let data = {
                isComplete:!todo.isComplete
            }
            const response = await axios.put(`${_config.GetAPIURL()}/todo/complete/${todo._id}`,data)
            if(state.todos.filterActive){
                thunkAPI.dispatch(filterTodos(state.todos.query));
            } else {
                thunkAPI.dispatch(filterTodos(""));
            }
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
            const state = thunkAPI.getState() as RootState;
            const response = await axios.delete(`${_config.GetAPIURL()}/todo/${todo._id}`)
            if(state.todos.filterActive){
                thunkAPI.dispatch(filterTodos(state.todos.query));
            } else {
                thunkAPI.dispatch(getCompletedTodos())
            }
           
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
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const toggleFilter = createAsyncThunk<boolean, boolean>(
    "todo/toggleActiveFilter",
    async (data, thunkAPI) => {
       return  true
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
         // Set Query String 
         setSearchQuery: (state, action: PayloadAction<string>) => {
            const updatedQuery = action.payload
            state.query = updatedQuery
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
            state.pendingTodos = action.payload.openTodos!
            state.completedTodos = action.payload.completedTodos! 
            state.query = action.meta.arg!
            state.filterActive = true
            state.loading = false
        })
           
        // Complete Todo
        .addCase(completeTodoByID.fulfilled, (state, action) => {

            state.loading = false
        })
     
        //Create Todo
        .addCase(createNewTodo.pending, (state) => {
            state.createdLoading = true
        })
        .addCase(createNewTodo.fulfilled, (state, action) => {
            console.log(current(state).query)
            if(!state.filterActive){
                state.pendingTodos?.unshift(action.payload)
                state.pendingTodos?.sort((a, b) => (a.name > b.name) ? 1 : -1)
            } else {
                filterTodos(current(state).query)
            }
            
            state.createdLoading = false
        })
        .addCase(createNewTodo.rejected, (state) => {
            state.createdLoading = false
        })


        .addCase(deleteAllTodos.fulfilled, (state) => {
            state.completedTodos = []
            state.pendingTodos = []
            state.filterActive = false
            state.todo = null
            state.todos = []
            state.loading = false
            state.completedLoading = false
            state.openTodoLoading = false
            state = initialState
        })
    }
})
export default todoSlice.reducer
export const { setTodos, setCompletedTodos, setTodo, setSearchQuery } = todoSlice.actions
