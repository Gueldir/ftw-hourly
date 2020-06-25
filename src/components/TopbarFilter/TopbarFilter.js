import React, { Component } from 'react';
import { func, number, string } from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from '../../util/reactIntl';
import debounce from 'lodash/debounce';
import { FieldSearchInput } from '../../components';

import IconHourGlass from './IconHourGlass';
import { FilterPlainTopbar } from '../../components';
import css from './TopbarFilter.css';

// When user types, we wait for new keystrokes a while before searching new content
const DEBOUNCE_WAIT_TIME = 600;
// Short search queries (e.g. 2 letters) have a longer timeout before search is made
const TIMEOUT_FOR_SHORT_QUERIES = 2000;

class TopbarFilter extends Component {
  constructor(props) {
    super(props);

    this.filter = null;
    this.filterContent = null;
    this.shortKeywordTimeout = null;
    this.mobileInputRef = React.createRef();

    this.positionStyleForContent = this.positionStyleForContent.bind(this);
  }

  componentWillUnmount() {
    window.clearTimeout(this.shortKeywordTimeout);
  }

  positionStyleForContent() {
    if (this.filter && this.filterContent) {
      // Render the filter content to the right from the menu
      // unless there's no space in which case it is rendered
      // to the left
      const distanceToRight = window.innerWidth - this.filter.getBoundingClientRect().right;
      const labelWidth = this.filter.offsetWidth;
      const contentWidth = this.filterContent.offsetWidth;
      const contentWidthBiggerThanLabel = contentWidth - labelWidth;
      const renderToRight = distanceToRight > contentWidthBiggerThanLabel;
      const contentPlacementOffset = this.props.contentPlacementOffset;

      const offset = renderToRight
        ? { left: contentPlacementOffset }
        : { right: contentPlacementOffset };
      // set a min-width if the content is narrower than the label
      const minWidth = contentWidth < labelWidth ? { minWidth: labelWidth } : null;

      return { ...offset, ...minWidth };
    }
    return {};
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      name,
      label,
      initialValues,
      contentPlacementOffset,
      onSubmit,
      iconClassName,
      inputClassName,
      urlParam,
      intl,
      showAsPopup,
      ...rest
    } = this.props;

    const rootClass = classNames(rootClassName || css.root, className);
    const iconClass = classNames(iconClassName || css.icon);
    const inputClass = classNames(inputClassName || css.input);


    const hasInitialValues = !!initialValues && initialValues.length > 0;
    const placeholder = intl.formatMessage({ id: 'TopbarFilter.placeholder' });

    const contentStyle = this.positionStyleForContent();

    // pass the initial values with the name key so that
    // they can be passed to the correct field
    const namedInitialValues = { [name]: initialValues };

    const handleSubmit = (urlParam, values) => {
      const usedValue = values ? values[name] : values;
      onSubmit(urlParam, usedValue);
    };

    const debouncedSubmit = debounce(handleSubmit, DEBOUNCE_WAIT_TIME, {
      leading: false,
      trailing: true,
    });
    // Use timeout for short queries and debounce for queries with any length
    const handleChangeWithDebounce = (urlParam, values) => {
      // handleSubmit gets urlParam and values as params.
      // If this field ("keyword") is short, create timeout
      const hasKeywordValue = values && values[name];
      const keywordValue = hasKeywordValue ? values && values[name] : '';
      // TBD: set an inputRef to handleSubmit(urlParam, values) so it grabs the last input and we can set back >= 1 below to >= 3
      if (urlParam && (!hasKeywordValue || (hasKeywordValue && keywordValue.length >= 3))) {
        if (this.shortKeywordTimeout) {
          window.clearTimeout(this.shortKeywordTimeout);
        }
        return debouncedSubmit(urlParam, values);
      } else if (this.mobileInputRef && this.mobileInputRef.current) {
        this.shortKeywordTimeout = window.setTimeout(() => {
          // if mobileInputRef exists, use the most up-to-date value from there
          return this.mobileInputRef && this.mobileInputRef.current
            ? handleSubmit(urlParam, { ...values, [name]: this.mobileInputRef.current.value })
            : null;
        }, TIMEOUT_FOR_SHORT_QUERIES);
      }
    };

    // Uncontrolled input needs to be cleared through the reference to DOM element.
    const handleClear = () => {
      if (this.mobileInputRef && this.mobileInputRef.current) {
        this.mobileInputRef.current.value = '';
      }
    };

    return (      
        <FilterPlainTopbar
          className={className}
          //rootClassName={rootClassName}
          isSelected={hasInitialValues}
          id={`${id}.plain`}
          liveEdit
          contentPlacementOffset={contentStyle}
          onSubmit={handleChangeWithDebounce}
          onClear={handleClear}
          initialValues={namedInitialValues}
          urlParam={urlParam}
          {...rest}
        >
          <div className={rootClass}>
            <div className={iconClass}>
              <IconHourGlass />
            </div>
            <FieldSearchInput
              className={inputClass}
              name={name}
              id={`${id}-input`}
              isUncontrolled
              inputRef={this.mobileInputRef}
              type="text"
              placeholder={placeholder}
              autoComplete="off"
            />
          </div>
        </FilterPlainTopbar>
    );
  }
}

TopbarFilter.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

TopbarFilter.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  name: string.isRequired,
  urlParam: string.isRequired,
  onSubmit: func.isRequired,
  initialValues: string,
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(TopbarFilter);
