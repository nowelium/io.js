IoRuntime.Io.Object = IoRuntime.Io.create(IoRuntime.Io.Proto, {
  init: function (){
    this.slots = {};
    this.setType('Object');
    this.constructor = IoRuntime.Io.Object;
  },
  active: function (){
    this.setSlot(':=', IoRuntime.Io.Method.create(this.setSlot, this));
    this.setSlot('self', IoRuntime.Io.Block.create(function (){return this}));
    this.setSlot('true', IoRuntime.Io.Boolean.create(true));
    this.setSlot('false', IoRuntime.Io.Boolean.create(false));
    this.setSlot('nil', IoRuntime.Io.Nil.create());
  },
  setSlot: function(key, value){
    this.slots[key] = value;
  },
  getSlot: function(key){
    return this.slots[key];
  },
  slotNames: function(){
    var keys = [];
    for(var key in this.slots){
      keys.push(key);
    }
    return new IoRuntime.Io.List(keys);
  }
});

