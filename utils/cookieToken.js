const cookieToken = (user, res) => {
  const token = user.getJwtToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(201).cookie("token", token, cookieOptions).json({
    status: "success",
    token,
    user,
  });
};

module.exports = cookieToken;
