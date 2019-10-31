function validate (ctx, next) {
  if (!ctx.cookies.get("LoginStatus") && ctx.url!="/login") {
    console.log('validate--redirect---')
    ctx.redirect('/login')
  }
  return next()
}
exports.validate = validate