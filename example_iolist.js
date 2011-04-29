load('io.js');

var io = new IoRuntime.Io;
var list = io.List.clone();

print(list.size());

list.push(io.String.clone('foo'));
list.push(io.Number.clone(123));
list.push(io.Boolean.clone(true));

print(list.size());

list.each(IoRuntime.Io.Block.create(function(value, key){
  print(value + ':' + key);
}));
