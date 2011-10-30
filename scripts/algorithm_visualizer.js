function AlgorithmVisualizer(config){
  this.config = config;
  this.values = config.values;
  delete(this.config.values);
  this.container = $(config.container);
  this._init();
}

AlgorithmVisualizer.prototype._init = function(){
  this.canvas = $('<canvas/>',{
    width : '100%',
    height : '100%'
  }).appendTo(this.container)[0];
  this.$canvas = $(this.canvas);
  this.height = this.canvas.height;
  this.width = this.canvas.width;
  var values = this.values;
  var i, numCount = values.length;
  var max=0, min=values[0];
  
  for(i=0; i<numCount; i++){
    var value = values[i];
    if (value > max){
      max = value;
    }
    if (value < min){
      min = value;
    }
  }
  
  // calculate height scale
  this.topPadding = this.height / 10;
  var topPadding = this.topPadding;
  this.bottomPadding = this.height / 5;
  var bottomPadding = this.bottomPadding;
  this.availableHeight = this.height - topPadding - bottomPadding;
  var availableHeight = this.availableHeight;
  this.heightScale = availableHeight / max;
  
  // lets find the elementWidth
  // we need space for numCount bars, and for spaces in between plus one more
  
  var barCount = numCount ;
  this.elementWidth = this.width / barCount;
  
  // now we paint the bars
  var canvas = this.canvas;
  if (typeof canvas.getContext !== 'function'){
    throw "getContext Method not defined";
  }
  
  var context = canvas.getContext('2d');
  context.lineWidth = parseInt(this.elementWidth,10) - 2;
  if (context.lineWidth < 1){
    throw 'Insufficient Canvas space to render'
  }
  // context.strokeRect(0, topPadding, this.width, availableHeight );
  var x1, y1, x2, y2;
  y1 = this.height - bottomPadding;
  context.fillStyle = "#666";
  context.strokeStyle = '#666';
  
  for(i=0;i<numCount; i++){
    // element number * 2 gives the bar index
    // bar index * 2 gives the ending x value
    // subtract elementWidth/2 to get the middle x value of the bar
    barIndex = (i+1);
    x1 = x2 = parseInt((i+1)  * this.elementWidth - this.elementWidth/2, 10);
    y2 = parseInt(y1 - values[i] * this.heightScale, 10);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
  }
};

AlgorithmVisualizer.prototype.swap = function(pos1, pos2){
  var value1 = this.values[pos1];
  var value2 = this.values[pos2];
  
  // swap the actual values
  this.values[pos1] = value2;
  this.values[pos2] = value1;
  
  var index1 = pos1 + 1;
  var index2 = pos2 + 1;
  
  var x1, x2, x3, x4;
  var context = this.canvas.getContext('2d');
  
  // clear the old renders
  context.globalCompositeOperation = 'xor'
  // context.strokeStyle = '#fff';
  y1 = this.height - this.bottomPadding;
  x1 = x2 = parseInt((index1)  * this.elementWidth - this.elementWidth/2, 10);
  y2 = parseInt(y1 - value1 * this.heightScale, 10);
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.stroke();

  x1 = x2 = parseInt((index2)  * this.elementWidth - this.elementWidth/2, 10);
  y2 = parseInt(y1 - value2 * this.heightScale, 10);
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.stroke();
  
  
};