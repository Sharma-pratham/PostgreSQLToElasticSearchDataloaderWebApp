import React, { useState } from 'react';

function ElasticsearchSearch() {
  const [searchParams, setSearchParams] = useState({
    companyName: '',
    contactName: '',
    technologies: ''
  });
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearchType, setLastSearchType] = useState(null); // Keep track of the last search type

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const fetchData = async (searchType) => {
    setIsLoading(true);
    setError('');
    setLastSearchType(searchType); // Remember the last search type
    try {
      const query = new URLSearchParams({
        ...searchParams,
        page: currentPage,
        limit: 10, // Assuming 10 results per page
      }).toString();
      // Choose the API URL based on the search type
      const apiUrl =
        searchType === 'fuzzy'
          ? 'http://localhost:4000/api/elastic/fuzzySearch/'
          : 'http://localhost:4000/api/elastic/search/';
      const response = await fetch(`${apiUrl}?${query}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data.hits);
      setTotalPages(Math.ceil(data.totalPages / 10));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Fetch data with the current search type when page changes
    if (lastSearchType) {
      fetchData(lastSearchType);
    }
  };

  
const performMatchPhraseSearch = () => fetchData('match_phrase');
const performFuzzySearch = () => fetchData('fuzzy');
  return (
    <div>
      <input
        type="text"
        name="companyName"
        value={searchParams.companyName}
        onChange={handleInputChange}
        placeholder="Company Name"
      />
      <input
        type="text"
        name="contactName"
        value={searchParams.contactName}
        onChange={handleInputChange}
        placeholder="Contact Name"
      />
      <input
        type="text"
        name="technologies"
        value={searchParams.technologies}
        onChange={handleInputChange}
        placeholder="Technologies"
      />
      <button onClick={() => performMatchPhraseSearch()} disabled={isLoading}>
        Match Phrase Search
      </button>
      <button onClick={() => performFuzzySearch()} disabled={isLoading}>
        Fuzzy Search
      </button>
      {error && <div className="error-message">{error}</div>}
      <table className="results-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Contact Name</th>
            <th>Company Country</th>
            <th>Contact Country</th>
            <th>Technologies</th>
            <th>Contact Title</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result._source.company_name}</td>
              <td>{result._source.contact_name}</td>
              <td>{result._source.company_country}</td>
              <td>{result._source.contact_country}</td>
              <td>{result._source.technology_names?.join(', ')}</td>
              <td>{result._source.contact_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ElasticsearchSearch;


