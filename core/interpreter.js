IoEngine.Interpreter = function (){
  this.scope = new IoEngine.Scope();
  this.parser = new IoEngine.Parser();
  this.stdout = '';
  this.stderr = '';
};
IoEngine.Interpreter.prototype.clean = function (){
  this.scope.init();
};
IoEngine.Interpreter.prototype.evaluate = function (runtime, script){
  var context = runtime.io.Message.clone();
  var nodes = this.parser.parse(script);
  nodes.push(new IoEngine.Node.Eol);
  for(var i in nodes){
    this.execute(nodes[i], runtime, context);
  }
  return context.peek();
};
IoEngine.Interpreter.prototype.execute = function (node, runtime, context){
  return node.visit(this, runtime, context);
};
IoEngine.Interpreter.prototype.executeMessage = function (node, runtime, context){
  var message = runtime.io.Message.clone();
  var children = node.children;

  if(!(0 in children)){
    throw new Error('message compile error: ' + node);
  }
  var lastValue = this.execute(children[0], runtime, message);
  message.push(lastValue);

  var nextValue = null;
  for(var i = 1; i < children.length; ++i){
    var nextValue = this.execute(children[i], runtime, message);
    if(Function.prototype.isPrototypeOf(lastValue)){
      lastValue = lastValue(nextValue);
    } else {
      lastValue = nextValue;
    }
    message.push(lastValue);
  }
  context.push(message);
};
IoEngine.Interpreter.prototype.executeNumber = function (node, runtime, context){
  return runtime.io.Number.clone(node.number);
};
IoEngine.Interpreter.prototype.executeIdentifier = function (node, runtime, context){
  var latestObj = context.peek();
  return latestObj.getSlot(node.identifier);
};
IoEngine.Interpreter.prototype.executeOperator = function (node, runtime, context){
  var latestObj = context.peek();
  return latestObj.getSlot(node.operator);
};
IoEngine.Interpreter.prototype.executeQuote = function (node, runtime, context){
  return runtime.io.String.clone(node.quote);
};
IoEngine.Interpreter.prototype.executeArguments = function (node, runtime, context){
  return runtime.io.List.clone(node.args);
};
IoEngine.Interpreter.prototype.executeEol = function (node, runtime, context){
  var args = context.values;

  var latestObj = runtime.io.Nil.clone();
  var argObj = runtime.io.Nil.clone();
  if(IoRuntime.Io.Message.prototype.isPrototypeOf(args[0])){
    var messages = args[0].values;
    var length = messages.length;
    var latestObj = messages[length - 1];
    var argObj = messages[length - 2];
  }
  if(Function.prototype.isPrototypeOf(latestObj)){
    context.push(latestObj(argObj));
  } else {
    context.push(latestObj);
  }
};
