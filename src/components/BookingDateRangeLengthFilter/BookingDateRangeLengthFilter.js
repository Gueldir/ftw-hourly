import React, { Component } from 'react';
import { bool, func, number, object, string } from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';

import { FieldDateRangeController, FieldSelect, FilterPopup, FilterPlain } from '../../components';
import css from './BookingDateRangeLengthFilter.css';

export class BookingDateRangeLengthFilterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { dates: null };
    this.popupControllerRef = null;
    this.plainControllerRef = null;
  }

  render() {
    const {
      className,
      rootClassName,
      showAsPopup,
      initialDateValues: initialDateValuesRaw,
      initialDurationValue: initialDurationValueRaw,
      id,
      contentPlacementOffset,
      onSubmit,
      datesUrlParam,
      durationUrlParam,
      intl,
      ...rest
    } = this.props;

    const isDatesSelected = !!initialDateValuesRaw && !!initialDateValuesRaw.dates;
    const initialDateValues = isDatesSelected ? initialDateValuesRaw : { dates: null };

    // TODO: ???
    const initialDurationValue = initialDurationValueRaw;

    const startDate = isDatesSelected ? initialDateValues.dates.startDate : null;
    const endDate = isDatesSelected ? initialDateValues.dates.endDate : null;

    const format = {
      month: 'short',
      day: 'numeric',
    };

    const formattedStartDate = isDatesSelected ? intl.formatDate(startDate, format) : null;
    const formattedEndDate = isDatesSelected ? intl.formatDate(endDate, format) : null;

    const labelForPlain = isDatesSelected
      ? intl.formatMessage(
          { id: 'BookingDateRangeLengthFilter.labelSelectedPlain' },
          {
            dates: `${formattedStartDate} - ${formattedEndDate}`,
          }
        )
      : intl.formatMessage({ id: 'BookingDateRangeLengthFilter.labelPlain' });

    const labelForPopup = isDatesSelected
      ? intl.formatMessage(
          { id: 'BookingDateRangeLengthFilter.labelSelectedPopup' },
          {
            dates: `${formattedStartDate} - ${formattedEndDate}`,
          }
        )
      : intl.formatMessage({ id: 'BookingDateRangeLengthFilter.labelPopup' });

    const onClearPopupMaybe =
      this.popupControllerRef && this.popupControllerRef.onReset
        ? { onClear: () => this.popupControllerRef.onReset(null, null) }
        : {};

    const onCancelPopupMaybe =
      this.popupControllerRef && this.popupControllerRef.onReset
        ? { onCancel: () => this.popupControllerRef.onReset(startDate, endDate) }
        : {};

    const onClearPlainMaybe =
      this.plainControllerRef && this.plainControllerRef.onReset
        ? { onClear: () => this.plainControllerRef.onReset(null, null) }
        : {};

    const handleSubmit = (param, values) => {
      onSubmit(values);
    };

    const handleChange = (param, values) => {
      console.log('handleChange()', values);
      this.setState({ dates: values[datesUrlParam] });
    };

    const datesSelected = !!(initialDateValues.dates || this.state.dates);

    // ask selected filter value form Kaisa
    // duration slot values, min 60mins

    const initialValues = {
      ...initialDateValues,
      minDuration: initialDurationValue,
    };

    return showAsPopup ? (
      <FilterPopup
        className={className}
        rootClassName={rootClassName}
        popupClassName={css.popupSize}
        label={labelForPopup}
        isSelected={isDatesSelected}
        id={`${id}.popup`}
        showAsPopup
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        onChange={handleChange}
        {...onClearPopupMaybe}
        {...onCancelPopupMaybe}
        initialValues={initialValues}
        urlParam={datesUrlParam}
        {...rest}
      >
        <FieldDateRangeController
          name={datesUrlParam}
          controllerRef={node => {
            this.popupControllerRef = node;
          }}
        />
        <FieldSelect
          id="BookingDateRangeLengthFilter.duration"
          name={durationUrlParam}
          label="Minimum length"
          className={css.duration}
          disabled={!datesSelected}
        >
          <option value="0">Any length</option>
          <option value="60">1 hour</option>
          <option value="120">2 hours</option>
        </FieldSelect>
      </FilterPopup>
    ) : (
      <FilterPlain
        className={className}
        rootClassName={rootClassName}
        label={labelForPlain}
        isSelected={isDatesSelected}
        id={`${id}.plain`}
        liveEdit
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        {...onClearPlainMaybe}
        initialValues={initialValues}
        urlParam={datesUrlParam}
        {...rest}
      >
        <FieldDateRangeController
          name="dates"
          controllerRef={node => {
            this.plainControllerRef = node;
          }}
        />
      </FilterPlain>
    );
  }
}

BookingDateRangeLengthFilterComponent.defaultProps = {
  rootClassName: null,
  className: null,
  showAsPopup: true,
  liveEdit: false,
  initialDateValues: null,
  initialDurationValue: null,
  contentPlacementOffset: 0,
};

BookingDateRangeLengthFilterComponent.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  showAsPopup: bool,
  liveEdit: bool,
  datesUrlParam: string.isRequired,
  durationUrlParam: string.isRequired,
  onSubmit: func.isRequired,
  initialDateValues: object,
  initialDurationValue: number,
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

const BookingDateRangeLengthFilter = injectIntl(BookingDateRangeLengthFilterComponent);

export default BookingDateRangeLengthFilter;
