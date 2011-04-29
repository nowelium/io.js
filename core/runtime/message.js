IoRuntime.Io.Message = IoRuntime.Io.create(IoRuntime.Io.Object, {
  init: function(){
    this.values = [];
    this.setType('Message');
    this.constructor = IoRuntime.Io.Message;
  },
  push: function (value){
    return this.values.push(value);
  },
  pop: function (value){
    return this.values.pop();
  },
  peek: function (value){
    var lastIndex = this.values.length;
    return this.values[lastIndex - 1];
  },
  args: function (){
    return new IoRuntime.Io.List(this.values);
  },
  toString: function(){
    return 'message(' + String(this.peek()) + ')';
  }
});

