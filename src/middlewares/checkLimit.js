import UserCol from "../model/userCol.js";
import ResponseErr from "../responseError/responseError.js";
import modelConstanta from "../model/modelConstanta.js";

const checkLimit = async (req, res, next) => {
  try {
    const id_user = req.params.id_user;
    const user = await UserCol.findOne({ _id: id_user });

    if (!user) {
      throw new ResponseErr(401, "Unauthorized");
    }

    if (
      user.is_membership === modelConstanta.isMembership.free &&
      user.limit === 0
    ) {
      throw new ResponseErr(403, "Limit reached");
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default checkLimit;
