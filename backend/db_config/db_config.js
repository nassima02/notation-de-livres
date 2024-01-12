const PASSWORD = "";
const USER = "";

if (!PASSWORD) {
	console.log("*****************************");
	console.log("* Database password not set *");
	console.log("*****************************");
}

if (!USER) {
	console.log("*****************************");
	console.log("* Database user not set     *");
	console.log("*****************************");
}

const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.eiaz3mk.mongodb.net/?retryWrites=true&w=majority`;

const dbConfig = {
	DB_URL: DB_URL
};

module.exports = dbConfig;
