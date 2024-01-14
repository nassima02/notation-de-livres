
const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;

const dbConfig = {
	DB_URL: DB_URL
};

module.exports = dbConfig;
