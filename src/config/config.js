import dotenv from 'dotenv'
dotenv.config()

//development
const config = {
    MAX_AGE_REFRESH_TOKEN: '15m',
    MAX_AGE_ACCESS_TOKEN: '5m',
    ACCESS_TOKEN: 'himsi',
    REFRESH_TOKEN: 'himsi1',
    MONGO_URI: 'mongodb://localhost:27017/test',
    PORT: 3000
}

//production
// const config = {
//     MAX_AGE_REFRESH_TOKEN: process.env.MAX_AGE_REFRESH_TOKEN,
//     MAX_AGE_ACCESS_TOKEN: process.env.MAX_AGE_ACCESS_TOKEN,
//     ACCESS_TOKEN: process.env.ACCESS_TOKEN,
//     REFRESH_TOKEN: process.env.REFRESH_TOKEN,
//     MONGO_URI: process.env.MONGO_URI,
//     PORT: process.env.PORT
// }

export default config