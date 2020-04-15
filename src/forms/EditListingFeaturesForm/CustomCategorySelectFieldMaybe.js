import React, { Component } from 'react';
import { FieldSelect, FieldCheckboxGroup } from '../../components';
import { required, composeValidators } from '../../util/validators';
import config from '../../config';
import { ensureListing } from '../../util/data';

import css from './EditListingFeaturesForm.css';

class CustomCategorySelectFieldMaybe extends Component {
  constructor(props) {
    super(props);
    // If existing listing then initiate subcategories values from main category value
    let currentListing = ensureListing(props.listing);
    let { publicData } = currentListing.attributes; 
    let categories = publicData && publicData.category;
    let subCategories = categories ? config.custom[categories] : [];
    let buttonDisabled = categories ? false : true;
    this.state = { value: subCategories, buttonDisabled: buttonDisabled };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(values) {
    this.setState({value: config.custom[values]});
    this.setState({buttonDisabled: false});
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      name,
      id,
      category,
      disabled,
      intl,
      ...rest
    } = this.props;
    /* eslint-disable no-unused-vars */

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
    
    return category ? (
      <div>
        <FieldSelect
          className={css.category} 
          name={name} 
          id={id} 
          label={categoryLabel} 
          validate={categoryRequired} 
          onChange={this.handleChange}>
          <option disabled value="">
            {categoryPlaceholder}
          </option>
          {category.map(c => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </FieldSelect>
        <FieldCheckboxGroup
          className={css.category}
          name="subcategories"
          id="subcategories"
          validate={categoryRequired}
          options={this.state.value}
          buttonDisabled={this.state.buttonDisabled}
        />
      </div>
    ) : null;
  }
}

export default CustomCategorySelectFieldMaybe;

/* SUB-CATEGORY picking
<FieldSelect className={css.category} name="subcategories" id="subcategories" label={subCategoryLabel} validate={categoryRequired} buttonDisabled={this.state.buttonDisabled}>
  <option disabled value="">
    {subCategoryPlaceholder}
  </option>
  {this.state.value.map(c => (
    <option key={c.key} value={c.key}>
      {c.label}
    </option>
  ))}
</FieldSelect>
*/
