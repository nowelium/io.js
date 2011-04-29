IoRuntime.Io.Proto = IoRuntime.Io.create(IoRuntime.Io.Lobby, {
  init: function (){
    this.protos = [];
    this.type = 'Proto';
  },
  callActive: function (){
    // ignore
  },
  active: function (){
    // ignore
  },
  setType: function(name){
    this.type = name;
  },
  getType: function (){
    return this.type;
  },
  addProto: function (value){
    this.protos.push(value);
    for(var property in value.prototype){
      if(property in this){
        continue;
      }
      this[property] = value.prototype[property];
    }
  },
  clone: function (){
    var target = IoRuntime.Io[this.type];
    var args = arguments;
    var f = function (){
      return this.init.apply(this, args);
    };
    f.prototype = target.prototype;
    var self = new f;
    self.callActive();
    self.active();
    return self;
  },
});

