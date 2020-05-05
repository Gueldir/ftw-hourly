import React, { Component } from 'react';
import { array, arrayOf, bool, func, number, object, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { minutesBetween } from '../../util/dates';
import classNames from 'classnames';
import {
  TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY,
  txIsAccepted,
  txIsCanceled,
  txIsDeclined,
  txIsEnquired,
  txIsPaymentExpired,
  txIsPaymentPending,
  txIsRequested,
  txHasBeenDelivered,
} from '../../util/transaction';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import {
  ensureListing,
  ensureTransaction,
  ensureUser,
  userDisplayNameAsString,
} from '../../util/data';
import { isMobileSafari } from '../../util/userAgent';
import { formatMoney } from '../../util/currency';
import {
  AvatarLarge,
  BookingPanel,
  NamedLink,
  ReviewModal,
  MeetingModal,
  UserDisplayName,
} from '../../components';
import { SendMessageForm } from '../../forms';
import config from '../../config';

// These are internal components that make this file more readable.
import AddressLinkMaybe from './AddressLinkMaybe';
import BreakdownMaybe from './BreakdownMaybe';
import DetailCardHeadingsMaybe from './DetailCardHeadingsMaybe';
import DetailCardImage from './DetailCardImage';
import FeedSection from './FeedSection';
import SaleActionButtonsMaybe from './SaleActionButtonsMaybe';
import MeetingJoinButtonsMaybe from './MeetingJoinButtonsMaybe';
import PanelHeading, {
  HEADING_ENQUIRED,
  HEADING_PAYMENT_PENDING,
  HEADING_PAYMENT_EXPIRED,
  HEADING_REQUESTED,
  HEADING_ACCEPTED,
  HEADING_DECLINED,
  HEADING_CANCELED,
  HEADING_DELIVERED,
} from './PanelHeading';

import css from './TransactionPanel.css';

// Helper function to get display names for different roles
const displayNames = (currentUser, currentProvider, currentCustomer, intl) => {
  const authorDisplayName = <UserDisplayName user={currentProvider} intl={intl} />;
  const customerDisplayName = <UserDisplayName user={currentCustomer} intl={intl} />;

  let otherUserDisplayName = '';
  let otherUserDisplayNameString = '';
  const currentUserIsCustomer =
    currentUser.id && currentCustomer.id && currentUser.id.uuid === currentCustomer.id.uuid;
  const currentUserIsProvider =
    currentUser.id && currentProvider.id && currentUser.id.uuid === currentProvider.id.uuid;

  if (currentUserIsCustomer) {
    otherUserDisplayName = authorDisplayName;
    otherUserDisplayNameString = userDisplayNameAsString(currentProvider, '');
  } else if (currentUserIsProvider) {
    otherUserDisplayName = customerDisplayName;
    otherUserDisplayNameString = userDisplayNameAsString(currentCustomer, '');
  }

  return {
    authorDisplayName,
    customerDisplayName,
    otherUserDisplayName,
    otherUserDisplayNameString,
  };
};

export class TransactionPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMessageFormFocused: false,
      isReviewModalOpen: false,
      isMeetingModalOpen: false,
      reviewSubmitted: false,
      date: new Date()
    };

    this.isMobSaf = false;
    this.sendMessageFormName = 'TransactionPanel.SendMessageForm';

    this.onOpenReviewModal = this.onOpenReviewModal.bind(this);
    this.onOpenMeetingModal = this.onOpenMeetingModal.bind(this);
    this.onSubmitReview = this.onSubmitReview.bind(this);
    this.onSendMessageFormFocus = this.onSendMessageFormFocus.bind(this);
    this.onSendMessageFormBlur = this.onSendMessageFormBlur.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.scrollToMessage = this.scrollToMessage.bind(this);
    this.mobileAndTabletCheck = this.mobileAndTabletCheck.bind(this);
  }

  componentDidMount() {
    this.isMobSaf = isMobileSafari();
    this.currentDate = setInterval(
      () => this.tick(),
      10000
    );
  }

  onOpenReviewModal() {
    this.setState({ isReviewModalOpen: true });
  }

  onOpenMeetingModal() {
    let isMobile = this.mobileAndTabletCheck();
    if (!isMobile)
      this.setState({ isMeetingModalOpen: true });
  }

  componentWillUnmount() {  
    clearInterval(this.currentDate);
  }

  tick() {
    this.setState({date: new Date()});
  }

  onSubmitReview(values) {
    const { onSendReview, transaction, transactionRole } = this.props;
    const currentTransaction = ensureTransaction(transaction);
    const { reviewRating, reviewContent } = values;
    const rating = Number.parseInt(reviewRating, 10);
    onSendReview(transactionRole, currentTransaction, rating, reviewContent)
      .then(r => this.setState({ isReviewModalOpen: false, reviewSubmitted: true }))
      .catch(e => {
        // Do nothing.
      });
  }

  onSendMessageFormFocus() {
    this.setState({ sendMessageFormFocused: true });
    if (this.isMobSaf) {
      // Scroll to bottom
      window.scroll({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' });
    }
  }

  onSendMessageFormBlur() {
    this.setState({ sendMessageFormFocused: false });
  }

  onMessageSubmit(values, form) {
    const message = values.message ? values.message.trim() : null;
    const { transaction, onSendMessage } = this.props;
    const ensuredTransaction = ensureTransaction(transaction);

    if (!message) {
      return;
    }
    onSendMessage(ensuredTransaction.id, message)
      .then(messageId => {
        form.reset();
        this.scrollToMessage(messageId);
      })
      .catch(e => {
        // Ignore, Redux handles the error
      });
  }

  scrollToMessage(messageId) {
    const selector = `#msg-${messageId.uuid}`;
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }

  mobileAndTabletCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  render() {
    const {
      rootClassName,
      className,
      currentUser,
      transaction,
      totalMessagePages,
      oldestMessagePageFetched,
      messages,
      initialMessageFailed,
      savePaymentMethodFailed,
      fetchMessagesInProgress,
      fetchMessagesError,
      sendMessageInProgress,
      sendMessageError,
      sendReviewInProgress,
      sendReviewError,
      onFetchTimeSlots,
      onManageDisableScrolling,
      onShowMoreMessages,
      transactionRole,
      intl,
      onAcceptSale,
      onDeclineSale,
      acceptInProgress,
      declineInProgress,
      acceptSaleError,
      declineSaleError,
      onSubmitBookingRequest,
      monthlyTimeSlots,
      nextTransitions,
    } = this.props;

    const currentTransaction = ensureTransaction(transaction);
    const currentListing = ensureListing(currentTransaction.listing);
    const currentProvider = ensureUser(currentTransaction.provider);
    const currentCustomer = ensureUser(currentTransaction.customer);
    const isCustomer = transactionRole === 'customer';
    const isProvider = transactionRole === 'provider';

    const listingLoaded = !!currentListing.id;
    const listingDeleted = listingLoaded && currentListing.attributes.deleted;
    const iscustomerLoaded = !!currentCustomer.id;
    const isCustomerBanned = iscustomerLoaded && currentCustomer.attributes.banned;
    const isCustomerDeleted = iscustomerLoaded && currentCustomer.attributes.deleted;
    const isProviderLoaded = !!currentProvider.id;
    const isProviderBanned = isProviderLoaded && currentProvider.attributes.banned;
    const isProviderDeleted = isProviderLoaded && currentProvider.attributes.deleted;

    const stateDataFn = tx => {
      if (txIsEnquired(tx)) {
        const transitions = Array.isArray(nextTransitions)
          ? nextTransitions.map(transition => {
              return transition.attributes.name;
            })
          : [];
        const hasCorrectNextTransition =
          transitions.length > 0 && transitions.includes(TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY);
        return {
          headingState: HEADING_ENQUIRED,
          showBookingPanel: isCustomer && !isProviderBanned && hasCorrectNextTransition,
        };
      } else if (txIsPaymentPending(tx)) {
        return {
          headingState: HEADING_PAYMENT_PENDING,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txIsPaymentExpired(tx)) {
        return {
          headingState: HEADING_PAYMENT_EXPIRED,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txIsRequested(tx)) {
        return {
          headingState: HEADING_REQUESTED,
          showDetailCardHeadings: isCustomer,
          showSaleButtons: isProvider && !isCustomerBanned,
        };
      } else if (txIsAccepted(tx)) {
        return {
          headingState: HEADING_ACCEPTED,
          showDetailCardHeadings: isCustomer,
          showAddress: isCustomer,
          showMeetingButton: isCustomer || (isProvider && !isCustomerBanned),
        };
      } else if (txIsDeclined(tx)) {
        return {
          headingState: HEADING_DECLINED,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txIsCanceled(tx)) {
        return {
          headingState: HEADING_CANCELED,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txHasBeenDelivered(tx)) {
        return {
          headingState: HEADING_DELIVERED,
          showDetailCardHeadings: isCustomer,
          showAddress: isCustomer,
        };
      } else {
        return { headingState: 'unknown' };
      }
    };
    const stateData = stateDataFn(currentTransaction);

    const deletedListingTitle = intl.formatMessage({
      id: 'TransactionPanel.deletedListingTitle',
    });

    const {
      authorDisplayName,
      customerDisplayName,
      otherUserDisplayName,
      otherUserDisplayNameString,
    } = displayNames(currentUser, currentProvider, currentCustomer, intl);

    const { publicData, geolocation } = currentListing.attributes;
    const location = publicData && publicData.location ? publicData.location : {};
    const listingTitle = currentListing.attributes.deleted
      ? deletedListingTitle
      : currentListing.attributes.title;

    const unitType = config.bookingUnitType;
    const isNightly = unitType === LINE_ITEM_NIGHT;
    const isDaily = unitType === LINE_ITEM_DAY;

    const unitTranslationKey = isNightly
      ? 'TransactionPanel.perNight'
      : isDaily
      ? 'TransactionPanel.perDay'
      : 'TransactionPanel.perUnit';

    const price = currentListing.attributes.price;
    const bookingSubTitle = price
      ? `${formatMoney(intl, price)} ${intl.formatMessage({ id: unitTranslationKey })}`
      : '';

    const firstImage =
      currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

    const bookingRange = transaction.booking && transaction.booking.attributes;
    const minutes = bookingRange && bookingRange.start > this.state.date ? minutesBetween(this.state.date, bookingRange.start) : 0;
    const isSessionStarted = minutes <= 5 && this.state.date < bookingRange.end ? false : true;
    
    const loadMeetingRoom = () => {
      const isMobile = this.mobileAndTabletCheck();
      const roomId = currentProvider.attributes.profile.abbreviatedName + currentProvider.id.uuid.substring(currentProvider.id.uuid.length - 5, currentProvider.id.uuid.length);
      const roomPwd = currentTransaction.attributes.protectedData.roomPwd;
      const userName = currentUser.attributes.profile.displayName;
      const roomName = currentProvider.attributes.profile.displayName + "'s session"
      const domain = 'meet.jit.si';
      const moderator = isProvider && isProvider ? 'moderator' : null;
      const options = {
          roomName: roomId,
          parentNode: document.getElementById('jitsi'),
          interfaceConfigOverwrite: {
          filmStripOnly: false,
          SHOW_JITSI_WATERMARK: false,
          jwt: moderator,
        },
        configOverwrite: {
          disableKick: true,
          doNotStoreRoom: true,
          disableSimulcast: false,
          enableWelcomePage: true,
          enableUserRolesBasedOnToken: true,
          enableFeaturesBasedOnToken: true,
          lockRoomGuestEnabled: true,
          /*localRecording: {
            enabled: true,
            format: 'flac',
          }*/
        },
        userInfo: {
          displayName: userName
        },
        interfaceConfigOverwrite: {
          TOOLBAR_ALWAYS_VISIBLE: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: true,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          APP_NAME: 'Virtualhub session',
          NATIVE_APP_NAME: 'Virtualhub session',
          PROVIDER_NAME: roomName,
          LANG_DETECTION: true, // Allow i18n to detect the system language
          INVITATION_POWERED_BY: true,
          TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'chat', 'recording',
              'sharedvideo', 'settings',
              'videoquality',
              'tileview', 'download', 'help', 'mute-everyone', 'localrecording'
          ],
          SETTINGS_SECTIONS: [ 'devices', 'language', moderator ],
          VIDEO_LAYOUT_FIT: 'both',
          filmStripOnly: false,
          HIDE_KICK_BUTTON_FOR_GUESTS: true,
        }
      };

      if (isMobile) {
        const intent = "intent://meet.jit.si/"+encodeURI(options.roomName)+"#jitsi_meet_external_api_id=0&config.disableSimulcast=false&&config.doNotStoreRoom=true&config.enableWelcomePage=true&config.enableUserRolesBasedOnToken=true&config.enableFeaturesBasedOnToken=true&interfaceConfig.TOOLBAR_ALWAYS_VISIBLE=false&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=true&interfaceConfig.SHOW_BRAND_WATERMARK=false&interfaceConfig.SHOW_POWERED_BY=false&interfaceConfig.APP_NAME=%22Virtualhub%20session%22&interfaceConfig.NATIVE_APP_NAME=%22Virtualhub%20session%22&interfaceConfig.PROVIDER_NAME=%22"+encodeURI(options.interfaceConfigOverwrite.PROVIDER_NAME)+"%22&interfaceConfig.LANG_DETECTION=true&interfaceConfig.INVITATION_POWERED_BY=true&interfaceConfig.TOOLBAR_BUTTONS=%5B%22microphone%22%2C%22camera%22%2C%22closedcaptions%22%2C%22desktop%22%2C%22fullscreen%22%2C%22fodeviceselection%22%2C%22hangup%22%2C%22chat%22%2C%22recording%22%2C%22sharedvideo%22%2C%22settings%22%2C%22videoquality%22%2C%22tileview%22%2C%22download%22%2C%22help%22%2C%22mute-everyone%22%2C%22localrecording%22%5D&interfaceConfig.SETTINGS_SECTIONS=%5B%22devices%22%2C%22language%22%2Cnull%5D&interfaceConfig.VIDEO_LAYOUT_FIT=%22both%22&interfaceConfig.filmStripOnly=false&interfaceConfig.HIDE_KICK_BUTTON_FOR_GUESTS=true&userInfo.displayName=%22"+encodeURI(options.userInfo.displayName)+"%22#Intent;scheme=org.jitsi.meet;package=org.jitsi.meet;end"
        window.location.replace(intent);
      } else {
        const api = new window.JitsiMeetExternalAPI(domain, options);
        api.on('passwordRequired', () => {
          api.executeCommand('password', roomPwd);
        });
        api.on('videoConferenceJoined', () => {
          api.executeCommand('subject', roomName);
          api.executeCommand('password', roomPwd);
        });
        api.on('readyToClose', () => {
          this.setState({ isMeetingModalOpen: false });
          api.dispose();
        });
      }
    }

    const saleButtons = (
      <SaleActionButtonsMaybe
        showButtons={stateData.showSaleButtons}
        acceptInProgress={acceptInProgress}
        declineInProgress={declineInProgress}
        acceptSaleError={acceptSaleError}
        declineSaleError={declineSaleError}
        onAcceptSale={() => onAcceptSale(currentTransaction.id)}
        onDeclineSale={() => onDeclineSale(currentTransaction.id)}
      />
    );
    const meetingButton = (
      <MeetingJoinButtonsMaybe
        acceptInProgress={acceptInProgress}
        declineInProgress={declineInProgress}
        acceptSaleError={acceptSaleError}
        declineSaleError={declineSaleError}
        showButtons={stateData.showMeetingButton}
        onOpenMeetingModal={this.onOpenMeetingModal}
        loadMeetingRoom={loadMeetingRoom}
        buttonsDisabled={false}
      />
    );

    const showSendMessageForm =
      !isCustomerBanned && !isCustomerDeleted && !isProviderBanned && !isProviderDeleted;

    const sendMessagePlaceholder = intl.formatMessage(
      { id: 'TransactionPanel.sendMessagePlaceholder' },
      { name: otherUserDisplayNameString }
    );

    const sendingMessageNotAllowed = intl.formatMessage({
      id: 'TransactionPanel.sendingMessageNotAllowed',
    });

    const paymentMethodsPageLink = (
      <NamedLink name="PaymentMethodsPage">
        <FormattedMessage id="TransactionPanel.paymentMethodsPageLink" />
      </NamedLink>
    );

    const classes = classNames(rootClassName || css.root, className);

    return (
      <div className={classes}>
        <div className={css.container}>
          <div className={css.txInfo}>
            <DetailCardImage
              rootClassName={css.imageWrapperMobile}
              avatarWrapperClassName={css.avatarWrapperMobile}
              listingTitle={listingTitle}
              image={firstImage}
              provider={currentProvider}
              isCustomer={isCustomer}
              listingId={currentListing.id && currentListing.id.uuid}
              listingDeleted={listingDeleted}
            />
            {isProvider ? (
              <div className={css.avatarWrapperProviderDesktop}>
                <AvatarLarge user={currentCustomer} className={css.avatarDesktop} />
              </div>
            ) : null}

            <PanelHeading
              panelHeadingState={stateData.headingState}
              transactionRole={transactionRole}
              providerName={authorDisplayName}
              customerName={customerDisplayName}
              isCustomerBanned={isCustomerBanned}
              listingId={currentListing.id && currentListing.id.uuid}
              listingTitle={listingTitle}
              listingDeleted={listingDeleted}
            />

            <div className={css.bookingDetailsMobile}>
              <AddressLinkMaybe
                rootClassName={css.addressMobile}
                location={location}
                geolocation={geolocation}
                showAddress={stateData.showAddress}
              />
              <BreakdownMaybe transaction={currentTransaction} transactionRole={transactionRole} />
            </div>

            {savePaymentMethodFailed ? (
              <p className={css.genericError}>
                <FormattedMessage
                  id="TransactionPanel.savePaymentMethodFailed"
                  values={{ paymentMethodsPageLink }}
                />
              </p>
            ) : null}
            <FeedSection
              rootClassName={css.feedContainer}
              currentTransaction={currentTransaction}
              currentUser={currentUser}
              fetchMessagesError={fetchMessagesError}
              fetchMessagesInProgress={fetchMessagesInProgress}
              initialMessageFailed={initialMessageFailed}
              messages={messages}
              oldestMessagePageFetched={oldestMessagePageFetched}
              onOpenReviewModal={this.onOpenReviewModal}
              onOpenMeetingModal={this.onOpenMeetingModal}
              onShowMoreMessages={() => onShowMoreMessages(currentTransaction.id)}
              onCloseModal={() => this.setState({ isMeetingModalOpen: false })}
              totalMessagePages={totalMessagePages}
              currentDate={this.state.date}
            />
            {showSendMessageForm ? (
              <SendMessageForm
                formId={this.sendMessageFormName}
                rootClassName={css.sendMessageForm}
                messagePlaceholder={sendMessagePlaceholder}
                inProgress={sendMessageInProgress}
                sendMessageError={sendMessageError}
                onFocus={this.onSendMessageFormFocus}
                onBlur={this.onSendMessageFormBlur}
                onSubmit={this.onMessageSubmit}
              />
            ) : (
              <div className={css.sendingMessageNotAllowed}>{sendingMessageNotAllowed}</div>
            )}

            {stateData.showSaleButtons ? (
              <div className={css.mobileActionButtons}>{saleButtons}</div>
            ) : null}

            {stateData.showMeetingButton ? (
              <div className={css.mobileActionButtons}>{meetingButton}</div>
            ) : null}
          </div>

          <div className={css.asideDesktop}>
            <div className={css.detailCard}>
              <DetailCardImage
                avatarWrapperClassName={css.avatarWrapperDesktop}
                listingTitle={listingTitle}
                image={firstImage}
                provider={currentProvider}
                isCustomer={isCustomer}
                listingId={currentListing.id && currentListing.id.uuid}
                listingDeleted={listingDeleted}
              />

              <DetailCardHeadingsMaybe
                showDetailCardHeadings={stateData.showDetailCardHeadings}
                listingTitle={listingTitle}
                subTitle={bookingSubTitle}
                location={location}
                geolocation={geolocation}
                showAddress={stateData.showAddress}
              />
              {stateData.showBookingPanel ? (
                <BookingPanel
                  className={css.bookingPanel}
                  titleClassName={css.bookingTitle}
                  isOwnListing={false}
                  listing={currentListing}
                  title={listingTitle}
                  subTitle={bookingSubTitle}
                  authorDisplayName={authorDisplayName}
                  onSubmit={onSubmitBookingRequest}
                  onManageDisableScrolling={onManageDisableScrolling}
                  monthlyTimeSlots={monthlyTimeSlots}
                  onFetchTimeSlots={onFetchTimeSlots}
                />
              ) : null}
              <BreakdownMaybe
                className={css.breakdownContainer}
                transaction={currentTransaction}
                transactionRole={transactionRole}
              />

              {stateData.showSaleButtons ? (
                <div className={css.desktopActionButtons}>{saleButtons}</div>
              ) : null}
              {stateData.showMeetingButton ? (
                <div className={css.desktopActionButtons}>{meetingButton}</div>
              ) : null}
            </div>
          </div>
        </div>
        <ReviewModal
          id="ReviewOrderModal"
          isOpen={this.state.isReviewModalOpen}
          onCloseModal={() => this.setState({ isReviewModalOpen: false })}
          onManageDisableScrolling={onManageDisableScrolling}
          onSubmitReview={this.onSubmitReview}
          revieweeName={otherUserDisplayName}
          reviewSent={this.state.reviewSubmitted}
          sendReviewInProgress={sendReviewInProgress}
          sendReviewError={sendReviewError}
        />
        <MeetingModal
          id="ConnectMeetingModal"
          isOpen={this.state.isMeetingModalOpen}
          onCloseModal={() => this.setState({ isMeetingModalOpen: false })}
          onManageDisableScrolling={onManageDisableScrolling}
        />
      </div>
    );
  }
}

TransactionPanelComponent.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  acceptSaleError: null,
  declineSaleError: null,
  fetchMessagesError: null,
  initialMessageFailed: false,
  savePaymentMethodFailed: false,
  sendMessageError: null,
  sendReviewError: null,
  monthlyTimeSlots: null,
  nextTransitions: null,
};

TransactionPanelComponent.propTypes = {
  rootClassName: string,
  className: string,

  currentUser: propTypes.currentUser,
  transaction: propTypes.transaction.isRequired,
  totalMessagePages: number.isRequired,
  oldestMessagePageFetched: number.isRequired,
  messages: arrayOf(propTypes.message).isRequired,
  initialMessageFailed: bool,
  savePaymentMethodFailed: bool,
  fetchMessagesInProgress: bool.isRequired,
  fetchMessagesError: propTypes.error,
  sendMessageInProgress: bool.isRequired,
  sendMessageError: propTypes.error,
  sendReviewInProgress: bool.isRequired,
  sendReviewError: propTypes.error,
  onFetchTimeSlots: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onShowMoreMessages: func.isRequired,
  onSendMessage: func.isRequired,
  onSendReview: func.isRequired,
  onSubmitBookingRequest: func.isRequired,
  monthlyTimeSlots: object,
  nextTransitions: array,

  // Sale related props
  onAcceptSale: func.isRequired,
  onDeclineSale: func.isRequired,
  acceptInProgress: bool.isRequired,
  declineInProgress: bool.isRequired,
  acceptSaleError: propTypes.error,
  declineSaleError: propTypes.error,

  // from injectIntl
  intl: intlShape,
};

const TransactionPanel = injectIntl(TransactionPanelComponent);

export default TransactionPanel;
