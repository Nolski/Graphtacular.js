//TODO: Write a scale or something
function Graphtacular (context, options) {
    this._context = context;
    this.data = (options.data || []);
    this.bar_padding = 10;
    this.bar_width = 0;
    this.animateId;
    this.bars = null;
    this.max = -1;
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
    self.bar_width = (self._context.canvas.width / self.bars.length) - self.bar_padding;
    var width_changed = self.animateWidth(),
        height_finished = true;
    if(!width_changed) {
        height_finished = self.animateHeight();
    }
    self.drawFrame();
    window.requestAnimationFrame(function () {
        self.animate(self);
    });
}

Graphtacular.prototype.drawFrame = function() {
    canvas.width = canvas.width;
    var x = this.bar_padding + 50;

    //TODO: Here is where we will set all of the graph styling
    this._context.fillStyle = "blue";
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        //var bar_height = this._context.canvas.height * (bar.height / 100); //TODO: What is this
        //bar_height = -Math.abs(bar_height);
        //console.log(bar_height);
        var bar_height = bar.height;
        console.log(-this._context.canvas.height);
        this._context.fillRect(x, this._context.canvas.height - bar_height, bar.width - this.bar_padding, bar_height);
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
    this.value = graph.getPixelHeight(value);
    this.label = label;
    this.height = 0;


    this.__defineSetter__('value', function (val) {
        value = graph.getPixelHeight(val);
    });
    this.__defineGetter__('value', function () {
        //return value;
        return graph.getPixelHeight(value);
    });
}

Bar.prototype.checkMax = function() {
    if (this.height == this.graph.max) {

    };
};