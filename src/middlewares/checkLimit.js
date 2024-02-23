import UserCol from "../model/userCol.js";
import ResponseErr from "../responseError/responseError.js";
import modelConstanta from "../model/modelConstanta.js";
import CustomeValidation from "../validation/custome.js";

const checkLimit = async (req, res, next) => {
  try {
    const val = await CustomeValidation.doubleParameterObjectID({
      productID: req.params.id,
      userID: req.params.id_user,
    });

    const user = await UserCol.findOne({ _id: val.userID });

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
