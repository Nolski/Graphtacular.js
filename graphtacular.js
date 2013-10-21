//TODO: Write a scale or something
function Graphtacular (context, options) {
    this._context = context;
    this.data = (options.data || []);
    this.bar_padding = 10;
    this.bar_width = 0;
    this.animateId;
    this.bars = null;
    this.max = -1;
    this.side_padding = 40;
    this.increment = 10;
    for(var i=0; i < this.data.length; i++) {
        var bar = this.data[i];
        if (this.bars == undefined) {
            this.bars = [];
        }
        this.bars.push(new Bar(this, bar.label, bar.value));
    };
    this.animate(this);
}

Graphtacular.prototype.getPixelHeight = function(height) {
    var canvas_max = this._context.canvas.height;
    if (height > canvas_max && height > this.max) {
        this.max = height;
    };

    if(this.max < 0) {
        return height;
    }

    height = height;
    height = Math.floor(height * (canvas_max / (this.max)))

    return height;
};

Graphtacular.prototype.addBars = function(bars) {
    var self = this;
    bars.forEach(function (bar) {
        if (self.bars == undefined) {
            self.bars = [];
        }
        self.bars.push(new Bar(self, bar.label, bar.value, 0));
    });
}

Graphtacular.prototype.changeBar = function(bar_name, value) {
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if(bar.label == bar_name) {
            bar.value = value;
        }
    }
};

Graphtacular.prototype.animate = function (self) {
    self.bar_width = (self._context.canvas.width / self.bars.length) - (self.bar_padding) - (self.side_padding / self.bars.length);
    var width_changed = self.animateWidth(),
        height_finished = true;
    if(!width_changed) {
        height_finished = self.animateHeight();
    }
    self.drawFrame();
    self.drawAxis();
    window.requestAnimationFrame(function () {
        self.animate(self);
    });
}

Graphtacular.prototype.getHighestValue = function() {
    var highest_value = 0;
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if (bar.value > highest_value) {
            highest_value = bar.value;
        };
    };
    return highest_value;
};

Graphtacular.prototype.drawAxis = function() {
    this._context.beginPath();
    this._context.moveTo(this.side_padding - 5, 5);
    this._context.lineTo(this.side_padding - 5, this._context.canvas.height);
    this._context.lineWidth = 2;
    this._context.stroke();
    //this._context.endPath();

    var increment =  this._context.canvas.height / this.increment,
        value_increment = Math.floor(this.getHighestValue() / this.increment);
    for (var i = 1; i < this.increment; i++) {
        var y = i * increment,
            val = (this.increment - i) * value_increment;
        this._context.beginPath();
        this._context.moveTo(this.side_padding - 10, y);
        this._context.lineTo(this.side_padding, y);
        this._context.stroke();
        this._context.fillText(val, 0, y + 5);
        //this._context.endPath();
    };
};

Graphtacular.prototype.drawFrame = function() {
    canvas.width = canvas.width;
    var x = this.side_padding;
    //TODO: Here is where we will set all of the graph styling
    this._context.fillStyle = "blue";
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        //var bar_height = this._context.canvas.height * (bar.height / 100); //TODO: What is this
        //bar_height = -Math.abs(bar_height);
        //console.log(bar_height);
        var bar_height = this.getPixelHeight(bar.height);
        console.log(-this._context.canvas.height);
        this._context.fillRect(x, this._context.canvas.height - bar_height, bar.width, bar_height);
        x += bar.width+ this.bar_padding;
    }
}

Graphtacular.prototype.animateWidth = function () {
    var changed = false;
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if (bar.width !== this.bar_width) {
            changed = true;
            bar.width += (this.bar_width - bar.width) * 0.05;
            if (Math.abs(bar.width - this.bar_width) < 0.6) {
                bar.width = this.bar_width;
            }
        }
    }
    return changed;
};

Graphtacular.prototype.animateHeight = function() {
    var changed = false;
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if (bar.height != bar.value) {
            changed = true;
            bar.height += (bar.value - bar.height) * 0.05;
            if (Math.abs(bar.height - bar.value) < 0.6) {
                bar.height = bar.value;
            }
        }
    };
    return changed;
};

//TODO: Do a better job at normalizing bar heights when < canvas height
//TODO: __defineGetter__ and __defineSetter__ are apparently depricated
function Bar (graph, label, value) {
    this.width = graph.bar_width;
    this.value = value;
    this.label = label;
    this.height = 0;
}