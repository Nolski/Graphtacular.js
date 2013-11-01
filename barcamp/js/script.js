'use strict';
var graph;

function init() {
	Reveal.initialize({

        // Display controls in the bottom right corner
        controls: true,

        // Display a presentation progress bar
        progress: true,

        // Push each slide change to the browser history
        history: false,

        // Enable keyboard shortcuts for navigation
        keyboard: true,

        // Enable touch events for navigation
        touch: true,

        // Enable the slide overview mode
        overview: true,

        // Vertical centering of slides
        center: true,

        // Loop the presentation
        loop: false,

        // Change the presentation direction to be RTL
        rtl: false,

        // Number of milliseconds between automatically proceeding to the
        // next slide, disabled when set to 0, this value can be overwritten
        // by using a data-autoslide attribute on your slides
        autoSlide: 0,

        // Enable slide navigation via mouse wheel
        mouseWheel: false,

        // Transition style
        transition: 'default', // default/cube/page/concave/zoom/linear/fade/none

        // Transition speed
        transitionSpeed: 'default', // default/fast/slow

        // Transition style for full page backgrounds
        backgroundTransition: 'default' // default/linear/none

    });

    window.addEventListener('keydown', function (e) {
        if(e.keyCode === 71) {
            showGraph();
        }
    });
}

function showGraph() {
    var context = document.getElementById('canvas').getContext('2d'),
        slide = document.getElementById('slide'),
        global_data = {},
        global_value = 'March';

    canvas.width = window.innerWidth - 340;
    canvas.height = window.innerHeight - 240;

    var jsonData = [{
        label: 'Label 1',
        value: 200
    }, {
        label: 'Label 2',
        value: 150
    }, {
        label: 'Label 3',
        value: 250
    }, {
        label: 'Label 4',
        value: 175
    }]

    var options = {
        'data':jsonData,
        //bar_fill: '#A8BDB0',
        bar_stroke: '#336666'
    };
    graph = new Graphtacular(context,options);
}

window.onload = init;