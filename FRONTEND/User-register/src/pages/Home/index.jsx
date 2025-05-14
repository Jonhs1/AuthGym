import { useState, useRef, useEffect } from 'react'
import Thrash from '../assets/icons8-lixo.svg'
import './style.css'
import api from '../../services/api'

function Home() {

  const [user, setUser] = useState([])

  const inputName = useRef()
  const inputEmail = useRef()
  const inputSenha = useRef()

  async function getUser(){
    const response = await api.get('/users')
    setUser(response.data)

  }

  async function createUser(){
    await api.post('/users', {
      name: inputName.current.value,
      email: inputEmail.current.value,
      password: inputSenha.current.value

    })
    
      getUser()

  }

  async function deleteUser(email){

    await api.delete(`/users/${email}`)

    getUser()
  }

  useEffect(() => {

    getUser()

  }, [])


  return (
      <div className='container'>
        <form>
            <h1>Cadastro de Usuários</h1>
            <input type="text" placeholder='Nome' name='Nome' ref={inputName}/>
            <input type="email" placeholder='Email' name='Email' ref={inputEmail}/>
            <input type="password" placeholder='Senha' name='Senha' ref={inputSenha}/>
            <button type='button' onClick={createUser}>Cadastrar</button>
        </form>

        {user.map((user) => 
      <div key={user.id} className='card'> 
        <div>
          <p>Nome: <span>{user.name}</span></p>
          <p>Email: <span>{user.email}</span></p>
          <p>Senha: <span>{user.password}</span></p>
        </div>
        <button onClick={() => deleteUser(user.id)}>
            <img src={Thrash} width="30px" height="30px"/>
        </button>
      </div>
      )}

      </div>
  )
}

export default Home
