import './App.css'
import './styles/custom.scss'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import TodoListPage from './features/todos/TodoListPage' 

import NavBar from './component/header/NavBar'
import Container from '@mui/material/Container';

import SocketServer from 'socket.io-client'

import { useEffect, useRef } from 'react'

function App() {
  //const socketClient = useRef<Socket>()
  const websocket = "http://localhost:3001"
  useEffect( ()=>{
    SocketServer(websocket)
  },[])

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
