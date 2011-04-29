load('io.js');

var parser = new IoEngine.Parser;
var r = parser.parse(
  'Hoge := Object clone do( foo := method(arg, writeln(arg, "hello world"))) \n' +
  'hoge := Hoge clone \n' +
  'hoge foo := method("foobar" println)'
);
for(var i in r){
  r[i].dump(print)
}

