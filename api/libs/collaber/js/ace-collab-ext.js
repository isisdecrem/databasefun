/**!
© 2016-2019 Convergence Labs, Inc.
@version 0.3.0
@license MIT
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ace"));
	else if(typeof define === 'function' && define.amd)
		define("AceCollabExt", ["ace"], factory);
	else if(typeof exports === 'object')
		exports["AceCollabExt"] = factory(require("ace"));
	else
		root["AceCollabExt"] = factory(root["ace"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(1));
__export(__webpack_require__(3));
__export(__webpack_require__(5));
__export(__webpack_require__(7));
__export(__webpack_require__(9));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var AceSelectionMarker_1 = __webpack_require__(2);
/**
 * Implements multiple colored selections in the ace editor.  Each selection is
 * associated with a particular user. Each user is identified by a unique id
 * and has a color associated with them.  The selection manager supports block
 * selection through multiple AceRanges.
 */
var AceMultiSelectionManager = /** @class */ (function () {
    /**
     * Constructs a new AceMultiSelectionManager that is bound to a particular
     * Ace EditSession instance.
     *
     * @param session
     *   The Ace EditSession to bind to.
     */
    function AceMultiSelectionManager(session) {
        this._selections = {};
        this._session = session;
    }
    /**
     * Adds a new collaborative selection.
     *
     * @param id
     *   The unique system identifier for the user associated with this selection.
     * @param label
     *   A human readable / meaningful label / title that identifies the user.
     * @param color
     *   A valid css color string.
     * @param ranges
     *   An array of ace ranges that specify the initial selection.
     */
    AceMultiSelectionManager.prototype.addSelection = function (id, label, color, ranges) {
        if (this._selections[id] !== undefined) {
            throw new Error("Selection with id already defined: " + id);
        }
        var marker = new AceSelectionMarker_1.AceSelectionMarker(this._session, id, label, color, ranges);
        this._selections[id] = marker;
        this._session.addDynamicMarker(marker, false);
    };
    /**
     * Updates the selection for a particular user.
     *
     * @param id
     *   The unique identifier for the user.
     * @param ranges
     *   The array of ranges that specify the selection.
     */
    AceMultiSelectionManager.prototype.setSelection = function (id, ranges) {
        var selection = this._getSelection(id);
        selection.setSelection(ranges);
    };
    /**
     * Clears the selection (but does not remove it) for the specified user.
     * @param id
     *   The unique identifier for the user.
     */
    AceMultiSelectionManager.prototype.clearSelection = function (id) {
        var selection = this._getSelection(id);
        selection.setSelection(null);
    };
    /**
     * Removes the selection for the specified user.
     * @param id
     *   The unique identifier for the user.
     */
    AceMultiSelectionManager.prototype.removeSelection = function (id) {
        var selection = this._selections[id];
        if (selection === undefined) {
            throw new Error("Selection not found: " + id);
        }
        // note: ace adds the id property to whatever marker you pass in.
        this._session.removeMarker(selection.id);
        delete this._selections[id];
    };
    /**
     * Removes all selections.
     */
    AceMultiSelectionManager.prototype.removeAll = function () {
        var _this = this;
        Object.getOwnPropertyNames(this._selections).forEach(function (key) {
            _this.removeSelection(_this._selections[key].selectionId());
        });
    };
    AceMultiSelectionManager.prototype._getSelection = function (id) {
        var selection = this._selections[id];
        if (selection === undefined) {
            throw new Error("Selection not found: " + id);
        }
        return selection;
    };
    return AceMultiSelectionManager;
}());
exports.AceMultiSelectionManager = AceMultiSelectionManager;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var AceSelectionMarker = /** @class */ (function () {
    function AceSelectionMarker(session, selectionId, label, color, ranges) {
        this._session = session;
        this._label = label;
        this._color = color;
        this._ranges = ranges || [];
        this._selectionId = selectionId;
        this._id = null;
        this._markerElement = document.createElement("div");
    }
    AceSelectionMarker.prototype.update = function (_, markerLayer, session, layerConfig) {
        var _this = this;
        while (this._markerElement.hasChildNodes()) {
            this._markerElement.removeChild(this._markerElement.lastChild);
        }
        this._ranges.forEach(function (range) {
            _this._renderRange(markerLayer, session, layerConfig, range);
        });
        this._markerElement.remove();
        markerLayer.elt("remote-selection", "");
        var parentNode = markerLayer.element.childNodes[markerLayer.i - 1] || markerLayer.element.lastChild;
        parentNode.appendChild(this._markerElement);
    };
    AceSelectionMarker.prototype.setSelection = function (ranges) {
        if (ranges === undefined || ranges === null) {
            this._ranges = [];
        }
        else if (ranges instanceof Array) {
            this._ranges = ranges;
        }
        else {
            this._ranges = [ranges];
        }
        this._forceSessionUpdate();
    };
    AceSelectionMarker.prototype.getLabel = function () {
        return this._label;
    };
    AceSelectionMarker.prototype.selectionId = function () {
        return this._selectionId;
    };
    AceSelectionMarker.prototype.markerId = function () {
        return this._id;
    };
    AceSelectionMarker.prototype._renderLine = function (bounds) {
        var div = document.createElement("div");
        div.className = "ace-multi-selection";
        div.style.backgroundColor = this._color;
        if (typeof bounds.height === "number") {
            div.style.height = bounds.height + "px";
        }
        if (typeof bounds.width === "number") {
            div.style.width = bounds.width + "px";
        }
        if (typeof bounds.top === "number") {
            div.style.top = bounds.top + "px";
        }
        if (typeof bounds.left === "number") {
            div.style.left = bounds.left + "px";
        }
        if (typeof bounds.bottom === "number") {
            div.style.bottom = bounds.bottom + "px";
        }
        if (typeof bounds.right === "number") {
            div.style.right = bounds.right + "px";
        }
        this._markerElement.append(div);
    };
    AceSelectionMarker.prototype._renderRange = function (markerLayer, session, layerConfig, range) {
        var screenRange = range.toScreenRange(session);
        var height = layerConfig.lineHeight;
        var top = markerLayer.$getTop(screenRange.start.row, layerConfig);
        var width = 0;
        var right = 0;
        var left = markerLayer.$padding + screenRange.start.column * layerConfig.characterWidth;
        if (screenRange.isMultiLine()) {
            // Render the start line
            this._renderLine({ height: height, right: right, top: top, left: left });
            // from start of the last line to the selection end
            top = markerLayer.$getTop(screenRange.end.row, layerConfig);
            width = screenRange.end.column * layerConfig.characterWidth;
            this._renderLine({ height: height, width: width, top: top, left: markerLayer.$padding });
            // all the complete lines
            height = (screenRange.end.row - screenRange.start.row - 1) * layerConfig.lineHeight;
            if (height < 0) {
                return;
            }
            top = markerLayer.$getTop(screenRange.start.row + 1, layerConfig);
            this._renderLine({ height: height, right: right, top: top, left: markerLayer.$padding });
        }
        else {
            width = (range.end.column - range.start.column) * layerConfig.characterWidth;
            this._renderLine({ height: height, width: width, top: top, left: left });
        }
    };
    AceSelectionMarker.prototype._forceSessionUpdate = function () {
        this._session._signal("changeBackMarker");
    };
    return AceSelectionMarker;
}());
exports.AceSelectionMarker = AceSelectionMarker;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var AceCursorMarker_1 = __webpack_require__(4);
/**
 * Implements multiple colored cursors in the ace editor.  Each cursor is
 * associated with a particular user. Each user is identified by a unique id
 * and has a color associated with them.  Each cursor has a position in the
 * editor which is specified by a 2-d row and column ({row: 0, column: 10}).
 */
var AceMultiCursorManager = /** @class */ (function () {
    /**
     * Constructs a new AceMultiCursorManager that is bound to a particular
     * Ace EditSession instance.
     *
     * @param session
     *   The Ace EditSession to bind to.
     */
    function AceMultiCursorManager(session) {
        this._cursors = {};
        this._session = session;
    }
    /**
     * Adds a new collaborative selection.
     *
     * @param id
     *   The unique system identifier for the user associated with this selection.
     * @param label
     *   A human readable / meaningful label / title that identifies the user.
     * @param color
     *   A valid css color string.
     * @param position
     *   A 2-d position or linear index indicating the location of the cursor.
     */
    AceMultiCursorManager.prototype.addCursor = function (id, label, color, position) {
        if (this._cursors[id] !== undefined) {
            throw new Error("Cursor with id already defined: " + id);
        }
        var marker = new AceCursorMarker_1.AceCursorMarker(this._session, id, label, color, position);
        this._cursors[id] = marker;
        this._session.addDynamicMarker(marker, true);
    };
    /**
     * Updates the selection for a particular user.
     *
     * @param id
     *   The unique identifier for the user.
     * @param position
     *   A 2-d position or linear index indicating the location of the cursor.
     */
    AceMultiCursorManager.prototype.setCursor = function (id, position) {
        var cursor = this._getCursor(id);
        cursor.setPosition(position);
    };
    /**
     * Clears the cursor (but does not remove it) for the specified user.
     *
     * @param id
     *   The unique identifier for the user.
     */
    AceMultiCursorManager.prototype.clearCursor = function (id) {
        var cursor = this._getCursor(id);
        cursor.setPosition(null);
    };
    /**
     * Removes the cursor for the specified user.
     *
     * @param id
     *   The unique identifier for the user.
     */
    AceMultiCursorManager.prototype.removeCursor = function (id) {
        var cursor = this._cursors[id];
        if (cursor === undefined) {
            throw new Error("Cursor not found: " + id);
        }
        // Note: ace adds an id field to all added markers.
        this._session.removeMarker(cursor.id);
        delete this._cursors[id];
    };
    /**
     * Removes all cursors.
     */
    AceMultiCursorManager.prototype.removeAll = function () {
        var _this = this;
        Object.getOwnPropertyNames(this._cursors).forEach(function (key) {
            _this.removeCursor(_this._cursors[key].cursorId());
        });
    };
    AceMultiCursorManager.prototype._getCursor = function (id) {
        var cursor = this._cursors[id];
        if (cursor === undefined) {
            throw new Error("Cursor not found: " + id);
        }
        return cursor;
    };
    return AceMultiCursorManager;
}());
exports.AceMultiCursorManager = AceMultiCursorManager;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/**
 * Represents a marker of a remote users cursor.
 */
var AceCursorMarker = /** @class */ (function () {
    /**
     * Constructs a new AceCursorMarker
     * @param session The Ace Editor Session to bind to.
     * @param cursorId the unique id of this cursor.
     * @param label The label to display over the cursor.
     * @param color The css color of the cursor
     * @param position The row / column coordinate of the cursor marker.
     */
    function AceCursorMarker(session, cursorId, label, color, position) {
        this._session = session;
        this._label = label;
        this._color = color;
        this._position = position ? this._convertPosition(position) : null;
        this._cursorId = cursorId;
        this._id = null;
        this._visible = false;
        this._tooltipTimeout = null;
        // Create the HTML elements
        this._markerElement = document.createElement("div");
        this._cursorElement = document.createElement("div");
        this._cursorElement.className = "ace-multi-cursor";
        this._cursorElement.style.background = this._color;
        this._markerElement.append(this._cursorElement);
        this._tooltipElement = document.createElement("div");
        this._tooltipElement.className = "ace-multi-cursor-tooltip";
        this._tooltipElement.style.background = this._color;
        this._tooltipElement.style.opacity = "0";
        this._tooltipElement.innerHTML = label;
        this._markerElement.append(this._tooltipElement);
    }
    /**
     * Called by Ace to update the rendering of the marker.
     *
     * @param _ The html to render, represented by an array of strings.
     * @param markerLayer The marker layer containing the cursor marker.
     * @param __ The ace edit session.
     * @param layerConfig
     */
    AceCursorMarker.prototype.update = function (_, markerLayer, __, layerConfig) {
        if (this._position === null) {
            return;
        }
        var screenPosition = this._session.documentToScreenPosition(this._position.row, this._position.column);
        var top = markerLayer.$getTop(screenPosition.row, layerConfig);
        var left = markerLayer.$padding + screenPosition.column * layerConfig.characterWidth;
        var height = layerConfig.lineHeight;
        var cursorTop = top + 2;
        var cursorHeight = height - 3;
        var cursorLeft = left;
        var cursorWidth = 2;
        this._cursorElement.style.height = cursorHeight + "px";
        this._cursorElement.style.width = cursorWidth + "px";
        this._cursorElement.style.top = cursorTop + "px";
        this._cursorElement.style.left = cursorLeft + "px";
        var toolTipTop = cursorTop - height;
        if (toolTipTop < 5) {
            toolTipTop = cursorTop + height - 1;
        }
        var toolTipLeft = cursorLeft;
        this._tooltipElement.style.top = toolTipTop - 2 + "px";
        this._tooltipElement.style.left = toolTipLeft - 2 + "px";
        // Remove the content node from whatever parent it might have now
        // and add it to the new parent node.
        this._markerElement.remove();
        markerLayer.elt("remote-cursor", "");
        var parentNode = markerLayer.element.childNodes[markerLayer.i - 1] || markerLayer.element.lastChild;
        parentNode.appendChild(this._markerElement);
    };
    /**
     * Sets the location of the cursor marker.
     * @param position The position of cursor marker.
     */
    AceCursorMarker.prototype.setPosition = function (position) {
        this._position = this._convertPosition(position);
        this._forceSessionUpdate();
        this._tooltipElement.style.opacity = "1";
        this._scheduleTooltipHide();
    };
    /**
     * Sets the marker to visible / invisible.
     *
     * @param visible true if the marker should be displayed, false otherwise.
     */
    AceCursorMarker.prototype.setVisible = function (visible) {
        var old = this._visible;
        this._visible = visible;
        if (old !== this._visible) {
            this._markerElement.style.visibility = visible ? "visible" : "hidden";
            this._forceSessionUpdate();
        }
    };
    /**
     * Determines if the marker should be visible.
     *
     * @returns true if the cursor should be visible, false otherwise.
     */
    AceCursorMarker.prototype.isVisible = function () {
        return this._visible;
    };
    /**
     * Gets the unique id of this cursor.
     * @returns the unique id of this cursor.
     */
    AceCursorMarker.prototype.cursorId = function () {
        return this._cursorId;
    };
    /**
     * Gets the id of the marker.
     * @returns The marker id.
     */
    AceCursorMarker.prototype.markerId = function () {
        return this._id;
    };
    /**
     * Gets the label of the marker.
     * @returns The marker"s label.
     */
    AceCursorMarker.prototype.getLabel = function () {
        return this._label;
    };
    AceCursorMarker.prototype._forceSessionUpdate = function () {
        this._session._signal("changeFrontMarker");
    };
    AceCursorMarker.prototype._convertPosition = function (position) {
        if (position === null) {
            return null;
        }
        else if (typeof position === "number") {
            return this._session.getDocument().indexToPosition(position, 0);
        }
        else if (typeof position.row === "number" && typeof position.column === "number") {
            return position;
        }
        throw new Error("Invalid position: " + position);
    };
    AceCursorMarker.prototype._scheduleTooltipHide = function () {
        var _this = this;
        if (this._tooltipTimeout !== null) {
            clearTimeout(this._tooltipTimeout);
        }
        this._tooltipTimeout = setTimeout(function () {
            _this._tooltipElement.style.opacity = "0";
            _this._tooltipTimeout = null;
        }, 2000);
    };
    return AceCursorMarker;
}());
exports.AceCursorMarker = AceCursorMarker;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var ace = __webpack_require__(6);
var AceRange;
if (ace.acequire !== undefined) {
    AceRange = ace.acequire("ace/range").Range;
}
else {
    AceRange = ace.require("ace/range").Range;
}
var AceRangeUtil = /** @class */ (function () {
    function AceRangeUtil() {
    }
    AceRangeUtil.rangeToJson = function (range) {
        return {
            start: {
                row: range.start.row,
                column: range.start.column
            },
            end: {
                row: range.end.row,
                column: range.end.column
            }
        };
    };
    AceRangeUtil.jsonToRange = function (range) {
        return new AceRange(range.start.row, range.start.column, range.end.row, range.end.column);
    };
    AceRangeUtil.rangesToJson = function (ranges) {
        return ranges.map(function (range) {
            return AceRangeUtil.rangeToJson(range);
        });
    };
    AceRangeUtil.jsonToRanges = function (ranges) {
        return ranges.map(function (range) {
            return AceRangeUtil.jsonToRange(range);
        });
    };
    AceRangeUtil.toJson = function (value) {
        if (Array.isArray(value)) {
            return AceRangeUtil.rangesToJson(value);
        }
        return AceRangeUtil.rangeToJson(value);
    };
    AceRangeUtil.fromJson = function (value) {
        if (Array.isArray(value)) {
            return AceRangeUtil.jsonToRanges(value);
        }
        return AceRangeUtil.jsonToRange(value);
    };
    return AceRangeUtil;
}());
exports.AceRangeUtil = AceRangeUtil;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var AceRadarViewIndicator_1 = __webpack_require__(8);
/**
 * Implements viewport awareness in the Ace Editor by showing where remote
 * users are scrolled too and where there cursor is in the document, even
 * if the cursor is not in view.
 */
var AceRadarView = /** @class */ (function () {
    /**
     * Constructs a new AceRadarView bound to the supplied element and editor.
     *
     * @param element
     *          The HTML Element that the AceRadarView should render to.
     * @param editor
     *          The Ace Editor to listen to events from.
     */
    function AceRadarView(element, editor) {
        this._container = null;
        if (typeof element === "string") {
            this._container = document.getElementById(element);
        }
        else {
            this._container = element;
        }
        this._container.style.position = "relative";
        this._views = {};
        this._editor = editor;
    }
    /**
     * Add a view indicator for a new remote user.
     *
     * @param id
     *          The unique id of the user.
     * @param label
     *          A text label to displace for the user.
     * @param color
     *          The color to render the indicator with.
     * @param viewRows
     *          The rows the user's viewport spans.
     * @param cursorRow
     *          The row that the user's cursor is on.
     */
    AceRadarView.prototype.addView = function (id, label, color, viewRows, cursorRow) {
        var indicator = new AceRadarViewIndicator_1.AceRadarViewIndicator(label, color, viewRows, cursorRow, this._editor);
        this._container.appendChild(indicator.element());
        indicator.update();
        this._views[id] = indicator;
    };
    /**
     * Determines if the AceRadarView has an indicator for this specified user.
     *
     * @param id
     *          The id of the user to check for.
     * @returns
     *   True if the AceRadarView has an indicator for this user, false otherwise.
     */
    AceRadarView.prototype.hasView = function (id) {
        return this._views[id] !== undefined;
    };
    /**
     * Sets the view row span for a particular user.
     *
     * @param id
     *          The id of the user to set the rows for.
     * @param rows
     *          The row range to set.
     */
    AceRadarView.prototype.setViewRows = function (id, rows) {
        var indicator = this._views[id];
        indicator.setViewRows(rows);
    };
    /**
     * Sets the cursor row for a particular user.
     *
     * @param id
     *          The id of the user to set the cursor row for.
     * @param row
     *          The row to set.
     */
    AceRadarView.prototype.setCursorRow = function (id, row) {
        var indicator = this._views[id];
        indicator.setCursorRow(row);
    };
    /**
     * Clears the view for a particular user, causing their indicator to disapear.
     * @param id
     *   The id of the user to clear.
     */
    AceRadarView.prototype.clearView = function (id) {
        var indicator = this._views[id];
        indicator.setCursorRow(null);
        indicator.setViewRows(null);
    };
    /**
     * Removes the view indicator for the specified user.
     * @param id
     *   The id of the user to remove the view indicator for.
     */
    AceRadarView.prototype.removeView = function (id) {
        var indicator = this._views[id];
        indicator.dispose();
        delete this._views[id];
    };
    return AceRadarView;
}());
exports.AceRadarView = AceRadarView;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var AceRadarViewIndicator = /** @class */ (function () {
    function AceRadarViewIndicator(label, color, viewRows, cursorRow, editor) {
        var _this = this;
        this._label = label;
        this._color = color;
        this._viewRows = viewRows;
        this._cursorRow = cursorRow;
        this._editor = editor;
        this._docLineCount = editor.getSession().getLength();
        this._editorListener = function () {
            var newLineCount = _this._editor.getSession().getLength();
            if (newLineCount !== _this._docLineCount) {
                _this._docLineCount = newLineCount;
                _this.update();
            }
        };
        this._editor.on("change", this._editorListener);
        this._scrollElement = document.createElement("div");
        this._scrollElement.className = "ace-radar-view-scroll-indicator";
        this._scrollElement.style.borderColor = this._color;
        this._scrollElement.style.background = this._color;
        // todo implement a custom tooltip for consistent presentation.
        this._scrollElement.title = this._label;
        this._scrollElement.addEventListener("click", function () {
            var middle = ((_this._viewRows.end - _this._viewRows.start) / 2) + _this._viewRows.start;
            _this._editor.scrollToLine(middle, true, false, function () { });
        }, false);
        this._cursorElement = document.createElement("div");
        this._cursorElement.className = "ace-radar-view-cursor-indicator";
        this._cursorElement.style.background = this._color;
        this._cursorElement.title = this._label;
        this._cursorElement.addEventListener("click", function () {
            _this._editor.scrollToLine(_this._cursorRow, true, false, function () { });
        }, false);
        this._wrapper = document.createElement("div");
        this._wrapper.className = "ace-radar-view-wrapper";
        this._wrapper.style.display = "none";
        this._wrapper.appendChild(this._scrollElement);
        this._wrapper.appendChild(this._cursorElement);
    }
    AceRadarViewIndicator.prototype.element = function () {
        return this._wrapper;
    };
    AceRadarViewIndicator.prototype.setCursorRow = function (cursorRow) {
        this._cursorRow = cursorRow;
        this.update();
    };
    AceRadarViewIndicator.prototype.setViewRows = function (viewRows) {
        this._viewRows = viewRows;
        this.update();
    };
    AceRadarViewIndicator.prototype.update = function () {
        if (!_isSet(this._viewRows) && !_isSet(this._cursorRow)) {
            this._wrapper.style.display = "none";
        }
        else {
            this._wrapper.style.display = null;
            var maxLine = this._docLineCount - 1;
            if (!_isSet(this._viewRows)) {
                this._scrollElement.style.display = "none";
            }
            else {
                var topPercent = Math.min(maxLine, this._viewRows.start) / maxLine * 100;
                var bottomPercent = 100 - (Math.min(maxLine, this._viewRows.end) / maxLine * 100);
                this._scrollElement.style.top = topPercent + "%";
                this._scrollElement.style.bottom = bottomPercent + "%";
                this._scrollElement.style.display = null;
            }
            if (!_isSet(this._cursorRow)) {
                this._cursorElement.style.display = "none";
            }
            else {
                var cursorPercent = Math.min(this._cursorRow, maxLine) / maxLine;
                var ratio = (this._wrapper.offsetHeight - this._cursorElement.offsetHeight) / this._wrapper.offsetHeight;
                var cursorTop = cursorPercent * ratio * 100;
                this._cursorElement.style.top = cursorTop + "%";
                this._cursorElement.style.display = null;
            }
        }
    };
    AceRadarViewIndicator.prototype.dispose = function () {
        this._wrapper.parentNode.removeChild(this._wrapper);
        this._editor.off("change", this._editorListener);
    };
    return AceRadarViewIndicator;
}());
exports.AceRadarViewIndicator = AceRadarViewIndicator;
function _isSet(value) {
    return value !== undefined && value !== null;
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var AceViewportUtil = /** @class */ (function () {
    function AceViewportUtil() {
    }
    AceViewportUtil.getVisibleIndexRange = function (editor) {
        var firstRow = editor.getFirstVisibleRow();
        var lastRow = editor.getLastVisibleRow();
        if (!editor.isRowFullyVisible(firstRow)) {
            firstRow++;
        }
        if (!editor.isRowFullyVisible(lastRow)) {
            lastRow--;
        }
        var startPos = editor.getSession().getDocument().positionToIndex({ row: firstRow, column: 0 }, 0);
        // todo, this should probably be the end of the row
        var endPos = editor.getSession().getDocument().positionToIndex({ row: lastRow, column: 0 }, 0);
        return {
            start: startPos,
            end: endPos
        };
    };
    AceViewportUtil.indicesToRows = function (editor, startIndex, endIndex) {
        var startRow = editor.getSession().getDocument().indexToPosition(startIndex, 0).row;
        var endRow = editor.getSession().getDocument().indexToPosition(endIndex, 0).row;
        return {
            start: startRow,
            end: endRow
        };
    };
    return AceViewportUtil;
}());
exports.AceViewportUtil = AceViewportUtil;


/***/ })
/******/ ]);
});