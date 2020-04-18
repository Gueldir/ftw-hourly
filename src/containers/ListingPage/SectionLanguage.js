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
  const selectedConfigOptions = options.filter(o => selectedOptions.find(s => s === o.key));
  
  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.languageTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.language"
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={selectedConfigOptions > 5}
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