import React from 'react';
import { array, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionLevel = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.level ? publicData.level : [];
  const selectedConfigOptions = options.filter(o => selectedOptions.find(s => s === o.key));
  
  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.levelTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.level"
        //options={selectedConfigOptions} To not display the unchecked options
        options={options}
        selectedOptions={selectedOptions}
        threeColumns={options.length > 2}
      />
    </div>
  );
};

SectionLevel.propTypes = {
  options: array.isRequired,
  publicData: shape({
    selectedOptions: string,
  }).isRequired,
};

export default SectionLevel;