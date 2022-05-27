module.exports.setflash = (req, res, next) => {
  res.locals.flash = {
    success: req.flash('success'),
    failure: req.flash('failure'),
  };
  next();
};
