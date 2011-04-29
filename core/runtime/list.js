IoRuntime.Io.List = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (values){
    this.addProto(IoRuntime.Io.Enumerator);
    this.setType('List');
    this.constructor = IoRuntime.Io.List;
    this.values = values || [];
  },
  active: function (){
    this.setSlot('at', IoRuntime.Io.Method.create(this.at, this));
    this.setSlot('push', IoRuntime.Io.Method.create(this.push, this));
  },
  abstractEach: function (block){
    for(var i = 0; i < this.values.length; ++i){
      block(this.values[i], i);
    }
  },
  size: function (){
    return new IoRuntime.Io.Number(this.values.length);
  },
  at: function (numValue){
    return this.values[numValue.value];
  },
  push: function (value){
    return this.values.push(value);
  }
});
