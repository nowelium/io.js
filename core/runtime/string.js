IoRuntime.Io.String = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (value){
    this.setType('String');
    this.constructor = IoRuntime.Io.String;
    this.value = String(value);
  },
  active: function (){
    this.setSlot('+', IoRuntime.Io.Method.create(this.concat, this));
    this.setSlot('concat', IoRuntime.Io.Method.create(this.concat, this));
    this.setSlot('upper', IoRuntime.Io.Method.create(this.upper, this));
    this.setSlot('lowser', IoRuntime.Io.Method.create(this.lowser, this));
    this.setSlot('substr', IoRuntime.Io.Method.create(this.substring, this));
    this.setSlot('split', IoRuntime.Io.Method.create(this.splitMethod, this));
  },
  concat: function(stringValue){
    return new this.constructor(this.value + String(stringValue.value));
  },
  upper: function (){
    return new this.constructor(this.value.toUpperCase());
  },
  lower: function (){
    return new this.constructor(this.value.toLowerCase());
  },
  substring: function (from, to){
    return new this.constructor(this.value.substring(from.value, to.value));
  },
  toString: function (){
    return String(this.value);
  }
});

