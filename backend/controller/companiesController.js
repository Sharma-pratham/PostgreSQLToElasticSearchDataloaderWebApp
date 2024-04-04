const pool = require('../database/postgresqlConnectionPool'); // Adjust the path to where you've defined the pool



const getAllCompanies = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Ensure page is an integer
    const limit = 10; // Set a fixed limit or make it dynamic based on request
    const offset = (page - 1) * limit;
    
    console.log('in getALLCompanies')

    try {
        // Query to fetch paginated results from the view
        const queryText = `
            SELECT
                company_name,
                contact_name,
                company_country,
                contact_country,
                technology_names,
                contact_title
            FROM pratham.company_contacts_view
            LIMIT $1 OFFSET $2`;

        // Query to get the total count of rows in the view
        const countQuery = `SELECT COUNT(*) FROM pratham.company_contacts_view`;

        // Execute both queries; consider using Promise.all for parallel execution if possible
        const countResult = await pool.query(countQuery);
        const totalRows = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalRows / limit);

        pool.query(queryText, [limit, offset], (error, results) => {
            if (error) {
                console.log('in error')
                throw error;
            }

            res.status(200).json({
                data: results.rows,
                totalPages: totalPages,
            });
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {getAllCompanies}