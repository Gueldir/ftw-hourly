import React from 'react';
import { array, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionLanguage = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.language ? publicData.language : [];
  
  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.languageTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.language"
        //options={selectedConfigOptions} To not display the unchecked options
        options={options}
        selectedOptions={selectedOptions}
        threeColumns={options.length > 2}
      />
    </div>
  );
};

SectionLanguage.propTypes = {
  options: array.isRequired,
  publicData: shape({
    selectedOptions: string,
  }).isRequired,
};

export default SectionLanguage;