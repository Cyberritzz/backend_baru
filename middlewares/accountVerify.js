// const prisma = require("../database");

const accountVerify = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        otp: true,
        email_verified: true,
        contact_verified: true,
      },
    });

    if (user.email_verified || user.contact_verified) {
      next();
      return;
    }

    throw new Error("email verification required");
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export default accountVerify;
