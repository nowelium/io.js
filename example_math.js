load('io.js');

var runtime = new IoEngine.Runtime('1 + 1 println', print, print);
runtime.run();

var runtime = new IoEngine.Runtime('1 + 2 * 3 println', print, print);
runtime.run();
