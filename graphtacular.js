Array.max = function (array) {
    return Math.max.apply(Math, array);
};

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
    this.top_padding = 20;
    this.text_color = (options.text_color || '#000');
    this.bar_fill = (options.bar_fill || '#00FFFF');
    this.bar_stroke = (options.bar_stroke || '#000');
    this.bar_line_width = (options.bar_line_width || 3);
    this.bar_alpha = (options.bar_alpha || 1.0);

    for(var i=0; i < this.data.length; i++) {
        var bar = this.data[i];
        if (this.bars == undefined) {
            this.bars = [];
        }
        this.bars.push(
            new Bar(this, bar.label, bar.value, {
                bar_fill: this.bar_fill,
                bar_stroke: this.bar_stroke,
                line_width: this.bar_line_width
            })
        );
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

    height = Math.floor(height * (canvas_max / (this.max)));

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
            bar.value = parseInt(value);
        }
    }
};

Graphtacular.prototype.animate = function (self) {
    self.max = self.getHighestValue();
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
    var values = [];
    for (var i = 0; i < this.bars.length; i++) {
        bar = this.bars[i];
        values.push(bar.value);
    };

    return Array.max(values);
};

Graphtacular.prototype.drawAxis = function() {
    this._context.beginPath();
    this._context.moveTo(this.side_padding - 5, this.top_padding);
    this._context.lineTo(this.side_padding - 5, this._context.canvas.height - 10);
    this._context.lineWidth = 2;
    this._context.stroke();

    var increment =  this._context.canvas.height / this.increment,
        value_increment = Math.floor(this.getHighestValue() / this.increment);
    for (var i = 0; i < this.increment; i++) {
        var y = i * increment + this.top_padding,
            val = (this.increment - i) * value_increment;
        this._context.beginPath();
        this._context.moveTo(this.side_padding - 10, y);
        this._context.lineTo(this.side_padding, y);
        this._context.stroke();
        context.fillStyle = this.text_color;
        this._context.fillText(val, 0, y + 5);
    };
};

Graphtacular.prototype.drawFrame = function() {
    canvas.width = canvas.width;
    var x = this.side_padding;
    var context = this._context;
    //TODO: Here is where we will set all of the graph styling
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        this.drawBar(bar, x);
        this.drawLabel(bar, x);
        x += bar.width+ this.bar_padding;
    }
}

Graphtacular.prototype.drawBar = function(bar, x) {
    var bar_height = this.getPixelHeight(bar.height);
    //Draw bar
    context.fillStyle = bar.color;
    context.strokeStyle = bar.stroke;
    context.lineWidth = bar.line_width;
    context.stroke();
    context.fillRect(x, context.canvas.height - 10 - bar_height, bar.width, bar_height);
    context.strokeRect(x, context.canvas.height - 10 - bar_height, bar.width, bar_height);
    bar.x = x;

};

Graphtacular.prototype.drawLabel = function(bar, x) {
    //Draw label
    context.fillStyle = this.text_color;
    context.font = 'Arial';
    context.save();
    context.translate(x - 1, context.canvas.height - 10);
    context.rotate(-Math.PI / 2);
    context.fillText(bar.label, 0, 0);
    context.restore();
};

Graphtacular.prototype.checkHover = function(mousePos) {
    for(var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if (mousePos.x > bar.x && mousePos.x < (bar.x + this.bar_width)
            && mousePos.y > 0 && mousePos.y < bar.height ) {
            return i;
        };
    };
    return false;
};

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
        bar.height = parseInt(bar.height);
        bar.value = parseInt(bar.value);
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
    var options = (options || {});
    this.color = graph.bar_fill;
    this.stroke = graph.bar_stroke;
    this.alpha = graph.bar_alpha;
    this.width = graph.bar_width;
    this.value = value;
    this.label = label;
    this.height = 0;
    this.x = 0;
}
