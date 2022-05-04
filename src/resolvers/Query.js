function feed(parent, args, context) {
  return context.prisma.link.findMany();
}

function link(parent, { id }, context) {
  return context.prisma.findUnique({
    where: {
      id,
    },
  });
}

module.exports = {
  feed,
  link,
};
