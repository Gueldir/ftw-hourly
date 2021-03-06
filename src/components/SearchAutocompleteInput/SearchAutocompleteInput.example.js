import React, { Component } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { propTypes } from '../../util/types';
import { Button } from '../../components';
import SearchAutocompleteInput from './SearchAutocompleteInput';

const identity = v => v;

const Form = props => {
  return (
    <FinalForm
      {...props}
      render={({ handleSubmit, pristine }) => {
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="search">Select search:</label>
            <Field name="search" format={identity} component={SearchAutocompleteInput} />
            <Button type="submit" style={{ marginTop: '24px' }} disabled={pristine}>
              Submit
            </Button>
          </form>
        );
      }}
    />
  );
};

const PlaceInfo = props => {
  const { place } = props;
  const { address, origin, bounds } = place;
  return (
    <div>
      <p>Submitted place:</p>
      <ul>
        <li>Address: {address}</li>
        <li>
          Coordinates: {origin.lat}, {origin.lng}
        </li>
        <li>Bounds?: {bounds ? 'yes' : 'no'}</li>
      </ul>
    </div>
  );
};

PlaceInfo.propTypes = { place: propTypes.place.isRequired };

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { search: {} };
  }
  render() {
    const onSubmit = values => {
      this.setState({ search: values.search });
    };
    const place = this.state.search.selectedPlace;
    return (
      <div>
        <p>
          Search for a place name or address, select on with mouse or keyboard, and submit the form.
        </p>
        <Form onSubmit={onSubmit} />
        {place ? <PlaceInfo place={place} /> : null}
      </div>
    );
  }
}

export const Empty = {
  component: FormContainer,
  group: 'custom inputs',
};
