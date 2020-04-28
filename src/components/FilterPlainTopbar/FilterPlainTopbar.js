import React, { Component } from 'react';
import { bool, func, node, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { TopbarFilterForm } from '../../forms';
import css from './FilterPlainTopbar.css';

class FilterPlainTopbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };

    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  handleChange(values) {
    const { onSubmit, urlParam } = this.props;
    onSubmit(urlParam, values);
  }

  handleClear() {
    const { onSubmit, onClear, urlParam } = this.props;

    if (onClear) {
      onClear();
    }

    onSubmit(urlParam, null);
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const {
      rootClassName,
      className,
      plainClassName,
      id,
      label,
      isSelected,
      children,
      initialValues,
      keepDirtyOnReinitialize,
      contentPlacementOffset,
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    const labelClass = isSelected ? css.filterLabelSelected : css.filterLabel;

    return (
      <TopbarFilterForm
        id={`${id}.form`}
        liveEdit
        contentPlacementOffset={contentPlacementOffset}
        onChange={this.handleChange}
        initialValues={initialValues}
        keepDirtyOnReinitialize={keepDirtyOnReinitialize}
      >
        {children}
      </TopbarFilterForm>
    );
  }
}

FilterPlainTopbarComponent.defaultProps = {
  rootClassName: null,
  className: null,
  plainClassName: null,
  initialValues: null,
  keepDirtyOnReinitialize: false,
};

FilterPlainTopbarComponent.propTypes = {
  rootClassName: string,
  className: string,
  plainClassName: string,
  id: string.isRequired,
  onSubmit: func.isRequired,
  isSelected: bool.isRequired,
  children: node.isRequired,
  initialValues: object,
  keepDirtyOnReinitialize: bool,

  // form injectIntl
  intl: intlShape.isRequired,
};

const FilterPlainTopbar = injectIntl(FilterPlainTopbarComponent);

export default FilterPlainTopbar;
