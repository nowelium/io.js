IoRuntime.Io.Enumerator = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function (value){
    this.setType('Enumerator');
  },
  active: function (){
    this.setSlot('each',  IoRuntime.Io.Method.create(this.each, this));
    this.setSlot('select', IoRuntime.Io.Method.create(this.select, this));
    this.setSlot('map', IoRuntime.Io.Method.create(this.map, this));
  },
  abstractEach: null,
  each: function (block){
    this.abstractEach(function (value, key){
      block(value, key);
    });
    return this;
  },
  select: function (block){
    var results = [];
    this.each(function (value, key){
     if(block(value, key)){
        results.push(value);
      }
    });
    return new IoRuntime.Io.List(results);
  },
  map: function (block){
    var results = [];
    this.each(function (value, key){
      results.push(block(value, key));
    });
    return new IoRuntime.Io.List(results);
  }
});

