import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { maxLength, required, composeValidators } from '../../util/validators';
import { FieldSelect, InlineTextButton, FieldTextInput } from '../../components';

import css from './EditListingDescriptionForm.css';

const CERTIFICATE_MAX_LENGTH = 40;
const CERTIFICATE_MAX_QTY = 3;
const certified = [
  { key: '1', label: 'firstCertificate' },
  { key: '2', label: 'secondCertificate' },
  { key: '3', label: 'thirdCertificate' },
];

class CustomCertificateSelectFieldMaybe extends Component {
  constructor(props) {
    super(props);
    this.state = { certificates: [certified[0]], value: 'none' };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleAdd(event) {
    {this.state.certificates.length < CERTIFICATE_MAX_QTY &&
      this.setState({certificates: [...this.state.certificates, certified[this.state.certificates.length]]});
    }
  }

  handleRemove() {
    {this.state.certificates.length > 1 &&
      this.state.certificates.splice(this.state.certificates.length-1,1)
      this.setState({certificates: this.state.certificates})
    }
  }

  handleChange(values) {
    this.setState({value: values});
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      name,
      id,
      certificate,
      intl,
      onChange,
      ...rest
    } = this.props;
    /* eslint-disable no-unused-vars */

    const certificatesLabel = intl.formatMessage({
      id: 'EditListingDescriptionForm.certificatesLabel',
    });
    const certificatesRequiredMessage = intl.formatMessage({
      id: 'EditListingDescriptionForm.certificatesRequired',
    });
    const maxLengthMessage = intl.formatMessage(
      { id: 'EditListingDescriptionForm.maxLength' },
      {
        maxLength: CERTIFICATE_MAX_LENGTH,
      }
    );
    const maxLength40Message = maxLength(maxLengthMessage, CERTIFICATE_MAX_LENGTH);

    return certificate ? (
      <div>
        <FieldSelect className={css.certificate} name={name} id={id} label={certificatesLabel} onChange={this.handleChange}>
          {certificate.map(c => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </FieldSelect>
        {this.state.value !== 'none' && 
          this.state.certificates.map((certificate,index)=>{  
            const certificatesMessage = intl.formatMessage(
              { id: 'EditListingDescriptionForm.certificatesMessage' },
              {
                certificateNumber: index+1
              },
            );          
            const certificatesPlaceholderMessage = intl.formatMessage({
              id: 'EditListingDescriptionForm.certificatesPlaceholder'+certified[index].key,
            });
            return (   
                <FieldTextInput key={certificate.key}
                  id={certificate.label}
                  name={certificate.label}
                  className={css.description}
                  type="text"
                  label={certificatesMessage}
                  placeholder={certificatesPlaceholderMessage}                  
                  maxLength={CERTIFICATE_MAX_LENGTH}
                  validate={composeValidators(required(certificatesRequiredMessage), maxLength40Message)}
                  autoFocus
                />      
            );
          })
        }
        {this.state.value !== 'none' &&      
        <div>     
          <InlineTextButton type="button" className={css.buttonAddNew} onClick={() => this.handleRemove()} >
            <FormattedMessage id="EditListingDescriptionForm.removeCertificate" />
          </InlineTextButton>         
          <span> / </span>
          <InlineTextButton type="button" className={css.buttonAddNew} onClick={(e) => this.handleAdd(e)} >
            <FormattedMessage id="EditListingDescriptionForm.addCertificate" />
          </InlineTextButton> 
        </div>
        }
      </div>
    ) : null;
  }
}

export default CustomCertificateSelectFieldMaybe;
