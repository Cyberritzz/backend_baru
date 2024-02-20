import UserCol from "../model/userCol.js";

const checkLimit = async (req, res, next) => {
  const id_user = req.params.id_user
  const limit = await UserCol.findOne({ _id:id_user });

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
