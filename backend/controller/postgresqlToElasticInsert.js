const pool = require('../database/postgresqlConnectionPool'); // Adjust the path to where you've defined the pool

const elasticClient = require('../database/elasticConnectionClient'); // Import the centralized Elasticsearch client


// Endpoint to trigger data transfer
const transferDatafromPgToElastic = async (req, res) => {
  try {
    console.log('goinf to hit db')
    const pgRes = await pool.query('SELECT * FROM pratham.company_contacts_view LIMIT 10');
    console.log('hit db')
    console.log(pgRes)
    console.log('goinf in for loop')
    for (const row of pgRes.rows) {
      await elasticClient.index({
        index: 'company_contacts',
        body: {
          company_name: row.company_name,
          contact_name: row.contact_name,
          company_country: row.company_country,
          contact_country: row.contact_country,
          technology_names: row.technology_names,
          contact_title: row.contact_title
        }
      });
    }
    console.log('out of for loop')
    // Refresh the index to make all operations searchable immediately
    await elasticClient.indices.refresh({ index: 'company_contacts' });
    console.log('es db refreshed')

    res.send('Data transfer completed successfully.');
  } catch (error) {
    console.error('Data transfer failed:', error);
    res.status(500).send('Data transfer failed.');
  }
};

module.exports = {transferDatafromPgToElastic}