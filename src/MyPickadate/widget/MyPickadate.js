define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "MyPickadate/lib/jquery-1.11.2",
    // new
    "MyPickadate/lib/picker",
    "MyPickadate/lib/picker.date",
    "dojo/text!MyPickadate/widget/template/MyPickadate.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, Picker, DatePicker, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    return declare("MyPickadate.widget.MyPickadate", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        widgetBase: null,

        //modeler
        datetime: null,
        format: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            // get the target node from the widgetbase
            var $dpNode = $(".datepicker", this.domNode);

            // options for the datepicker
            var options = {
                format: this.format,
                onSet: lang.hitch(this, function(thingSet) {
                    // thingSet = {select: someNumber}
                    var newDateTime = thingSet.select;
                    this._contextObj.set(this.datetime, newDateTime);
                })
            };
            this.$dp = this._initDatepicker($dpNode, options);

            // get the date from the context
            var dateFromContext = this._contextObj.get(this.datetime);
            this._setDatepickerValue(dateFromContext);

            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        /**
         * Set Datepicker Value
         * @param {number} value - the new value (in ms) for the datepicker
         */
        _setDatepickerValue: function(value) {
            this.$dp.set("select", value);
        },

        /**
         * Reset Subscriptions
         * ---
         * set the obj, attr, (and validation) subscriptions
         */
        _resetSubscriptions: function() {
            this.unsubscribeAll();
            // object subscription
            this.subscribe({
                guid: this._contextObj.getGuid(),
                callback: lang.hitch(this, function(guid) {
                    // should update the value in the picker
                    this._setDatepickerValue(this._contextObj.get(this.datetime));
                })
            });
            // attr subscription
            this.subscribe({
                guid: this._contextObj.getGuid(),
                attr: this.datetime,
                callback: lang.hitch(this, function(guid, attr, attrvalue) {
                    this._setDatepickerValue(attrvalue);
                })
            });
        },

        /**
         * Init Date Picker
         * @param {$clx} $el - jquery element to init the datepicker on
         * @param {object} options - options to pass to the pickadate initialization
         * @returns {$object} - handle for the jQuery datepicker object
         */
        _initDatepicker: function($el, options) {
            var $input = $el.pickadate(options);
            return $input.pickadate("picker");
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback);
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["MyPickadate/widget/MyPickadate"]);
