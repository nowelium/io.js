IoRuntime.Io.Block = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (block, args){
    this.setType('Block');
    this.block = block;
    this.args = args || [];
  },
  setBlock: function (block){
    this.block = block;
  },
  getBlock: function (){
    return this.block;
  },
  setArgs: function (args){
    this.args = args;
  },
  getArgs: function (){
    return this.args;
  },
  _call: function (block, scope, args){
    return block.apply(scope, args);
  },
  call: function (){
    var _args = this.args.concat(IoEngine.Utils.reduceArray(arguments));
    return this._call(this.block, this, _args);
  }
});
IoRuntime.Io.Block.create = function (block, args){
  var block = new IoRuntime.Io.Block(block, args);
  var callback = function (){
    return block.call.apply(block, arguments);
  };
  return callback;
};

