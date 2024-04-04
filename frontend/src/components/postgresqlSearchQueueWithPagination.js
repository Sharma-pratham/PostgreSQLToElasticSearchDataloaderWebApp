import React, { useState, useEffect } from 'react';


function PaginatedResults() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleStartPage, setVisibleStartPage] = useState(1); // Controls the visible start of pagination
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const limit = 10; // Items per page

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data on currentPage change

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/api/companies/?page=${currentPage}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const goToNextTenPages = () => {
    setVisibleStartPage(prev => Math.min(prev + 10, totalPages));
  };

  const goToPreviousTenPages = () => {
    setVisibleStartPage(prev => Math.max(prev - 10, 1));
  };

  const incrementFivePages = () => {
    setCurrentPage(prev => Math.min(prev + 5, totalPages));
  };

  const decrementFivePages = () => {
    setCurrentPage(prev => Math.max(prev - 5, 1));
  };

  return (
    <div className="results-container">
      <button onClick={fetchData} disabled={isLoading} className="search-button">
        {isLoading ? 'Loading...' : 'Search'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {!error && data.length > 0 && (
        <>
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
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.company_name}</td>
                  <td>{row.contact_name}</td>
                  <td>{row.company_country}</td>
                  <td>{row.contact_country}</td>
                  <td>{Array.isArray(row.technology_names) ? row.technology_names.join(', ') : row.technology_names}</td>
                  <td>{row.contact_title}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {visibleStartPage > 1 && (
              <>
                <button onClick={goToPreviousTenPages} className="nav-btn">Prev 10</button>
                <button onClick={decrementFivePages} className="nav-btn">Prev 5</button>
              </>
            )}
            {Array.from({ length: Math.min(10, totalPages - visibleStartPage + 1) }, (_, i) => (
              <button key={i + visibleStartPage} onClick={() => setCurrentPage(i + visibleStartPage)}
                      className={`page-btn ${currentPage === i + visibleStartPage ? 'active' : ''}`}>
                {i + visibleStartPage}
              </button>
            ))}
            <button onClick={incrementFivePages} className="nav-btn">Next 5</button>
            {totalPages > visibleStartPage + 9 && (
              <>
                
                <button onClick={goToNextTenPages} className="nav-btn">Next 10</button>
              </>
            )}

            
          </div>
        </>
      )}
    </div>
  );
}

export default PaginatedResults;
