IoRuntime.Io.Boolean = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (value){
    this.value = Boolean(value);
  },
  active: function (){
    this.setSlot('isTrue', IoRuntime.Io.Method.create(this._isTrue, this));
    this.setSlot('isFalse', IoRuntime.Io.Method.create(this._isFalse, this));
  },
  _isTrue: function (){
    if(this.value){
      return IoRuntime.Io.Boolean.create(true);
    }
    return IoRuntime.Io.Boolean.create(false);
  },
  _isFalse: function (){
    var save = Boolean(this.value);
    try {
      this.value = !this.value;
      return this._isTrue();
    } finally {
      this.value = save;
    }
  },
  toString: function(){
    return this.value ? 'true' : 'false';
  }
});
IoRuntime.Io.Boolean.create = function (bool){
  var values;
  var __self__ = arguments.callee;
  if(__self__.values == undefined){
    __self__.values = {};
  }
  values = __self__.values;
  if(values[bool]){
    return values[bool];
  }
  return __self__.values[bool] = new IoRuntime.Io.Boolean(bool);
};

