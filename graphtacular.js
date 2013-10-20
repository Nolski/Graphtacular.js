function Graphtacular (context, options) {
    this._context = context;
    this.data = (options.data || []);
    this.bar_padding = 10;
    this.bar_width = 0;
    this.animateId;
    this.bars = null;
    for(var i=0; i < this.data.length; i++) {
        var bar = this.data[i];
        if (this.bars == undefined) {
            this.bars = [];
        }
        this.bars.push(new Bar(this, bar.label, bar.value));
    };
    console.log(this.bars);
    this.animate(this);
}

Graphtacular.prototype.addBars = function(bars) {
    var self = this;
    bars.forEach(function (bar) {
        if (self.bars == undefined) {
            self.bars = [];
        }
        self.bars.push(new Bar(self, bar.label, bar.value, 0));
        console.log(self.bars);
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
    self.animateWidth();
    self.animateHeight();
    self.drawFrame();
    window.requestAnimationFrame(function () {
        self.animate(self);
    });
}

Graphtacular.prototype.drawFrame = function() {
    canvas.width = canvas.width;
    var x = this.bar_padding;
    this._context.fillStyle = "blue";
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        var height = bar.height;
        var bar_height = this._context.canvas.height * (height / 100);
        bar_height = -Math.abs(bar_height);
        this._context.fillRect(x, 250, bar.width - this.bar_padding, bar_height);
        x += bar.width+ this.bar_padding;
    }
}

Graphtacular.prototype.animateWidth = function () {
    var changed = false;
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if (bar.width != this.bar_width) {
            changed = true;
            bar.width += (this.bar_width - bar.width) * 0.5;
            if (Math.abs(bar.width - this.bar_width) < 2) {
                bar.width = this.bar_width;
            }
        }
    }
};

Graphtacular.prototype.animateHeight = function() {
    var changed = false;

    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if (bar.height != bar.value) {
            changed = true;
            bar.height += (bar.value - bar.height) * 0.05;
            if (Math.abs(bar.height - bar.value) < 0.05) {
                bar.height = bar.value;
            }
        }
    };

};

function Bar (graph, label, value) {
    this.width = graph.bar_width;
    this.value = value;
    this.height = 0;
}