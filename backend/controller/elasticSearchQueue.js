const elasticClient = require('../database/elasticConnectionClient');

const searchWithMatch = async (searchTerm, page = 1, size = 10) => {
  const intsize = 10;
  const from = (page - 1) * size; // Calculate the "from" parameter based on the page number and size

  try {
    console.log('brfore hitting response')
    const response = await elasticClient.search({
      index: 'company_contacts',
      body: {
        query: { match_all: {} }
      }
    });
    
    console.log('got the response')
    console.log(response)
    // Calculate the total number of pages
    const totalPages = Math.ceil(response.hits.total.value / 10);
    console.log(totalPages)
    return {
      hits: response.hits.hits, // The search results
      total: response.hits.total.value, // Total number of documents matching the query
      totalPages: totalPages, // Total number of pages
      page: page, // Current page
      size: intsize // Number of results per page
    };
  } catch (error) {
    console.log('print before error')
    console.error('Multi-match search with pagination failed:', error.message);
    throw error; // Or handle it as needed
  }
};


const searchWithFuzzy = async (req, res) => {
  const { companyName = "", contactName = "", technologies = "" } = req.query;

  try {
    const response = await elasticClient.search({
      index: 'company_contacts',
      body: {
        query: {
          bool: {
            should: [
              companyName && {
                match: { company_name: { query: companyName, fuzziness: "AUTO" } }
              },
              contactName && {
                match: { contact_name: { query: contactName, fuzziness: "AUTO" } }
              },
              technologies && {
                match: { technology_names: { query: technologies, fuzziness: "AUTO" } }
              }
            ].filter(Boolean),
            minimum_should_match: 1
          }
        }
      }
    });
    res.json(response.body); // Directly return the response body from Elasticsearch
  } catch (error) {
    console.error('Search failed:', error.message); // Log simplified error message
    res.status(500).json({ message: 'Search failed' });
  }
};


module.exports = { searchWithMatch,searchWithFuzzy };
