import {useState, useEffect} from 'react'
import api from '../../services/api';
import {Container, Owner, Loading, BackButton, IssuesList, PageAction, FilterList} from './styles';
import {FaArrowLeft} from 'react-icons/fa';

function Repositorio({match}) {

  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState('all');


  useEffect(() => {
    
    async function load(){
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const [ repositorioData, issuesData ] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: status,
            per_page: 5
          }
        })
      ])
      setRepositorio(repositorioData.data);
      setIssues(issuesData.data); 
      setLoading(false);
    }

    load();
  }, [match.params.repositorio])


  useEffect(() => {
    async function loadIssue(){
      const nomeRepo = decodeURIComponent(match.params.repositorio);
      const response =  await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: status,
          page: page,
          per_page: 5,
        },
      });
      setIssues(response.data);
    }

    loadIssue();

  } ,[match.params.repositorio, page, status])

  if(loading){
    return(
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    )
  }


  function handlePage(nav){
    setPage(nav === 'back' ? page -1 : page +1);
  }

  function handleFilter(status){
    setStatus(status);
  }
 

  return (
    <Container>
      <BackButton to="/"><FaArrowLeft color='#000' size={25}/></BackButton>
      <Owner>
        <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login}/>
        <h1>{repositorio.name}</h1>
        <p>{repositorio.description}</p>
        
      </Owner>
      <FilterList>
        <button type='button' disabled={status==='all'} onClick={ () => handleFilter('all')}>Todas</button>
        <button type='button' disabled={status==='open'} onClick={ () => handleFilter('open')}>Abertas</button>
        <button type='button' disabled={status==='closed'} onClick={ () => handleFilter('closed')}>Fechadas</button>
      </FilterList>
      <IssuesList>
        {issues.map(item => (
          <li key={String(item.id)}>
            <img src={item.user.avatar_url} alt={item.user.login}/>
            <div>
              <strong>
                <a href={item.html_url}>{item.title}</a>
                {item.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{item.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>
      <PageAction>
        <button type='button' disabled={page <2} onClick={() => handlePage('back')}>Voltar</button>
        <button type='button' onClick={() => handlePage('next')}>Avançar</button>
      </PageAction>

    </Container>
    
  )
}

export default Repositorio