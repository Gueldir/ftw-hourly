import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';
import { EditListingCategoryForm } from '../../forms';
import config from '../../config.js';

import css from './EditListingCategoryPanel.css';

const EditListingCategoryPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    disabled,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { publicData } = currentListing.attributes;

  const panelTitle = currentListing.id ? (
    <FormattedMessage
      id="EditListingCategoryPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingCategoryPanel.createListingTitle" />
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingCategoryForm
        className={css.form}
        initialValues={{ category: publicData.category, subcategories: publicData.subcategories }}
        onSubmit={values => {
          const { category, subcategories } = values;
          const updateValues = {
            publicData: {
              category, 
              subcategories,
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
        category={config.custom.category}
        listing={listing}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingCategoryPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingCategoryPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingCategoryPanel;