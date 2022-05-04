const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;

  return context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } }, // This is a nested write: https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/relation-queries#nested-writes
    },
  });
}

async function updateLink(_, args, context, __) {
  const { id, description, url } = args;

  return context.prisma.link.update({
    where: { id: +id },
    data: {
      description,
      url,
    },
  });
}

async function deleteLink(_, args, context, __) {
  return context.prisma.link.delete({
    where: { id: +args.id },
  });
}

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
};
