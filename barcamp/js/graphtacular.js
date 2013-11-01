Array.max = function (array) {
    return Math.max.apply(Math, array);
};

function Graphtacular (context, options) {
    this._context = context;
    this._hovering = false;
    this.active_bar = null;
    this.mousePos = {x: 0, y:0};
    this.data = (options.data || []);
    this.bar_padding = 10;
    this.bar_width = 0;
    this.animateId;
    this.bars = null;
    this.max = -1;
    this.side_padding = 50;
    this.increment = 10;
    this.top_padding = 20;
    this.text_color = (options.text_color || '#000');
    this.bar_stroke = (options.bar_stroke || '#000');
    this.bar_line_width = (options.bar_line_width || 3);
    this.bar_alpha = (options.bar_alpha || 1.0);

    for(var i=0; i < this.data.length; i++) {
        this.bar_fill = this.getRandomColor();
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

    var self = this
    this._context.canvas.addEventListener('mousemove', function (evt) {
        self.mousePos = self.getMousePos(evt);
        self.checkHover();
    });
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

Graphtacular.prototype.getMousePos = function(evt) {
    var rect = this._context.canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

Graphtacular.prototype.getCanvasPoint = function(x, y) {
    var rect = this._context.canvas.getBoundingClientRect();
    return {
        x: x + rect.left,
        y: y + rect.top
    }
};

Graphtacular.prototype.addBars = function(bars) {
    var self = this;
    bars.forEach(function (bar) {
        if (self.bars == undefined) {
            self.bars = [];
        }
        self.bar_fill = self.getRandomColor();
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
        this._context.fillStyle = this.text_color;
        this._context.fillText(val, 0, y + 5);
    };
};

Graphtacular.prototype.drawFrame = function() {
    canvas.width = canvas.width;
    var x = this.side_padding + 10;
    var y = 0;
    var context = this._context;
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        this.drawBar(bar, x);
        this.drawKey(bar,y);
        x += bar.width+ this.bar_padding;
        y += 30;
    }
    this.drawContextBox();
};

Graphtacular.prototype.drawBar = function(bar, x) {
    var bar_height = this.getPixelHeight(bar.height);

    var context = this._context;
    //Draw bar
    context.fillStyle = bar.color;
    context.strokeStyle = bar.stroke;
    context.lineWidth = bar.line_width;
    context.stroke();
    context.fillRect(x, context.canvas.height - 10 - bar_height, bar.width, bar_height);
    context.strokeRect(x, context.canvas.height - 10 - bar_height, bar.width, bar_height);
    bar.x = x;

};


Graphtacular.prototype.drawKey = function(bar,y){
    var context = this._context;
    context.fillStyle = bar.color;
    context.strokeStyle = bar.stroke;
    context.lineWidth = bar.line_width;
    context.fillRect(context.canvas.width - 30, y, 20, 20);
    context.strokeRect(context.canvas.width - 30, y, 20, 20);
    context.fillStyle = this.text_color;
    context.font = "16px Arial";
    context.fillText(bar.label,context.canvas.width - 100, y+18);
};


Graphtacular.prototype.drawLabel = function(bar, x) {
    var context = this._context;
    //Draw label
    context.fillStyle = this.text_color;
    context.font = 'Arial';
    context.save();
    context.translate(x - 1, context.canvas.height - 10);
    context.rotate(-Math.PI / 2);
    context.fillText(bar.label, 0, 0);
    context.restore();
};

Graphtacular.prototype.drawContextBox = function() {
    var context = this._context;

    if (this._hovering) {
        var label = this.active_bar.label,
            x_padding = 10,
            y_padding = 5;
        
        metrics = context.measureText(label);
        context.font = '16px Arial';
        context.textAlign = 'left';
        context.fillStyle = "#FFF";
        context.strokeStyle = "#202020";
        context.lineWidth = 3;
        context.font = 'Arial';
        context.rect(this.mousePos.x, this.mousePos.y, metrics.width + (x_padding * 2), 16 + (y_padding * 2));
        context.fill();
        context.stroke();
        context.fillStyle = '#202020';
        context.fillText(label, this.mousePos.x + x_padding, this.mousePos.y + 16 + y_padding);
    };
};

Graphtacular.prototype.checkHover = function() {
    for(var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i],
            bar_height = this.getPixelHeight(bar.height);
            bar_coords = {x: bar.x, y: this._context.canvas.height - 10 - bar_height},
            bar_coords.y = bar_coords.y;
        //console.log(i, bar_coords, this.mousePos, bar_height, bar.x);
        if (this.mousePos.x > bar_coords.x && this.mousePos.x < (bar_coords.x + this.bar_width)
            && this.mousePos.y < bar_coords.y + bar_height && this.mousePos.y > bar_coords.y ) {
            this.active_bar = this.bars[i];
            this._hovering = true;
            return i;
        }
    };
    this._hovering = false;
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


Graphtacular.prototype.getRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

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
