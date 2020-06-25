import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemUnitPriceMaybe = props => {
  const { transaction, unitType, intl } = props;

  const unitPurchase = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );
  
  const formattedUnitPrice = unitPurchase ? formatMoney(intl, unitPurchase.unitPrice) : null;
  const seats = unitPurchase ? (unitPurchase.lineTotal.amount / unitPurchase.unitPrice.amount) : null;

  return formattedUnitPrice ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.seatsUnit" />
      </span>
      <span className={css.itemValue}>
        <FormattedMessage id="BookingBreakdown.seats" values={{ seats }} />
      </span>
    </div>
  ) : null;
};

LineItemUnitPriceMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemUnitPriceMaybe;
