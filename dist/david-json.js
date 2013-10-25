(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  (function($, window) {
    var DavidJson, currentOffset, idCounter;
    idCounter = 0;
    currentOffset = 0;
    DavidJson = (function() {
      var controls, templates;

      templates = [];

      controls = "<div style='';class='json-input-controls'><a class='controls-toggle'><span class='glyphicon glyphicon-wrench float-left'></span></a><div style='display: block;' class='json-input-controls-container'><button class='btn btn-success float-left controls-clone'>Clone</button><button class='btn btn-danger float-left controls-delete'> Delete</button></div></div></div>";

      templates['key-value'] = function(key, value, offset, id) {
        return "<div id=" + id + " style='margin-left: " + offset + "px;' class='key-value-row clearfix'><div class='json-input-container clearfix'><input value='" + key + "' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><input value='" + value + "' type='text' class='form-control json-input json-input-value'/>" + controls + "<div style='display:none;' class='json-input-children-container'></div></div>";
      };

      templates['key-object'] = function(key, object, offset, id) {
        return "<div id='" + id + "' style='margin-left: " + offset + "px;' class='key-object-row clearfix'><div class='json-input-container clearfix'><input value='" + key + "' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><button class='btn btn-primary btn-default json-input-btn children-toggle'>Expand</button>" + controls + "<div style='display: none;' class='json-input-children-container'></div></div>";
      };

      templates['key-array'] = function(key, array, offset, id) {
        return "<div id='" + id + "' style='margin-left: " + offset + "px;' class='key-array-row clearfix'><div class='json-input-container clearfix'><input value='" + key + "' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><button style='display: inline-block;display: none;' class='btn btn-default json-input-btn children-sort'>Reorder</button><button class='btn btn-primary btn-default json-input-btn children-toggle'>Expand</button>" + controls + "<div style='display: none;' class='json-input-children-container'></div></div>";
      };

      templates['array-index-object'] = function(arrayIndex, object, offset, id) {
        return "<div id='" + id + "' style='margin-left: " + offset + "px;' class='array-key-object-row clearfix'><div class='json-input-container clearfix'><input value='" + arrayIndex + "' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><button class='btn btn-primary btn-default json-input-btn children-toggle'>Expand</button>" + controls + "<div style='display: none;' class='json-input-children-container'></div></div>";
      };

      DavidJson.prototype.defaults = {
        offset: 30
      };

      function DavidJson(el, options) {
        this.childLoop = __bind(this.childLoop, this);
        this.loop = __bind(this.loop, this);
        this.options = $.extend({}, this.defaults, options);
        this.$el = $(el);
        this.loop(this.$el, this.options.json, 0);
        this.$el;
      }

      DavidJson.prototype.uniqueId = function(prefix) {
        var id;
        id = ++idCounter + "";
        if (prefix) {
          return prefix + id;
        } else {
          return id;
        }
      };

      DavidJson.prototype.getOffset = function() {
        currentOffset = currentOffset + this.options.offset;
        return currentOffset;
      };

      DavidJson.prototype.getPrototype = function(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
      };

      DavidJson.prototype.dataType = function(data) {
        var Undefined, prototype, type;
        Undefined = void 0;
        if (data === null) {
          type = "null";
        } else {
          if (data === Undefined) {
            type = "undefined";
          } else {
            prototype = this.getPrototype(data);
            if ((prototype === "Number") && isNaN(data)) {
              type = "NaN";
            } else {
              type = prototype;
            }
          }
        }
        return type.toLowerCase();
      };

      DavidJson.prototype.loop = function(el, options, offset) {
        var child, id, k, typeSelect, v, valType;
        this.getOffset();
        for (k in options) {
          v = options[k];
          valType = this.dataType(v);
          id = this.uniqueId("row");
          if (!((valType === 'array') || (valType === 'object'))) {
            child = $(templates['key-value'](k, v, offset, id));
            child.attr('data-type', valType);
            el.append(child);
            typeSelect = el.parent().find('.json-select:first');
          } else {
            child = $(templates["key-" + valType](k, v, offset, id));
            child.attr('data-type', valType);
            el.append(child);
            this.childLoop(id, v);
          }
        }
        return this.setupEvents(child);
      };

      DavidJson.prototype.setupEvents = function(el) {
        var cloneButton, deleteButton;
        cloneButton = el.find('.controls-clone:first');
        deleteButton = el.find('.controls-delete:first');
        return cloneButton.hover(function() {
          return console.log('why');
        });
      };

      DavidJson.prototype.selectType = function(el, valType) {
        var elSelectType, opt, option, options, _i, _len, _results;
        elSelectType = el.find('.json-select:first');
        options = elSelectType.children('option');
        _results = [];
        for (_i = 0, _len = options.length; _i < _len; _i++) {
          option = options[_i];
          opt = $(option);
          if (("" + (opt.val())) === ("" + valType)) {
            _results.push(opt.attr('selected', true));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      DavidJson.prototype.childLoop = function(id, options) {
        var parentChildContainer, parentEl;
        parentEl = $("#" + id);
        parentChildContainer = parentEl.children('.json-input-children-container');
        this.toggleEvents(parentEl);
        return this.loop(parentChildContainer, options, this.options.offset);
      };

      DavidJson.prototype.clone = function(el) {
        return console.log(el);
      };

      DavidJson.prototype["delete"] = function(el) {
        return console.log(el);
      };

      DavidJson.prototype.toggleEvents = function(el) {
        var childrenToggle, controlsToggle;
        childrenToggle = el.find('.children-toggle');
        controlsToggle = el.find('.controls-toggle');
        return childrenToggle.on('click', function(e) {
          var button, container, sortButton;
          e.stopImmediatePropagation();
          e.stopPropagation();
          sortButton = {};
          button = el.children().children('.children-toggle');
          container = el.find('.json-input-children-container:first');
          if (this.expanded) {
            if (sortButton) {
              1 + 1;
            }
            container.hide();
            button.removeClass('btn-warning');
            button.html('Expand');
          } else {
            if (sortButton) {
              1 + 1;
            }
            container.show();
            button.addClass('btn-warning');
            button.html('Collapse');
          }
          this.expanded = !this.expanded;
          return true;
        });
      };

      DavidJson.prototype.json = function() {
        var genObj, key, topLevel, value;
        this.object = {};
        topLevel = $('#editor').children();
        genObj = this.objectLoop(topLevel);
        for (key in genObj) {
          value = genObj[key];
          this.object[key] = value;
        }
        return this.object;
      };

      DavidJson.prototype.objectLoop = function(elements) {
        var element, kv, obj, _i, _len;
        obj = {};
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          kv = this.getKeyValue(element);
          obj[kv.key] = kv.value;
        }
        return obj;
      };

      DavidJson.prototype.arrayLoop = function(elements) {
        var arr, element, kv, _i, _len;
        arr = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          kv = this.getKeyValue(element);
          arr.push(kv.value);
        }
        return arr;
      };

      DavidJson.prototype.getKeyValue = function(element) {
        var inputContainer, key, obj, type, value;
        obj = {};
        inputContainer = $(element).children('.json-input-container');
        key = inputContainer.children('.json-input-key').val();
        value = inputContainer.children('.json-input-value').val();
        type = this.getValueType(element);
        if (value === void 0) {
          if (type === 'object') {
            value = this.objectLoop(this.getChildren(element));
          }
          if (type === 'array') {
            value = this.arrayLoop(this.getChildren(element));
          }
        }
        if (type === 'number') {
          value = parseInt(value, 10);
        }
        if (type === 'boolean') {
          value = JSON.parse(value);
        }
        obj.key = key;
        obj.value = value;
        return obj;
      };

      DavidJson.prototype.getChildren = function(element) {
        var children;
        children = $(element).children('.json-input-children-container').children();
        return children;
      };

      DavidJson.prototype.getValueType = function(element) {
        var type;
        type = $(element).attr('data-type');
        return type;
      };

      return DavidJson;

    })();
    return $.fn.extend({
      davidJson: function() {
        var args, option, returnValue;
        option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        returnValue = null;
        this.each(function() {
          var $this, data;
          $this = $(this);
          data = $this.data('davidJson');
          if (!data) {
            $this.data('davidJson', (data = new DavidJson(this, option)));
          }
          if (typeof option === 'string') {
            return returnValue = data[option].apply(data, args);
          }
        });
        if (!returnValue) {
          returnValue = this;
        }
        return returnValue;
      }
    });
  })(window.jQuery, window);

}).call(this);
