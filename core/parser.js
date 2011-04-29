IoEngine.Parser = function (){};
IoEngine.Parser.prototype.parse = function (body){
  //print(body)
  this.body = body.replace(/(\r?\n)/mg, '');
  return this.compile();
};
IoEngine.Parser.prototype.compile = function (){
  while(this.term());
  var expr = this.expression();
  if(expr == undefined){
    return undefined;
  }
  var ret = [expr];
  while(this.term()){
    expr = this.expression();
    if(!expr){
      break;
    }
    ret.push(expr);
  }
  return ret;
};

IoEngine.Parser.prototype.term = function (){
  if(this.body.match(/^[ \t]*(\r?\n|;)/)) {
    this.body = RegExp.rightContext;
    return RegExp.$1;
  }
  return undefined;
};
IoEngine.Parser.prototype.expression = function (){
  var x, y;
  x = this.message();
  if(x == undefined){
    return undefined;
  }

  var ret = [x];
  while (this.body.match(/^[ \t]*(.+)/)) {
    var prebody = this.body;
    this.body = RegExp.$1;
    y = this.message();
    if(!y){
      this.body = prebody;
      break;
    }
    ret.push(y);
  }
  return new IoEngine.Node.Message('message', ret);
};
IoEngine.Parser.prototype.message = function (){
  var x;
  x = this.symbol();
  if(x != undefined){
    return x;
  }
  x = this.arguments();
  if(x != undefined){
    return new IoEngine.Node.Message('argMessage', [x]);
  }
  return undefined;
};
IoEngine.Parser.prototype.symbol = function (){
  var x;
  x = this.number();
  if(x != undefined){
    return x;
  }
  x = this.identifier();
  if(x != undefined){
    return x;
  }
  x = this.operator();
  if(x != undefined){
    return x;
  }
  x = this.quote();
  if(x != undefined){
    return x;
  }
  return undefined;
};
IoEngine.Parser.prototype.number = function (){
  if(this.body.match(/^[ \t]*(\d+)/)){
    this.body = RegExp.rightContext;
    return new IoEngine.Node.Number(RegExp.$1);
  }
  return undefined;
};
IoEngine.Parser.prototype.identifier = function (){
  if(this.body.match(/^[ \t]*(\w+)/)){
    this.body = RegExp.rightContext;
    return new IoEngine.Node.Identifier(RegExp.$1);
  }
  return undefined;
};
IoEngine.Parser.prototype.operator = function (){
  if(this.body.match(/^[ \t]*((\*|\/|\+|\-|\%|\=|\-|\:)+)/)){
    this.body = RegExp.rightContext;
    return new IoEngine.Node.Operator(RegExp.$1);
  }
  return undefined;
};
IoEngine.Parser.prototype.quote = function (){
  if(this.body.match(/^[ \t]*('([^']+)')/)){
    this.body = RegExp.rightContext;
    return new IoEngine.Node.Quote(RegExp.$1);
  }
  if(this.body.match(/^[ \t]*("([^"]+)")/)){
    this.body = RegExp.rightContext;
    return new IoEngine.Node.Quote(RegExp.$1);
  }
  if(this.body.match(/^[ \t]*("""([^(""")]+)""")/mg)){
    this.body = RegExp.rightContext;
    return new IoEngine.Node.Quote(RegExp.$1);
  }
  return undefined;
};
IoEngine.Parser.prototype.arguments = function (){
  if(this.body.match(/^[ \t]*(\()/)){
    var args = [];
    var openBlock = RegExp.rightContext;
    this.body = openBlock;
    var r = this.expression();
    if(r != undefined){
      args.push(r);
    }
    if(this.body.match(/^[ \t]*,/)){
      this.body = RegExp.rightContext;
      r = this.expression();
      args.push(r);
    }
    if(this.body.match(/^[ \t]*(\))/)){
      this.body = RegExp.rightContext;
    }
    return new IoEngine.Node.Arguments(args);
  }
  var x = this.symbol();
  if(x != undefined){
    return new IoEngine.Node.Arguments([x]);
  }
  return undefined;
};
