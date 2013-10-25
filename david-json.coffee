(($, window) ->
  idCounter = 0
  currentOffset = 0
  class DavidJson

    templates = []

    controls = "<div style='';class='json-input-controls'><a class='controls-toggle'><span class='glyphicon glyphicon-wrench float-left'></span></a><div style='display: block;' class='json-input-controls-container'><button class='btn btn-success float-left controls-clone'>Clone</button><button class='btn btn-danger float-left controls-delete'> Delete</button></div></div></div>"


    templates['key-value'] = (key, value, offset, id) ->
        return "<div id=#{id} style='margin-left: #{offset}px;' class='key-value-row clearfix'><div class='json-input-container clearfix'><input value='#{key}' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><input value='#{value}' type='text' class='form-control json-input json-input-value'/>#{controls}<div style='display:none;' class='json-input-children-container'></div></div>"

    templates['key-object'] = (key, object, offset, id) ->
      return "<div id='#{id}' style='margin-left: #{offset}px;' class='key-object-row clearfix'><div class='json-input-container clearfix'><input value='#{key}' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><button class='btn btn-primary btn-default json-input-btn children-toggle'>Expand</button>#{controls}<div style='display: none;' class='json-input-children-container'></div></div>"

    templates['key-array'] = (key,array, offset, id) ->
      return "<div id='#{id}' style='margin-left: #{offset}px;' class='key-array-row clearfix'><div class='json-input-container clearfix'><input value='#{key}' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><button style='display: inline-block;display: none;' class='btn btn-default json-input-btn children-sort'>Reorder</button><button class='btn btn-primary btn-default json-input-btn children-toggle'>Expand</button>#{controls}<div style='display: none;' class='json-input-children-container'></div></div>"

    templates['array-index-object'] = (arrayIndex, object, offset, id) ->
      return "<div id='#{id}' style='margin-left: #{offset}px;' class='array-key-object-row clearfix'><div class='json-input-container clearfix'><input value='#{arrayIndex}' type='text' class='form-control json-input json-input-key'/><span class='float-left json-separator'>\==></span><span class='json-drag-icon glyphicon glyphicon-move float-left'></span><button class='btn btn-primary btn-default json-input-btn children-toggle'>Expand</button>#{controls}<div style='display: none;' class='json-input-children-container'></div></div>"


    defaults:
      offset: 30

    constructor: (el, options) ->
      @options = $.extend({}, @defaults, options)
      @$el = $(el)
      @loop @$el, @options.json, 0
      @$el
      
    # Unique id generator for views
    uniqueId: (prefix) ->
      id = ++idCounter + ""
      (if prefix then prefix + id else id)

    getOffset: ->
      currentOffset = currentOffset + @options.offset
      return currentOffset

    # Additional plugin methods go here
    getPrototype: (data) ->
      Object::toString.call(data).slice 8, -1

    dataType: (data) ->
      Undefined = undefined
      if data is null
        type = "null"
      else
        if data is Undefined
          type = "undefined"
        else
          prototype = @getPrototype(data)
          if (prototype is "Number") and isNaN(data)
            type = "NaN"
          else
            type = prototype
      return type.toLowerCase()

    loop: (el, options, offset) =>
      @getOffset()
      for k, v of options
        valType = @dataType v
        id = @uniqueId "row"
        unless (valType is 'array') or (valType is 'object')
          child = $(templates['key-value'](k, v, offset, id))
          child.attr 'data-type', valType
          el.append child
          typeSelect = el.parent().find '.json-select:first'
        else
          child =$(templates["key-#{valType}"]( k, v, offset, id))
          child.attr 'data-type', valType
          el.append child
          @childLoop id, v
      @setupEvents child

    setupEvents: (el) ->
      cloneButton = el.find '.controls-clone:first'
      deleteButton = el.find '.controls-delete:first'
      cloneButton.hover ->
        console.log 'why'


    selectType: (el, valType) ->
      elSelectType = el.find('.json-select:first')
      options = elSelectType.children 'option'
      for option in options
        opt = $(option)
        if ("#{opt.val()}" == "#{valType}")
          opt.attr('selected', true)

    childLoop: (id, options) =>
      parentEl = $("##{id}")
      parentChildContainer = parentEl.children('.json-input-children-container')
      @toggleEvents parentEl
      # parentChildContainer.show()
      @loop parentChildContainer, options, @options.offset

    clone: (el) ->
      console.log el
      
    delete: (el) ->
      console.log el

    toggleEvents: (el) ->
      childrenToggle = el.find '.children-toggle'
      controlsToggle = el.find '.controls-toggle'
      childrenToggle.on 'click', (e) ->
        e.stopImmediatePropagation()
        e.stopPropagation()
        # button element
        # sortButton = el.children().children('.children-sort')
        sortButton = {}
        button = el.children().children('.children-toggle')
        # child container
        container =  el.find '.json-input-children-container:first'
        # toggle the stat of the button and child container
        if @expanded
          if sortButton
            1 + 1
            # sortButton.hide()
          container.hide()
          button.removeClass 'btn-warning'
          button.html 'Expand'
        else
          if sortButton
            1 + 1
            # sortButton.show()
          container.show()
          button.addClass 'btn-warning'
          button.html 'Collapse'
        @expanded = not @expanded
        return true

    json: ->
      @object = {}
      topLevel = $('#editor').children()
      genObj = @objectLoop topLevel
      for key, value of genObj
        @object[key] = value
      return @object

    objectLoop: (elements) ->
      obj = {}
      for element in elements
        kv = @getKeyValue element
        obj[kv.key] = kv.value
      return obj

    arrayLoop: (elements) ->
      arr = []
      for element in elements
        kv = @getKeyValue element
        arr.push kv.value
      return arr

    getKeyValue: (element) ->
      obj = {}
      inputContainer = $(element).children('.json-input-container')
      key = inputContainer.children('.json-input-key').val()
      value = inputContainer.children('.json-input-value').val()
      type = @getValueType element
      if value is undefined
        if type is 'object'
          value = @objectLoop @getChildren element
        if type is 'array'
          value = @arrayLoop @getChildren element
      if type is 'number'
        value = parseInt value, 10
      if type is 'boolean'
        value = JSON.parse value
      obj.key = key
      obj.value = value
      return obj

    getChildren: (element) ->
      children = $(element).children('.json-input-children-container').children()
      return children

    getValueType: (element) ->
      type = $(element).attr 'data-type'
      return type


  # Define the plugin
  $.fn.extend davidJson: (option, args...) ->
    returnValue = null
    @each ->
      $this = $(this)
      data = $this.data('davidJson')

      if !data
        $this.data 'davidJson', (data = new DavidJson(this, option))
      if typeof option == 'string'
        returnValue = data[option].apply(data, args)

    unless returnValue
      returnValue = @

    return returnValue

) window.jQuery, window
