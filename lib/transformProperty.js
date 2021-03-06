const kababCase = require(`lodash.kebabcase`)
const SoftSetHook = require(`virtual-dom/virtual-hyperscript/hooks/soft-set-hook`)
const AttributeHook = require(`virtual-dom/virtual-hyperscript/hooks/attribute-hook`)
const CustomEventHook = require(`./CustomEventHook`)
const compact = require(`./compact`)

const IS_DATA_MATCHER = /^data[A-Z]/

const EMPTY_PROP = {
  isAttribute: false,
  isStandard: false,
  usePropertyHook: false,
  useAttributeHook: false,
  useCustomEventHook: false,
  canBeArrayOfStrings: false,
  hasBooleanValue: false,
}

module.exports = function transformProperty (props, key, value, property) {
  const _property = property || EMPTY_PROP
  let isDataAttribute = false
  let _value = value
  let _key

  if (_property.isStandard) {
    _key = _property.computed
  } else {
    isDataAttribute = IS_DATA_MATCHER.test(key)

    if (isDataAttribute) {
      _key = kababCase(key)
    }
  }

  if (_property.canBeArrayOfStrings && Array.isArray(value)) {
    _value = compact(value).join(` `)
  } else if (_property.hasBooleanValue && !value) {
    return props
  }

  if (_property.isAttribute || isDataAttribute) {
    props.attributes[_key] = _value
  } else if (_property.usePropertyHook) {
    props[_key] = new SoftSetHook(_value)
  } else if (_property.useCustomEventHook) {
    props[_key] = new CustomEventHook(_key, _value)
  } else if (_property.useAttributeHook) {
    props[_key] = new AttributeHook(_value)
  } else if (_property.isStandard) {
    props[_key] = _value
  }

  return props
}
