import {Client, TablesDB, ID, Query} from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const TABLE_ID = "6a9278430027d34927ff"


const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
    //uses appwrite sdk to see if the searchTerm already exists in the db, if it does, update the count
    //else, create a new document with the searchTerm and count as 1

    try {
        const result = await database.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.equal('searchTerm', searchTerm),
            ]
        })

        if (result.rows.length > 0) {        // if exists in db
            const row = result.rows[0];

            await database.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: row.$id,
                data: {
                    count: row.count + 1,
                }
            })
        } else {                                  // else
            await database.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            })
        }
    }
    catch(err){
        console.log(err);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.limit(5),
                Query.orderDesc("count")
            ]
        })

        return result.rows;
    } catch (error) {
        console.error(error);
        return [];
    }
}