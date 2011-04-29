load('io.js');

var io = new IoRuntime.Io;
var o = io.Object.clone();
var s = io.String.clone('hoge');
var n = io.Number.clone(123);

print(s.getSlot('+')(io.Number.clone(1)).value)
print(n.getSlot('+')(io.Number.clone(1)).value)

var map = io.Map.clone();
map.atPut('hoge', 'foo');
map.atPut('foo', 'bar');
map.each(IoRuntime.Io.Block.create(function(value, key){
  print(value + ':' + key);
}));
