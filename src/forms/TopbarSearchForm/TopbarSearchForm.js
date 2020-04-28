import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes, { shape } from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl } from '../../util/reactIntl';
import { createResourceLocatorString } from '../../util/routes';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { Form, TopbarFilter } from '../../components';
import routeConfiguration from '../../routeConfiguration';
import { Field } from 'react-final-form';
import omit from 'lodash/omit';

import css from './TopbarSearchForm.css';

/*class TopbarSearchFormComponent extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.searchInput = null;
  }

  onChange(location) {
    if (location.selectedPlace) {
      // Note that we use `onSubmit` instead of the conventional
      // `handleSubmit` prop for submitting. We want to autosubmit
      // when a place is selected, and don't require any extra
      // validations for the form.
      this.props.onSubmit({ location });
      // blur search input to hide software keyboard
      if (this.searchInput) {
        this.searchInput.blur();
      }
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const { rootClassName, className, desktopInputRoot, intl, isMobile } = formRenderProps;

          const classes = classNames(rootClassName, className);
          const desktopInputRootClass = desktopInputRoot || css.desktopInputRoot;

          // Allow form submit only when the place has changed
          const preventFormSubmit = e => e.preventDefault();

          return (
            <Form className={classes} onSubmit={preventFormSubmit}>
              <Field
                name="location"
                format={identity}
                render={({ input, meta }) => {
                  const { onChange, ...restInput } = input;

                  // Merge the standard onChange function with custom behaviur. A better solution would
                  // be to use the FormSpy component from Final Form and pass this.onChange to the
                  // onChange prop but that breaks due to insufficient subscription handling.
                  // See: https://github.com/final-form/react-final-form/issues/159
                  const searchOnChange = value => {
                    onChange(value);
                    this.onChange(value);
                  };

                  const searchInput = { ...restInput, onChange: searchOnChange };
                  return (
                    <LocationAutocompleteInput
                      className={isMobile ? css.mobileInputRoot : desktopInputRootClass}
                      iconClassName={isMobile ? css.mobileIcon : css.desktopIcon}
                      inputClassName={isMobile ? css.mobileInput : css.desktopInput}
                      predictionsClassName={
                        isMobile ? css.mobilePredictions : css.desktopPredictions
                      }
                      predictionsAttributionClassName={
                        isMobile ? css.mobilePredictionsAttribution : null
                      }
                      placeholder={intl.formatMessage({ id: 'TopbarSearchForm.placeholder' })}
                      closeOnBlur={!isMobile}
                      inputRef={node => {
                        this.searchInput = node;
                      }}
                      input={searchInput}
                      meta={meta}
                    />
                  );
                }}
              />
            </Form>
          );
        }}
      />
    );
  }
}*/

class TopbarSearchFormComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      rootClassName, 
      desktopInputRoot,
      className, 
      intl, 
      isMobile, 
      urlQueryParams,
      keywordFilter,
      handleSubmit,
      history,
    } = this.props

    // resolve initial value for a single value filter
    const initialValue = (queryParams, paramName) => {
      return queryParams[paramName];
    };

    // resolve initial values for a multi value filter
    const initialValues = (queryParams, paramName) => {
      return !!queryParams[paramName] ? queryParams[paramName].split(' ') : [];
    };

    const classes = classNames(rootClassName, className);
    const desktopInputRootClass = desktopInputRoot || css.desktopInputRoot;
    const initialKeyword = keywordFilter
      ? initialValue(urlQueryParams, keywordFilter.paramName)
      : null;

    const handleKeyword = (urlParam, values) => {
      const queryParams = values
        ? { ...urlQueryParams, [urlParam]: values }
        : omit(urlQueryParams, urlParam);

      history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
    }
    
    return (
      <TopbarFilter
        rootClassName={rootClassName}
        className={isMobile ? css.mobileInputRoot : desktopInputRootClass}
        iconClassName={isMobile ? css.mobileIcon : css.desktopIcon}
        inputClassName={isMobile ? css.mobileInput : css.desktopInput}
        id={'SearchFilters.keywordFilter'}
        name="keyword"
        urlParam={keywordFilter ? keywordFilter.paramName : "keywords"}
        onSubmit={handleKeyword}
        initialValues={initialKeyword}
      />
    );
  }
}

const { func, string, bool } = PropTypes;

TopbarSearchFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  desktopInputRoot: null,
  isMobile: false,
};

TopbarSearchFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  desktopInputRoot: string,
  onSubmit: func.isRequired,
  isMobile: bool,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const TopbarSearchForm = compose(
  withRouter,
  injectIntl)(TopbarSearchFormComponent);

export default TopbarSearchForm;
