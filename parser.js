var IoEngine = function (){};

IoEngine.Parser = function (){};
IoEngine.Parser.prototype.parse = function (body){
    //print(body)
    this.body = body.replace(/(\r?\n)/mg, '');
    return this.compile();
};
IoEngine.Parser.prototype.compile = function (){
    while(this.term());
    var expr = this.expression();
    if(expr == undefined){
        return undefined;
    }
    var ret = [expr];
    while(this.term()){
        expr = this.expression();
        if(!expr){
            break;
        }
        ret.push(expr);
    }
    return ret;
};

IoEngine.Parser.prototype.term = function (){
    if(this.body.match(/^[ \t]*(\r?\n|;)/)) {
        this.body = RegExp.rightContext;
        return RegExp.$1;
    }
    return undefined;
};
IoEngine.Parser.prototype.expression = function (){
    var x, y;
    x = this.message();
    if(x == undefined){
        return undefined;
    }

    var ret = [x];
    while (this.body.match(/^[ \t]*(.+)/)) {
        var prebody = this.body;
        this.body = RegExp.$1;
        y = this.message();
        if(!y){
            this.body = prebody;
            break;
        }
        ret.push(y);
    }
    return new IoEngine.Node.Message('message', ret);
};
IoEngine.Parser.prototype.message = function (){
    var x;
    x = this.symbol();
    if(x != undefined){
        return x;
    }
    x = this.arguments();
    if(x != undefined){
        return new IoEngine.Node.Message('argMessage', [x]);
    }
    return undefined;
};
IoEngine.Parser.prototype.symbol = function (){
    var x;
    x = this.number();
    if(x != undefined){
        return x;
    }
    x = this.identifier();
    if(x != undefined){
        return x;
    }
    x = this.operator();
    if(x != undefined){
        return x;
    }
    x = this.quote();
    if(x != undefined){
        return x;
    }
    return undefined;
};
IoEngine.Parser.prototype.number = function (){
    if(this.body.match(/^[ \t]*(\d+)/)){
        this.body = RegExp.rightContext;
        return new IoEngine.Node.Number(RegExp.$1);
    }
    return undefined;
};
IoEngine.Parser.prototype.identifier = function (){
    if(this.body.match(/^[ \t]*(\w+)/)){
        this.body = RegExp.rightContext;
        return new IoEngine.Node.Identifier(RegExp.$1);
    }
    return undefined;
};
IoEngine.Parser.prototype.operator = function (){
    if(this.body.match(/^[ \t]*((\*|\/|\+|\-|\%|\=|\-|\:)+)/)){
        this.body = RegExp.rightContext;
        return new IoEngine.Node.Operator(RegExp.$1);
    }
    return undefined;
};
IoEngine.Parser.prototype.quote = function (){
    if(this.body.match(/^[ \t]*('([^']+)')/)){
        this.body = RegExp.rightContext;
        return new IoEngine.Node.Quote(RegExp.$1);
    }
    if(this.body.match(/^[ \t]*("([^"]+)")/)){
        this.body = RegExp.rightContext;
        return new IoEngine.Node.Quote(RegExp.$1);
    }
    if(this.body.match(/^[ \t]*("""([^(""")]+)""")/mg)){
        this.body = RegExp.rightContext;
        return new IoEngine.Node.Quote(RegExp.$1);
    }
    return undefined;
};
IoEngine.Parser.prototype.arguments = function (){
    if(this.body.match(/^[ \t]*(\()/)){
        var args = [];
        var openBlock = RegExp.rightContext;
        this.body = openBlock;
        var r = this.expression();
        if(r != undefined){
            args.push(r);
        }
        if(this.body.match(/^[ \t]*,/)){
            this.body = RegExp.rightContext;
            r = this.expression();
            args.push(r);
        }
        if(this.body.match(/^[ \t]*(\))/)){
            this.body = RegExp.rightContext;
        }
        return new IoEngine.Node.Arguments(args);
    }
    var x = this.symbol();
    if(x != undefined){
        return new IoEngine.Node.Arguments([x]);
    }
    return undefined;
};



IoEngine.Node = function (type){
    this.type = type;
};
IoEngine.Node.prototype.toString = function (){
    return 'Node({type:' + this.type + ', source={' + this.toSource() + '}})';
};
IoEngine.Node.prototype.toSource = function (){};
IoEngine.Node.prototype.dump = function (output){
    output(this._dump(''));
};
IoEngine.Node.prototype._dump = function (indent){};
IoEngine.Node.prototype.visit = function (interpreter, runtime, context){
    throw new Error('nosuch visit node: ' + node);
};

IoEngine.Node.Message = function (message, children){
    this.message = message;
    this.children = children;
};
IoEngine.Node.Message.prototype = new IoEngine.Node('Message');
IoEngine.Node.Message.prototype.toSource = function (){
    return 'message=' + this.message + ', children=' + this.children;
};
IoEngine.Node.Message.prototype._dump = function(indent){
    var buf = [];
    buf.push(indent + '<message>\n');
    for(var i = 0; i < this.children.length; ++i){
        buf.push(indent + ' <child>\n');
        buf.push(this.children[i]._dump(indent + '  ') + '\n');
        buf.push(indent + ' </child>\n');
    }
    buf.push(indent + '</message>');
    return buf.join('');
};
IoEngine.Node.Message.prototype.visit = function (interpreter, runtime, context){
    return interpreter.executeMessage(this, runtime, context);
};

IoEngine.Node.Number = function (number){
    this.number = number;
};
IoEngine.Node.Number.prototype = new IoEngine.Node('Number');
IoEngine.Node.Number.prototype.toSource = function (){
    return 'num=' + this.number;
};
IoEngine.Node.Number.prototype._dump = function (indent){
    return indent + '<number>' + this.number + '</number>';
};
IoEngine.Node.Number.prototype.visit = function (interpreter, runtime, context){
    return interpreter.executeNumber(this, runtime, context);
};

IoEngine.Node.Identifier = function (identifier){
    this.identifier = identifier;
};
IoEngine.Node.Identifier.prototype = new IoEngine.Node('Identifier');
IoEngine.Node.Identifier.prototype.toSource = function (){
    return 'identifier=' + this.identifier;
};
IoEngine.Node.Identifier.prototype._dump = function (indent){
    return indent + '<identifier>' + this.identifier + '</identifier>';
};
IoEngine.Node.Identifier.prototype.visit = function (interpreter, runtime, context){
    return interpreter.executeIdentifier(this, runtime, context);
};

IoEngine.Node.Operator = function (operator){
    this.operator = operator;
};
IoEngine.Node.Operator.prototype = new IoEngine.Node('Operator');
IoEngine.Node.Operator.prototype.toSource = function (){
    return 'operator=' + this.operator;
};
IoEngine.Node.Operator.prototype._dump = function (indent){
    return indent + '<operator>' + this.operator + '</operator>';
};
IoEngine.Node.Operator.prototype.visit = function (interpreter, runtime, context){
    return interpreter.executeOperator(this, runtime, context);
};

IoEngine.Node.Quote = function (quote){
    this.quote = quote;
};
IoEngine.Node.Quote.prototype = new IoEngine.Node('Quote');
IoEngine.Node.Quote.prototype.toSource = function (){
    return 'quote=' + this.quote;
};
IoEngine.Node.Quote.prototype._dump = function (indent){
    return indent + '<quote>' + this.quote + '</quote>';
};
IoEngine.Node.Quote.prototype.visit = function (interpreter, runtime, context){
    return interpreter.executeQuote(this, runtime, context);
};

IoEngine.Node.Arguments = function (args){
    this.args = args;
};
IoEngine.Node.Arguments.prototype = new IoEngine.Node('Arguments');
IoEngine.Node.Arguments.prototype.toSource = function (){
    return 'args=' + this.args;
};
IoEngine.Node.Arguments.prototype._dump = function(indent){
    var buf = [];
    buf.push(indent + '<arguments>\n');
    for(var i = 0; i < this.args.length; ++i){
        buf.push(indent + ' <arg>\n');
        buf.push(this.args[i]._dump(indent + '  ') + '\n');
        buf.push(indent + ' </arg>\n');
    }
    buf.push(indent + '</arguments>');
    return buf.join('');
};
IoEngine.Node.Arguments.prototype.visit = function (interpreter, runtime, context){
    return interpreter.executeArguments(this, runtime, context);
};

IoEngine.Node.Eol = function (){
    // ignore
};
IoEngine.Node.Eol.prototype = new IoEngine.Node('Eol');
IoEngine.Node.Eol.prototype.toSource = function (){
    return '<<EOL>>';
};
IoEngine.Node.Eol.prototype._dump = function (indent){
    return indent + '<<EOL>>';
};
IoEngine.Node.Eol.prototype.visit = function (interpreter, runtime, context){
    return interpreter.executeEol(this, runtime, context);
};




IoEngine.Scope = function (){this.init()};
IoEngine.Scope.prototype.init = function (){
    this.scope = [];
    this.level = [{}];
};
IoEngine.Scope.prototype.pushScope = function (arg){
    this.scope.push(this.level);
    this.level = [arg || {}];
};
IoEngine.Scope.prototype.popScope = function (){
    this.level = this.scope.pop();
};


IoEngine.Interpreter = function (){
    this.scope = new IoEngine.Scope();
    this.parser = new IoEngine.Parser();
    this.stdout = '';
    this.stderr = '';
};
IoEngine.Interpreter.prototype.clean = function (){
    this.scope.init();
};
IoEngine.Interpreter.prototype.evaluate = function (runtime, script){
    var context = runtime.io.Message.clone();
    var nodes = this.parser.parse(script);
    nodes.push(new IoEngine.Node.Eol);
    for(var i in nodes){
        this.execute(nodes[i], runtime, context);
    }
    return context.peek();
};
IoEngine.Interpreter.prototype.execute = function (node, runtime, context){
    return node.visit(this, runtime, context);
};
IoEngine.Interpreter.prototype.executeMessage = function (node, runtime, context){
    var message = runtime.io.Message.clone();
    var children = node.children;

    if(!(0 in children)){
        throw new Error('message compile error: ' + node);
    }
    var lastValue = this.execute(children[0], runtime, message);
    message.push(lastValue);

    var nextValue = null;
    for(var i = 1; i < children.length; ++i){
        var nextValue = this.execute(children[i], runtime, message);
        if(Function.prototype.isPrototypeOf(lastValue)){
            lastValue = lastValue(nextValue);
        } else {
            lastValue = nextValue;
        }
        message.push(lastValue);
    }
    context.push(message);
};
IoEngine.Interpreter.prototype.executeNumber = function (node, runtime, context){
    return runtime.io.Number.clone(node.number);
};
IoEngine.Interpreter.prototype.executeIdentifier = function (node, runtime, context){
    var latestObj = context.peek();
    return latestObj.getSlot(node.identifier);
};
IoEngine.Interpreter.prototype.executeOperator = function (node, runtime, context){
    var latestObj = context.peek();
    return latestObj.getSlot(node.operator);
};
IoEngine.Interpreter.prototype.executeQuote = function (node, runtime, context){
    return runtime.io.String.clone(node.quote);
};
IoEngine.Interpreter.prototype.executeArguments = function (node, runtime, context){
    print('args');
};
IoEngine.Interpreter.prototype.executeEol = function (node, runtime, context){
    var args = context.values;

    var latestObj = runtime.io.Nil.clone();
    var argObj = runtime.io.Nil.clone();
    if(IoRuntime.Io.Message.prototype.isPrototypeOf(args[0])){
        var messages = args[0].values;
        var length = messages.length;
        var latestObj = messages[length - 1];
        var argObj = messages[length - 2];
    }
    if(Function.prototype.isPrototypeOf(latestObj)){
        context.push(latestObj(argObj));
    } else {
        context.push(latestObj);
    }
};

IoEngine.Runtime = function (text, stdout, stderr){
    this.text = text;
    this.stdout = stdout;
    this.stderr = stderr;
    this.io = new IoRuntime.Io(stdout, stderr);
    this.interpreter = new IoEngine.Interpreter();
};
IoEngine.Runtime.prototype.run = function (){
    try {
        var result = this.interpreter.evaluate(this, this.text);
        this.stdout(result);
    } catch(e){
        this.stderr(e.message);
    } finally {
        this.interpreter.clean();
    }
};

IoEngine.Util = function (){};

IoRuntime = function (){};
IoRuntime.Io = function (stdout, stderr){
    this.init();
    this.initRuntime(stdout, stderr);
};
IoRuntime.Io.prototype.init = function (){
    this.slots = {};
    var root = IoRuntime.Io;
    for(var slot in root){
        if(root[slot].prototype){
            this[slot] = new root[slot];
        }
    }
};
IoRuntime.Io.prototype.initRuntime = function (stdout, stderr){
    IoRuntime.Io.Object.prototype.callActive = function (){
        this.setSlot('print', function(obj){
            return String(obj);
        });
        this.setSlot('println', function(obj){
            return String(obj) + '\n';
        });
    };
};
IoRuntime.Io.create = function (parent, properties){
    var next = function (){
        return this.init.apply(this, arguments);
    };
    if(parent){
        if(!parent.prototype.init){
            // todo
        }
        var $super = new parent;
        next.prototype = $super;
        next.prototype.$super = $super;
    }

    for(var property in properties){
        next.prototype[property] = properties[property];
    }
    if(!next.prototype.init){
        next.prototype.init = function (){};
    }
    next.prototype.constructor = next;
    return next;
};
IoRuntime.Io.bindFunction = function(func, target){
    return function (){
        return func.apply(target, arguments);
    };
};
IoRuntime.Io.curryFunction = function (func, args){
    var __method__ = func;
    return function (){
        for(var i = 0; i < arguments.length; ++i){
            args.push(arguments[i]);
        }
        return __method__.apply(this, args);
    }
};
IoRuntime.Io.reduceArray = function (list){
    if(!list){
        return [];
    }

    var result = [];
    for(var i = 0; i < list.length; ++i){
        result.push(list[i]);
    }
    return result;
};
IoRuntime.Io.Lobby = IoRuntime.Io.create(null, {});
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
IoRuntime.Io.Nil = IoRuntime.Io.create(IoRuntime.Io.Object, {
    init: function (){
        // ignore
    },
    active: function (){
        this.setSlot('isNil', IoRuntime.Io.Method.create(this._isNil, this));
    },
    _isNil: function (){
        return IoRuntime.Io.Boolean.create(true);
    },
    toString: function (){
        return 'nil';
    }
});
IoRuntime.Io.Nil.create = function (){
    var __self__ = arguments.callee;
    if(__self__.values == undefined){
        __self__.values = new IoRuntime.Io.Nil();
    }
    return __self__.values;
};

IoRuntime.Io.Boolean = IoRuntime.Io.create(IoRuntime.Io.Object, {
    init: function (value){
        this.value = Boolean(value);
    },
    active: function (){
        this.setSlot('isTrue', IoRuntime.Io.Method.create(this._isTrue, this));
        this.setSlot('isFalse', IoRuntime.Io.Method.create(this._isFalse, this));
    },
    _isTrue: function (){
        if(this.value){
            return IoRuntime.Io.Boolean.create(true);
        }
        return IoRuntime.Io.Boolean.create(false);
    },
    _isFalse: function (){
        var save = Boolean(this.value);
        try {
            this.value = !this.value;
            return this._isTrue();
        } finally {
            this.value = save;
        }
    },
    toString: function(){
        return this.value ? 'true' : 'false';
    }
});
IoRuntime.Io.Boolean.create = function (bool){
    var values;
    var __self__ = arguments.callee;
    if(__self__.values == undefined){
        __self__.values = {};
    }
    values = __self__.values;
    if(values[bool]){
        return values[bool];
    }
    return __self__.values[bool] = new IoRuntime.Io.Boolean(bool);
};

IoRuntime.Io.Block = IoRuntime.Io.create(IoRuntime.Io.Object, {
    init: function (block, args){
        this.setType('Block');
        this.block = block;
        this.args = args || [];
    },
    setBlock: function (block){
        this.block = block;
    },
    getBlock: function (){
        return this.block;
    },
    setArgs: function (args){
        this.args = args;
    },
    getArgs: function (){
        return this.args;
    },
    _call: function (block, scope, args){
        return block.apply(scope, args);
    },
    call: function (){
        var _args = this.args.concat(IoRuntime.Io.reduceArray(arguments));
        return this._call(this.block, this, _args);
    }
});
IoRuntime.Io.Block.create = function (block, args){
    var block = new IoRuntime.Io.Block(block, args);
    var callback = function (){
        return block.call.apply(block, arguments);
    };
    return callback;
};
IoRuntime.Io.Method = IoRuntime.Io.create(IoRuntime.Io.Block, {
    init: function (block, scope, args){
        this.setBlock(block);
        this.setScope(scope);
        this.setArgs(args || []);
    },
    setScope: function(scope){
        this.scope = scope;
    },
    getScope: function (){
        return this.scope;
    },
    call: function (){
        var _args = this.args.concat(IoRuntime.Io.reduceArray(arguments));
        return this._call(this.block, this.scope, _args);
    }
});
IoRuntime.Io.Method.create = function (block, scope, args){
    var method = new IoRuntime.Io.Method(block, scope, args);
    var callback = function (){
        return method.call.apply(this, arguments);
    };
    return IoRuntime.Io.bindFunction(callback, method);
};
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

IoRuntime.Io.Map = IoRuntime.Io.create(IoRuntime.Io.Object, {
    init: function (values){
        this.addProto(IoRuntime.Io.Enumerator);
        this.setType('Map');
        this.constructor = IoRuntime.Io.Map;
        this.mapValue = values || {};
    },
    active: function (){
        this.setSlot('atPut', IoRuntime.Io.Method.create(this.atPut, this));
        this.setSlot('at', IoRuntime.Io.Method.create(this.at, this));
        this.setSlot('keys', IoRuntime.Io.Method.create(this.keys, this));
        this.setSlot('values', IoRuntime.Io.Method.create(this.values, this));
        this.setSlot('asObject', IoRuntime.Io.Method.create(this.asObject, this));
    },
    abstractEach: function (block){
        for(var key in this.mapValue){
            block(this.mapValue[key], key);
        }
    },
    atPut: function (key, value){
        this.mapValue[key] = value;
    },
    at: function (key){
        return this.mapValue[key];
    },
    keys: function (){
        var keys = [];
        for(var key in this.mapValue){
            keys.push(key);
        }
        return new IoRuntime.Io.List(keys);
    },
    values: function (){
        var values = [];
        for(var key in this.mapValue){
            values.push(this.mapValue[key]);
        }
        return new IoRuntime.Io.List(values);
    },
    asObject: function (){
        var obj = new IoRuntime.Io.Object;
        for(var key in this.mapValue){
            obj.setSlot(key, this.mapValue[key]);
        }
        return obj;
    }
});
IoRuntime.Io.List = IoRuntime.Io.create(IoRuntime.Io.Object, {
    init: function (values){
        this.addProto(IoRuntime.Io.Enumerator);
        this.setType('List');
        this.constructor = IoRuntime.Io.List;
        this.values = values || [];
    },
    active: function (){
        this.setSlot('at', IoRuntime.Io.Method.create(this.at, this));
        this.setSlot('push', IoRuntime.Io.Method.create(this.push, this));
    },
    abstractEach: function (block){
        for(var i = 0; i < this.values.length; ++i){
            block(this.values[i], i);
        }
    },
    size: function (){
        return new IoRuntime.Io.Number(this.values.length);
    },
    at: function (numValue){
        return this.values[numValue.value];
    },
    push: function (value){
        return this.values.push(value);
    }
});
/*
var parser = new IoEngine.Parser;
var r = parser.parse(
    'Hoge := Object clone do( foo := method(arg, writeln(arg, "hello world"))) \n' +
    'hoge := Hoge clone \n' +
    'hoge foo := method("foobar" println)'
);
for(var i in r){
    r[i].dump(print)
}
*/

//var runtime = new IoEngine.Runtime('1 + 1 println', print, print);
var runtime = new IoEngine.Runtime('1 + 2 * 3 println', print, print);
runtime.run();

/*
var io = new IoRuntime.Io;
var obj = io.Object.clone();
print(obj.slotNames().values);
var str = io.String.clone('foo');
print(str.slotNames().values);
obj.setSlot('hello', 'world');
print(str.slotNames().values); // foo hello and string protos
*/


/*
var o = io.Object.clone();
var s = io.String.clone('hoge');
var n = io.Number.clone(123);

print(s.getSlot('+')(io.Number.clone(1)).value)
print(n.getSlot('+')(io.Number.clone(1)).value)

var map = io.Map.clone();
map.atPut('hoge', 'foo');
map.atPut('foo', 'bar');
map.each(IoRuntime.Io.Block.create(function(value, key){
    print(value+ ':' + key);
}));
*/

