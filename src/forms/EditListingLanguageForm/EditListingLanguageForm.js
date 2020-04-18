import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button, FieldCheckboxGroup } from '../../components';
import { required } from '../../util/validators';

import css from './EditListingLanguageForm.css';

export const EditListingLanguageFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={fieldRenderProps => {
      const {
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateError,
        updateInProgress,
        languageOptions,
      } = fieldRenderProps;

      const languagePlaceholder = intl.formatMessage({
        id: 'EditListingLanguageForm.languagePlaceholder',
      });

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLanguageForm.updateFailed" />
        </p>
      ) : null;

      const languageRequired = required(
        intl.formatMessage({
          id: 'EditListingLanguageForm.languageRequired',
        })
      );

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}

          <FieldCheckboxGroup
            className={css.language}
            name="language"
            id="language"
            placeholder={languagePlaceholder}
            validate={languageRequired}
            options={languageOptions}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingLanguageFormComponent.defaultProps = {
  selectedPlace: null,
  updateError: null,
};

EditListingLanguageFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  languageOptions: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
};

export default compose(injectIntl)(EditListingLanguageFormComponent);