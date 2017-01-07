import React, { PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import autoBind from '../utils/autoBind'
import noop from '../utils/noop'

function radioElement (p) {
  const iconClass = classNames('fa', {
    'fa-circle-o': !p.value,
    'fa-dot-circle-o': p.value
  })
  return <i className={iconClass} />
}

function checkBoxElement (p) {
  const iconClass = classNames('fa', {
    'fa-square-o': !p.value,
    'fa-check-square': p.value
  })
  return <i className={iconClass} />
}

function switchElement (prop) {
  const labelClass = classNames('toggle-icon-label', {
    'toggle-il-left': prop.value,
    'toggle-il-right': !prop.value
  })

  let iconLabelText

  if (prop.iconLabel && prop.iconLabel.length) {
    iconLabelText = prop.value ? prop.iconLabel[0] : prop.iconLabel[1]
  }
  return (
    <div className='toggle-wrapper'>
      <div className={labelClass}>{iconLabelText}</div>
      <div className='toggle-btn' />
    </div>
  )
}

export default class Toggle extends React.Component {
  constructor (props) {
    super(props)
    autoBind([
      'handleClick'
    ], this)
  }

  shouldComponentUpdate (nextProps) {
    return shallowCompare(this, nextProps)
  }

  getIconElement () {
    const {iconElement, type} = this.props
    if (typeof iconElement === 'function') return iconElement(this.props)
    if (type === 'radio') return radioElement(this.props)
    else if (type === 'checkbox') return checkBoxElement(this.props)
    else return switchElement(this.props)
  }

  handleClick () {
    this.props.onChange({
      name: this.props.name,
      value: !this.props.value
    })
  }

  isNormal () {
    return this.props.mode === 'normal'
  }

  render () {
    const {
      attributes,
      className,
      name,
      label,
      value,
      disabled,
      countElem,
      count,
      type
    } = this.props

    const mainClass = classNames('rf-toggle', type, className, name, {
      'toggle-disabled': disabled,
      'toggle-active': value,
      'toggle-tag': !this.isNormal()
    })

    return (
      <div
        {...attributes}
        className={mainClass}
        onClick={!disabled && this.handleClick}
      >
        {
          label && <div className='toggle-label'>
            {label}
            {count !== undefined && countElem(this.props)}
          </div>
        }
        {this.isNormal() && this.getIconElement()}
      </div>
    )
  }
}

Toggle.propTypes = {
  attributes: PropTypes.object,
  className: PropTypes.string,
  count: PropTypes.number,
  countElem: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  disabled: PropTypes.bool,
  iconElement: PropTypes.func,
  iconLabel: PropTypes.array,
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf([
    'before', 'after'
  ]),
  mode: PropTypes.oneOf(['normal', 'tag']),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.oneOf([
    'switch', 'radio', 'checkbox'
  ]),
  value: PropTypes.bool.isRequired
}

Toggle.defaultProps = {
  countElem (p) {
    return <span className='toggle-count'>({p.count})</span>
  },
  disabled: false,
  mode: 'normal',
  onChange: noop,
  type: 'switch',
  value: false
}
