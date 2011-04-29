IoRuntime.Io.Method = IoRuntime.Io.create(IoRuntime.Io.Block, {
  init: function (block, scope, args){
    this.setBlock(block);
    this.setScope(scope);
    this.setArgs(args || []);
  },
  setScope: function(scope){
    this.scope = scope;
  },
  getScope: function (){
    return this.scope;
  },
  call: function (){
    var _args = this.args.concat(IoEngine.Utils.reduceArray(arguments));
    return this._call(this.block, this.scope, _args);
  }
});
IoRuntime.Io.Method.create = function (block, scope, args){
  var method = new IoRuntime.Io.Method(block, scope, args);
  var callback = function (){
    return method.call.apply(this, arguments);
  };
  return IoEngine.Utils.bindFunction(callback, method);
};
