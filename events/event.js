module.exports = function compile(template) {
  var evalExpr = /<%=(.+?)%>/g;
  var expr = /<%([\s\S]+?)%>/g;

  template = template
    .replace(evalExpr, '`); \n echo( $1 ); \n echo(`')
    .replace(expr, '`); \n $1 \n echo(`');
}
