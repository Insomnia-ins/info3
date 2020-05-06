/*jslint browser: true*/
/*global console, document*/
var Swipe = (function (document, console) {
    'use strict';
    var activeSwipe = null,
        startEvent = null,
        swipeElements = [],
        topElement = 0,
        defaultSettings = {
            selector: '.swipe',
            dropCallback: function (direction) {console.log(direction); },
            dropDistance: 100,
            yEnabled: true
        };

    /**
     * Starts the moving of the activeSwipe element
     * @param {event} event The onmousedown event
     */
    function beginTracking(event) {
        startEvent = event;
        activeSwipe = event.srcElement;
        topElement = ++topElement % swipeElements.length;
        activeSwipe.style.left = startEvent.pageX - startEvent.offsetX + 'px';
        activeSwipe.style.top = startEvent.pageY - startEvent.offsetY + 'px';
        activeSwipe.style.position = 'absolute';
        addEventListeners(swipeElements[topElement]);
    }

    /**
     * Track the activeSwipe element
     * @param {event} event The mousemove event
     */
    function track(event) {
        if (activeSwipe !== null) {
            activeSwipe.style.left = event.pageX - startEvent.offsetX + 'px';
            if(defaultSettings.yEnabled) activeSwipe.style.top = event.pageY - startEvent.offsetY + 'px';
        }
    }
    
    /**
     * Ends the moving of the activeSwipe element
     * @param {event} event The onmousedown event
     */
    function endTracking(event) {
        if (activeSwipe !== null) {
            if (event.clientX < startEvent.clientX - defaultSettings.dropDistance) {
                defaultSettings.dropCallback('left');
            }
            if (event.clientX > startEvent.clientX + defaultSettings.dropDistance) {
                defaultSettings.dropCallback('right');
            }

            resetSwipe();
            startEvent = null;
        }
    }

    /**
     * Resets all the values of the activeSwipe element
     */
    function resetSwipe() {
        activeSwipe.removeEventListener('mousedown', beginTracking);
        activeSwipe.removeEventListener('mousemove', track);
        activeSwipe.removeEventListener('mouseup', endTracking);
        activeSwipe.style.display = '';
        activeSwipe.style.position = '';
        activeSwipe.style.left = '';
        activeSwipe.style.top = '';
        activeSwipe = null;
    }
    
    /**
     * Adds the event listeners to the given swipe element
     * @param {element} element The element that the event listeners should be put on
     */
    function addEventListeners(currentElement) {
        currentElement.style.display = 'block';
        currentElement.addEventListener('mousedown', beginTracking);
        document.addEventListener('mousemove', track);
        document.addEventListener('mouseup', endTracking);
    }
    
    /**
     * Starts the swipe library
     * @param {string} selector The element containing the swipe elements
     * @param {object} settings Object with the settings override
     */
    function init(selector, settings) {
        defaultSettings.selector = selector || defaultSettings.selector;
        Object.assign(defaultSettings, settings || {});
        swipeElements = document.querySelector(defaultSettings.selector).children;
        if (swipeElements.length > 0) {
            addEventListeners(swipeElements[topElement]);
        }
    }
    
    return {
        init: init
    };
    
    
})(document, console);
