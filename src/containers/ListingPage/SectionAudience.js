import React from 'react';
import { array, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionAudience = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.audience ? publicData.audience : [];
  const selectedConfigOptions = options.filter(o => selectedOptions.find(s => s === o.key));
  
  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.audienceTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.audience"
        //options={selectedConfigOptions} To not display the unchecked options
        options={options}
        selectedOptions={selectedOptions}
        fourColumns={options.length > 3}
      />
    </div>
  );
};

SectionAudience.propTypes = {
  options: array.isRequired,
  publicData: shape({
    selectedOptions: string,
  }).isRequired,
};

export default SectionAudience