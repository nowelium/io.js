var IoEngine = function (){};
IoEngine.Utils = {};
IoEngine.Utils.reduceArray = function (list){
  if(!list){
    return [];
  }

  var result = [];
  for(var i = 0; i < list.length; ++i){
    result.push(list[i]);
  }
  return result;
};
IoEngine.Utils.bindFunction = function(func, target){
  return function (){
    return func.apply(target, arguments);
  };
};
IoEngine.Utils.curryFunction = function(func, args){
  var __method__ = func;
  return function (){
    for(var i = 0; i < arguments.length; ++i){
      args.push(arguments[i]);
    }
    return __method__.apply(this, args);
  }
};

load('core/runtime.js');
load('core/node.js');
load('core/parser.js');
load('core/scope.js');
load('core/interpreter.js');
