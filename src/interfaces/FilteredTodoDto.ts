import Todo from './Todo'

export interface FilteredTodoDto{
    completedTodos:Todo[],
    openTodos:Todo[]
}

export default FilteredTodoDto