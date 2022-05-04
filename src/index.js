const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { ApolloServer, PubSub } = require("apollo-server");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
  introspection: true,
  playground: true,
  // plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
});

const port = process.env.PORT || 3000;

server
  .listen({ port })
  .then(({ url }) => console.log(`Server is running on ${url}`));
