IoRuntime.Io.Nil = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (){
    // ignore
  },
  active: function (){
    this.setSlot('isNil', IoRuntime.Io.Method.create(this._isNil, this));
  },
  _isNil: function (){
    return IoRuntime.Io.Boolean.create(true);
  },
  toString: function (){
    return 'nil';
  }
});
IoRuntime.Io.Nil.create = function (){
  var __self__ = arguments.callee;
  if(__self__.values == undefined){
    __self__.values = new IoRuntime.Io.Nil();
  }
  return __self__.values;
};

