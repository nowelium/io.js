load('io.js');

var io = new IoRuntime.Io;
var obj = io.Object.clone();
print(obj.slotNames().values);
var str = io.String.clone('foo');
print(str.slotNames().values);
obj.setSlot('hello', 'world');
print(str.slotNames().values); // foo hello and string protos
