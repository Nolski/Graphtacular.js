function Graphtacular (context, options) {
    this._context = context;
    this.data = (options.data || []);
    this.bar_padding = 10;
    this.bar_width = 0;
    this.animate();
    this.bars = [];
    this.animateId;
}

Graphtacular.prototype.addBars = function(bars) {
    bars.forEach(function (bar) {
        this.bars.push(new Bar(this, bar.label, bar.value, 0));
    });
    this.animate();
}

Graphtacular.prototype.changeBar = function(bar_name, value) {
    for (var i = 0; i < this.bars.length; i++) {
        var bar = this.bars[i];
        if(bar.label == bar_name) {
            bar.value = value;
        }
    }
    animate();
};

Graphtacular.prototype.animate = function (label, value) {
    console.log(this);
    this.bar_width = (this._context.canvas.width / this.bars.length) - this.bar_padding;
    this.animateWidth();


    canvas.width = canvas.width;
    var x = this.bar_padding;
    //console.log(bar_width);
    this._context.fillStyle = "blue";
    for (var i = 0; i < this.data.length; i++) {
        var bar = this.data[i];
        var height = bar.value;
        var bar_height = this._context.canvas.height * (height / 100);
        bar_height = -Math.abs(bar_height);
        this._context.fillRect(x, 250, bar_width - this.bar_padding, bar_height);
        x += bar_width + this.bar_padding;
    };
}

//not working
Graphtacular.prototype.animateWidth = function (self) {
    var self = (self || this);
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
    if(changed) {
        return;
        window.cancelRequestAnimationFrame(self.animateId);
    }
    window.requestAnimationFrame(this.animateWidth(self))
}

function Bar (graph, label, value, height) {
    this.width = graph.bar_width;
}