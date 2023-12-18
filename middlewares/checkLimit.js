const checkLimit = async (req, res, next) => {
  const limit = await prisma.user.findFirst({
    where: { id: req.params.id_user },
    select: { limit: true, is_membership: true, fullname: true },
  });
  if (limit.is_membership !== "free") {
    return next();
  } else if (limit.limit > 0) {
    return next();
  } else {
    return res.status(403).send({
      message: "limit reached",
    });
  }
};

export default checkLimit;
