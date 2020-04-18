import React from 'react';
import { FieldCheckboxGroup } from '../../components';
import { required } from '../../util/validators';
import config from '../../config';
import { ensureListing } from '../../util/data';

import css from './EditListingCategoryForm.css';

const CustomCategorySelectFieldMaybe = props => {
  const { category, intl, listing } = props;

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
