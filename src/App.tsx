import './App.css'
import './styles/custom.scss'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import TodoListPage from './features/todos/TodoListPage' 

import NavBar from './component/header/NavBar'
import Container from '@mui/material/Container';

function App() {

  return (
   <BrowserRouter>
      <NavBar/>
      <Container>
      <Routes>
        <Route path="/" element={<TodoListPage/>}/>
      </Routes>
      </Container>
   </BrowserRouter>
  )
}

export default App
