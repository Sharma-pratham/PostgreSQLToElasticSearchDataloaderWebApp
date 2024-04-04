import logo from './logo.svg';
import './App.css';

import PostgresqlSearchQueueWithPagination from './components/postgresqlSearchQueueWithPagination';
import ElasticSeachQueueWithPagination from './components/elasticSeachQueueWithPagination';
import Navbar from './components/navbar'


function App() {
  return (
    <div className="App">
      <main>
        <Navbar/>
        <section>
          <h2>Simple Search with Pagination</h2>
          <PostgresqlSearchQueueWithPagination />
        </section>
        <section>
          <h2>ElasticSearch with Multiple Inputs</h2>
          <ElasticSeachQueueWithPagination />
        </section>
      </main>
    </div>
  );
}

export default App;
