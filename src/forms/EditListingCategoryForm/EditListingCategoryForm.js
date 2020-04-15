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
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';

import css from './EditListingCategoryForm.css';

export const EditListingCategoryFormComponent = props => (
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
        listing,
        pristine,
        saveActionMsg,
        updated,
        updateError,
        updateInProgress,
        category,
      } = fieldRenderProps;

      const categoryPlaceholder = intl.formatMessage({
        id: 'EditListingCategoryForm.categoryPlaceholder',
      });

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCategoryForm.updateFailed" />
        </p>
      ) : null;

      const categoryRequired = required(
        intl.formatMessage({
          id: 'EditListingCategoryForm.categoryRequired',
        })
      );

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}

          <CustomCategorySelectFieldMaybe
            id="category"
            name="category"
            category={category}
            intl={intl}
            listing={listing}
            disabled={submitDisabled}
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

EditListingCategoryFormComponent.defaultProps = {
  selectedPlace: null,
  updateError: null,
};

EditListingCategoryFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  category: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
};

export default compose(injectIntl)(EditListingCategoryFormComponent);