import React, { useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import {Container, Form, SubmitButton, List, DeleteButton}  from './styles'
import { useState } from 'react';
import api from '../../services/api';
import {Link} from 'react-router-dom'

function Main() {

  const [newRepo, setNewRepo] = useState('');
  const [myRepos, setMyRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //did mount - buscar
  useEffect(()=> {
    const reposStorage = localStorage.getItem('repos');
    if (reposStorage){
      setMyRepos(JSON.parse(reposStorage));
    }
  },[])


  //did update - salvar alteracoes
  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(myRepos));
  }, [myRepos])

  function handleInputChange(e){
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback ((repoName) => {
    const find = myRepos.filter(r => r.name !== repoName)
    setMyRepos(find);
  }, [myRepos])

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    async function submit () {   
      try{
        if(newRepo===''){
          throw new Error('Você precisa indicar um repositório');
        }
        const response = await api.get(`repos/${newRepo}`);
        const hasInRepo = myRepos.find((repo) => repo.name === newRepo);

        if(hasInRepo){
          throw new Error('Repositório duplicado');
        }

        const data = {
          name: response.data.full_name,
        }
        setMyRepos([...myRepos, data]);
        console.log(myRepos);
        setNewRepo('');
      }
      catch (error) {
        setAlert(true);
        console.log(error);
      }
      finally{
        setLoading(false)
      }
        
    }
    submit();
    console.log(myRepos);

  }, [newRepo, myRepos])
  

  return (
    <Container>
      <FaGithub size={25}/>
      <h1>Meus repositórios</h1>
      <Form onSubmit={handleSubmit} error={alert}>
        <input type='text' placeholder='Adicionar repositorios' value={newRepo} onChange={handleInputChange}/>
        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color='#fff' size={14}/>
          ): (
            <FaPlus color='#fff' size={14}/>
          )}
          

        </SubmitButton>


      </Form>

      <List>
        {myRepos.map(item => (
            <li key={item.name}>
              <span>
                <DeleteButton onClick={() => handleDelete(item.name)} >
                  <FaTrash size={15}/>
                </DeleteButton>
                {item.name}</span>
              <Link to={`/repositorio/${ encodeURIComponent(item.name)}`}><FaBars size ={20}/></Link>
            </li>
        ))}
      </List>
    </Container>
  )
}

export default Main 