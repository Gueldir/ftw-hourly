import React from 'react';
import { FieldSelect } from '../../components';
import { required } from '../../util/validators';

import css from './EditListingDescriptionForm.css';

const CustomCertificateSelectFieldMaybe = props => {
  const { name, id, certificate, intl } = props;
  const certificateLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.certificateLabel',
  });
  const categoryPlaceholder = intl.formatMessage({
    id: 'EditListingDescriptionForm.certificatePlaceholder',
  });  
  const categoryRequired = required(
    intl.formatMessage({
      id: 'EditListingDescriptionForm.certificateRequired',
    })
  );

  return certificate ? (
    <FieldSelect className={css.certificate} name={name} id={id} label={certificateLabel} validate={categoryRequired}>
      <option disabled value="">
        {categoryPlaceholder}
      </option>
      {certificate.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomCertificateSelectFieldMaybe;
