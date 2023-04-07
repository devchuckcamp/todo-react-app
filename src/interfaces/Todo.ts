export interface Todo {
    _id?:string
    name:string
    isComplete:boolean
    updatedAt?:Date
    createdAt?:Date
}

export default Todo