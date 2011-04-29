IoRuntime.Io.Number = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (value){
    this.setType('Number');
    this.constructor = IoRuntime.Io.Number;
    this.value = Number(value);
  },
  active: function (){
    this.setSlot('+', IoRuntime.Io.Method.create(this.add, this));
    this.setSlot('-', IoRuntime.Io.Method.create(this.subtract, this));
    this.setSlot('*', IoRuntime.Io.Method.create(this.multiply, this));
    this.setSlot('/', IoRuntime.Io.Method.create(this.divide, this));
  },
  add: function (numValue){
    return new this.constructor(this.value + Number(numValue.value));
  },
  subtract: function (numValue){
    return new this.constructor(this.value - Number(numValue.value));
  },
  multiply: function (numValue){
    return new this.constructor(this.value * Number(numValue.value));
  },
  divide: function (numValue){
    return new this.constructor(this.value / Number(numValue.value));
  },
  toString: function (){
    return String(this.value);
  }
});

