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
