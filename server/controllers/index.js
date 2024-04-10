
export const homeController = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;

  try {
    res.render("login.njk", {
      layout: "base.njk",
    });
  } catch (err) {
    let data = {
      error: { message: err },
      layout: "base.njk",
    };
    res.render("login.njk", data);
    next();
  } finally {
  }
};