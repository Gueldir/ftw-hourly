import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { LINE_ITEM_UNITS, propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemUnitsMaybe = props => {
  const { transaction, unitType } = props;

  if (unitType !== LINE_ITEM_UNITS) {
    return null;
  }

  const unitPurchase = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );

  if (!unitPurchase) {
    throw new Error(`LineItemUnitsMaybe: lineItem (${unitType}) missing`);
  }
  console.log(unitPurchase)
  const quantity = unitPurchase ? (unitPurchase.quantity / unitPurchase.seats) : null;

  return (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.quantityUnit" />
      </span>
      <span className={css.itemValue}>
        <FormattedMessage id="BookingBreakdown.quantity" values={{ quantity }} />
      </span>
    </div>
  );
};

LineItemUnitsMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
};

export default LineItemUnitsMaybe;
