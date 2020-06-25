import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Modal } from '../../components';

import css from './MeetingModal.css';

const MeetingModal = props => {

  const {
    className,
    rootClassName,
    id,
    isOpen,
    onCloseModal,
    onManageDisableScrolling,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const buttonClose = true;

  return (
    <Modal
      id={id}
      containerClassName={classes}
      contentClassName={css.modalContent}
      isOpen={isOpen}
      buttonClose={buttonClose}
      onClose={onCloseModal}
      onManageDisableScrolling={onManageDisableScrolling}
      usePortal
    >
      <div id="jitsi" className={css.jitsi}>
      </div>
    </Modal>
  );
};

const { bool, string } = PropTypes;

MeetingModal.defaultProps = {
  className: null,
  rootClassName: null,
  reviewSent: false,
  sendReviewInProgress: false,
  sendReviewError: null,
};

MeetingModal.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  reviewSent: bool,
  sendReviewInProgress: bool,
  sendReviewError: propTypes.error,
};

export default injectIntl(MeetingModal);
