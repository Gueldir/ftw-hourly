import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { PrimaryButton } from '../../components';

import css from './TransactionPanel.css';

// Functional component as a helper to build ActionButtons for
// provider when state is preauthorized
const MeetingJoinButtonsMaybe = props => {
  const {
    className,
    rootClassName,
    showButtons,
    onOpenMeetingModal,
    loadMeetingRoom,
    buttonsDisabled
  } = props;

  const classes = classNames(rootClassName || css.actionButtons, className);

  return showButtons ? (
    <div className={classes}>
      <div className={css.actionButtonWrapper}>
        <PrimaryButton
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
