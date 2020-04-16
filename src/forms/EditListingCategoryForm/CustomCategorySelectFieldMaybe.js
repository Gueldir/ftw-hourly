import React, { Component } from 'react';
import { FieldSelect, FieldCheckboxGroup } from '../../components';
import { required, composeValidators } from '../../util/validators';
import config from '../../config';
import { ensureListing } from '../../util/data';

import css from './EditListingCategoryForm.css';

const CustomCategorySelectFieldMaybe = props => {
  const { name, id, category, intl, listing } = props;

  const categoryLabel = intl.formatMessage({
      id: 'EditListingFeaturesForm.categoryLabel',
    });
    const subCategoryLabel = intl.formatMessage({
      id: 'EditListingFeaturesForm.subCategoryLabel',
    });
    const categoryPlaceholder = intl.formatMessage({
      id: 'EditListingFeaturesForm.categoryPlaceholder',
    });  
    const subCategoryPlaceholder = intl.formatMessage({
      id: 'EditListingFeaturesForm.subCategoryPlaceholder',
    });  
    const categoryRequired = required(
      intl.formatMessage({
        id: 'EditListingFeaturesForm.categoryRequired',
      })
    );

    const currentListing = ensureListing(listing);
    const { publicData } = currentListing.attributes; 
    const categories = publicData && publicData.category;
    const subCategories = categories ? config.custom[categories] : [];
    
    return category ? (
      <FieldCheckboxGroup
        className={css.category}
        name={categories}
        id={categories}
        validate={categoryRequired}
        options={subCategories}
        twoColumns={subCategories.length > 5}
      />
    ) : null;
};

export default CustomCategorySelectFieldMaybe;
