IoRuntime.Io.Map = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (values){
    this.addProto(IoRuntime.Io.Enumerator);
    this.setType('Map');
    this.constructor = IoRuntime.Io.Map;
    this.mapValue = values || {};
  },
  active: function (){
    this.setSlot('atPut', IoRuntime.Io.Method.create(this.atPut, this));
    this.setSlot('at', IoRuntime.Io.Method.create(this.at, this));
    this.setSlot('keys', IoRuntime.Io.Method.create(this.keys, this));
    this.setSlot('values', IoRuntime.Io.Method.create(this.values, this));
    this.setSlot('asObject', IoRuntime.Io.Method.create(this.asObject, this));
  },
  abstractEach: function (block){
    for(var key in this.mapValue){
      block(this.mapValue[key], key);
    }
  },
  atPut: function (key, value){
    this.mapValue[key] = value;
  },
  at: function (key){
    return this.mapValue[key];
  },
  keys: function (){
    var keys = [];
    for(var key in this.mapValue){
      keys.push(key);
    }
    return new IoRuntime.Io.List(keys);
  },
  values: function (){
    var values = [];
    for(var key in this.mapValue){
      values.push(this.mapValue[key]);
    }
    return new IoRuntime.Io.List(values);
  },
  asObject: function (){
    var obj = new IoRuntime.Io.Object;
    for(var key in this.mapValue){
      obj.setSlot(key, this.mapValue[key]);
    }
    return obj;
  }
});

