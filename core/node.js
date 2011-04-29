IoEngine.Node = function (type){
  this.type = type;
};
IoEngine.Node.prototype.toString = function (){
  return 'Node({type:' + this.type + ', source={' + this.toSource() + '}})';
};
IoEngine.Node.prototype.toSource = function (){};
IoEngine.Node.prototype.dump = function (output){
  output(this._dump(''));
};
IoEngine.Node.prototype._dump = function (indent){};
IoEngine.Node.prototype.visit = function (interpreter, runtime, context){
  throw new Error('nosuch visit node: ' + node);
};

IoEngine.Node.Message = function (message, children){
  this.message = message;
  this.children = children;
};
IoEngine.Node.Message.prototype = new IoEngine.Node('Message');
IoEngine.Node.Message.prototype.toSource = function (){
  return 'message=' + this.message + ', children=' + this.children;
};
IoEngine.Node.Message.prototype._dump = function(indent){
  var buf = [];
  buf.push(indent + '<message>\n');
  for(var i = 0; i < this.children.length; ++i){
    buf.push(indent + ' <child>\n');
    buf.push(this.children[i]._dump(indent + '  ') + '\n');
    buf.push(indent + ' </child>\n');
  }
  buf.push(indent + '</message>');
  return buf.join('');
};
IoEngine.Node.Message.prototype.visit = function (interpreter, runtime, context){
  return interpreter.executeMessage(this, runtime, context);
};

IoEngine.Node.Number = function (number){
  this.number = number;
};
IoEngine.Node.Number.prototype = new IoEngine.Node('Number');
IoEngine.Node.Number.prototype.toSource = function (){
  return 'num=' + this.number;
};
IoEngine.Node.Number.prototype._dump = function (indent){
  return indent + '<number>' + this.number + '</number>';
};
IoEngine.Node.Number.prototype.visit = function (interpreter, runtime, context){
  return interpreter.executeNumber(this, runtime, context);
};

IoEngine.Node.Identifier = function (identifier){
  this.identifier = identifier;
};
IoEngine.Node.Identifier.prototype = new IoEngine.Node('Identifier');
IoEngine.Node.Identifier.prototype.toSource = function (){
  return 'identifier=' + this.identifier;
};
IoEngine.Node.Identifier.prototype._dump = function (indent){
  return indent + '<identifier>' + this.identifier + '</identifier>';
};
IoEngine.Node.Identifier.prototype.visit = function (interpreter, runtime, context){
  return interpreter.executeIdentifier(this, runtime, context);
};

IoEngine.Node.Operator = function (operator){
  this.operator = operator;
};
IoEngine.Node.Operator.prototype = new IoEngine.Node('Operator');
IoEngine.Node.Operator.prototype.toSource = function (){
  return 'operator=' + this.operator;
};
IoEngine.Node.Operator.prototype._dump = function (indent){
  return indent + '<operator>' + this.operator + '</operator>';
};
IoEngine.Node.Operator.prototype.visit = function (interpreter, runtime, context){
  return interpreter.executeOperator(this, runtime, context);
};

IoEngine.Node.Quote = function (quote){
  this.quote = quote;
};
IoEngine.Node.Quote.prototype = new IoEngine.Node('Quote');
IoEngine.Node.Quote.prototype.toSource = function (){
  return 'quote=' + this.quote;
};
IoEngine.Node.Quote.prototype._dump = function (indent){
  return indent + '<quote>' + this.quote + '</quote>';
};
IoEngine.Node.Quote.prototype.visit = function (interpreter, runtime, context){
  return interpreter.executeQuote(this, runtime, context);
};

IoEngine.Node.Arguments = function (args){
  this.args = args;
};
IoEngine.Node.Arguments.prototype = new IoEngine.Node('Arguments');
IoEngine.Node.Arguments.prototype.toSource = function (){
  return 'args=' + this.args;
};
IoEngine.Node.Arguments.prototype._dump = function(indent){
  var buf = [];
  buf.push(indent + '<arguments>\n');
  for(var i = 0; i < this.args.length; ++i){
    buf.push(indent + ' <arg>\n');
    buf.push(this.args[i]._dump(indent + '  ') + '\n');
    buf.push(indent + ' </arg>\n');
  }
  buf.push(indent + '</arguments>');
  return buf.join('');
};
IoEngine.Node.Arguments.prototype.visit = function (interpreter, runtime, context){
  return interpreter.executeArguments(this, runtime, context);
};

IoEngine.Node.Eol = function (){
  // ignore
};
IoEngine.Node.Eol.prototype = new IoEngine.Node('Eol');
IoEngine.Node.Eol.prototype.toSource = function (){
  return '<<EOL>>';
};
IoEngine.Node.Eol.prototype._dump = function (indent){
  return indent + '<<EOL>>';
};
IoEngine.Node.Eol.prototype.visit = function (interpreter, runtime, context){
  return interpreter.executeEol(this, runtime, context);
};
