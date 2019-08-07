const { ApolloServer, gql } = require("apollo-server");
const { MongoMemoryServer } = require("mongodb-memory-server");
const getMongoConnection = require("./getMongoConnection");

// don't require a separate mongodb instance to run
new MongoMemoryServer({ instance: { port: 27017 } });

// this API is just an example, you can modify any parts if needed for the task
const typeDefs = gql`
    type Event {
        note: Int
        startTime: Int
        endTime: Int
    }

    input EventInput {
        note: Int
        startTime: Int
        endTime: Int
    }

    type Song {
        _id: ID!
        title: String
        duration: Int
        events: [Event]
    }

    type Query {
        songs: [Song]
    }

    type Mutation {
        addSong(title: String, events: [EventInput], duration: Int): Song
    }
`;

const resolvers = {
    Query: {
        songs: async () => {
            const mongodb = await getMongoConnection();
            return mongodb
                .collection("songs")
                .find({})
                .toArray();
        },
    },
    Mutation: {
        addSong: async (_, { title, events, duration }) => {
            const mongodb = await getMongoConnection();
            try {
                const response = await mongodb.collection("songs").insertOne({ title, events, duration });
                return mongodb.collection("songs").findOne({ _id: response.insertedId });
            } catch (e) {
                console.error(e);
                throw e;
            }
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`GraphQL server running: ${url}`);
});
