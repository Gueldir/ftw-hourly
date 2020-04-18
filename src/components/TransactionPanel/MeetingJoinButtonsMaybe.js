import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { PrimaryButton, SecondaryButton } from '../../components';

import css from './TransactionPanel.css';

// Functional component as a helper to build ActionButtons for
// provider when state is preauthorized
const MeetingJoinButtonsMaybe = props => {
  const {
    className,
    rootClassName,
    showButtons,
    acceptInProgress,
    declineInProgress,
    acceptSaleError,
    declineSaleError,
    onAcceptSale,
    onDeclineSale,
    onOpenMeetingModal,
    loadMeetingRoom,
    buttonsDisabled
  } = props;

  const classes = classNames(rootClassName || css.actionButtons, className);

  const acceptErrorMessage = acceptSaleError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.acceptSaleFailed" />
    </p>
  ) : null;
  const declineErrorMessage = declineSaleError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.declineSaleFailed" />
    </p>
  ) : null;

  return showButtons ? (
    <div className={classes}>
      <div className={css.actionErrors}>
        {acceptErrorMessage}
        {declineErrorMessage}
      </div>
      <div className={css.actionButtonWrapper}>
        <PrimaryButton
          inProgress={acceptInProgress}
          disabled={buttonsDisabled}
          onClick={() => { onOpenMeetingModal(); loadMeetingRoom(); }}
        >
          <FormattedMessage id="TransactionPanel.joinMeetingRoom" />
        </PrimaryButton>
      </div>
    </div>
  ) : null;
};

export default MeetingJoinButtonsMaybe;
