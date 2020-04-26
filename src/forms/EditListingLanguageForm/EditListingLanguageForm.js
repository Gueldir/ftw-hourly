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
        audienceOptions,
        levelOptions,
      } = fieldRenderProps;

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLanguageForm.updateFailed" />
        </p>
      ) : null;

      const languagePlaceholder = intl.formatMessage({
        id: 'EditListingLanguageForm.languagePlaceholder',
      });

      const languageRequired = required(
        intl.formatMessage({
          id: 'EditListingLanguageForm.languageRequired',
        })
      );

      const languageLabel = intl.formatMessage({
        id: 'EditListingLanguageForm.languageLabel',
      });

      const audiencePlaceholder = intl.formatMessage({
        id: 'EditListingLanguageForm.languagePlaceholder',
      });

      const audienceRequired = required(
        intl.formatMessage({
          id: 'EditListingLanguageForm.audienceRequired',
        })
      );

      const audienceLabel = intl.formatMessage({
        id: 'EditListingLanguageForm.audienceLabel',
      });

      const levelPlaceholder = intl.formatMessage({
        id: 'EditListingLanguageForm.languagePlaceholder',
      });

      const levelRequired = required(
        intl.formatMessage({
          id: 'EditListingLanguageForm.levelRequired',
        })
      );

      const levelLabel = intl.formatMessage({
        id: 'EditListingLanguageForm.levelLabel',
      });

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
            label={languageLabel} 
            placeholder={languagePlaceholder}
            validate={languageRequired}
            options={languageOptions}
            twoColumns={languageOptions.length > 1}
          />

          <FieldCheckboxGroup
            className={css.audience}
            name="audience"
            id="audience"
            label={audienceLabel} 
            placeholder={audiencePlaceholder}
            validate={audienceRequired}
            options={audienceOptions}
            twoColumns={audienceOptions.length > 1}
          />

          <FieldCheckboxGroup
            className={css.level}
            name="level"
            id="level"
            label={levelLabel} 
            placeholder={levelPlaceholder}
            validate={levelRequired}
            options={levelOptions}
            twoColumns={levelOptions.length > 1}
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
  audienceOptions: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
  levelOptions: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
};

export default compose(injectIntl)(EditListingLanguageFormComponent);