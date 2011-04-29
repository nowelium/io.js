IoEngine.Runtime = function (text, stdout, stderr){
  this.text = text;
  this.stdout = stdout;
  this.stderr = stderr;
  this.io = new IoRuntime.Io(stdout, stderr);
  this.interpreter = new IoEngine.Interpreter();
};
IoEngine.Runtime.prototype.run = function (){
  try {
    var result = this.interpreter.evaluate(this, this.text);
    print(result);
    this.stdout(result);
  } catch(e){
    this.stderr(e.message);
  } finally {
    this.interpreter.clean();
  }
};

var IoRuntime = function (){};
IoRuntime.Io = function (stdout, stderr){
  this.init();
  this.initRuntime(stdout, stderr);
};
IoRuntime.Io.prototype.init = function (){
  this.slots = {};
  var root = IoRuntime.Io;
  for(var slot in root){
    if(root[slot].prototype){
      this[slot] = new root[slot];
    }
  }
};
IoRuntime.Io.prototype.initRuntime = function (stdout, stderr){
  IoRuntime.Io.Object.prototype.callActive = function (){
    this.setSlot('print', function(obj){
      return String(obj);
    });
    this.setSlot('println', function(obj){
      return String(obj) + '\n';
    });
  };
};
IoRuntime.Io.create = function (parent, properties){
  var next = function (){
    return this.init.apply(this, arguments);
  };
  if(parent){
    if(!parent.prototype.init){
      // todo
    }
    var $super = new parent;
    next.prototype = $super;
    next.prototype.$super = $super;
  }

  for(var property in properties){
    next.prototype[property] = properties[property];
  }
  if(!next.prototype.init){
    next.prototype.init = function (){};
  }
  next.prototype.constructor = next;
  return next;
};

load('core/runtime/lobby.js');
load('core/runtime/proto.js');
load('core/runtime/object.js');
load('core/runtime/message.js');
load('core/runtime/string.js');
load('core/runtime/number.js');
load('core/runtime/nil.js');
load('core/runtime/boolean.js');
load('core/runtime/block.js');
load('core/runtime/method.js');
load('core/runtime/enumerator.js');
load('core/runtime/map.js');
load('core/runtime/list.js');
