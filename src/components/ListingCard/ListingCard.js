import React, { Component } from 'react';
import { array, string, func } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { NamedLink, ResponsiveImage } from '../../components';

import css from './ListingCard.css';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

const getCertificateInfo = (certificateConfig, key) => {
  return certificateConfig.find(c => c.key === key);
};

class ListingImage extends Component {
  render() {
    return <ResponsiveImage {...this.props} />;
  }
}
const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const {
    className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    certificateConfig,
    musicConfig,
    sportConfig,
    setActiveListing,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price, publicData } = currentListing.attributes;
  const author = currentListing.author.attributes.profile.displayName;
  const slug = createSlug(title);
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;
  /*const certificate = publicData
    ? getCertificateInfo(certificateConfig, publicData.certificate)
    : null;*/
  const { formattedPrice, priceTitle } = priceData(price, intl);

  const unitType = config.bookingUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;

  /*const maxElements = 3;
  const sport = publicData.sport.map(s => ( sportConfig.find(c => c.key === s)));
  const music = publicData.music.map(m => ( musicConfig.find(c => c.key === m)));*/

  const unitTranslationKey = isNightly
    ? 'ListingCard.perNight'
    : isDaily
    ? 'ListingCard.perDay'
    : 'ListingCard.perUnit';

  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
      <div
        className={css.threeToTwoWrapper}
        onMouseEnter={() => setActiveListing(currentListing.id)}
        onMouseLeave={() => setActiveListing(null)}
      >
        <div className={css.aspectWrapper}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
        </div>
      </div>
      <div className={css.info}>
        <div className={css.price}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          <div className={css.perUnit}>
            <FormattedMessage id={unitTranslationKey} />
          </div>
        </div>
        <div className={css.mainInfo}>
          <div className={css.title}>
            {richText(title, {
              longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
              longWordClass: css.longWord,
            })}
          </div>
          <div className={css.certificateInfo}>
            <FormattedMessage id="ListingCard.hostedBy" values={{ authorName: author }} />
            {/*sport.map((s, index) => (
              <span key={s.key} >
                {index < maxElements ? index < (sport.length - 1) && index < (maxElements - 1) ? (s.label + ", ") : s.label : ("…")}
              </span>
            ))}
            {music.map((m, index) => (
              <span key={m.key} >
                {index < maxElements ? index < (music.length - 1) && index < (maxElements - 1) ? (m.label + ", ") : m.label : ("…")}
              </span>
            ))}
            {certificate && !certificate.hideFromListingInfo ? (
              <span>
                <span className={css.separator}> • </span>
                <span>{certificate.label}</span>
              </span>
            ) : null*/}
          </div>
        </div>
      </div>
    </NamedLink>
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  certificateConfig: config.custom.certificate,
  musicConfig: config.custom.music,
  sportConfig: config.custom.sport,
  setActiveListing: () => null,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  certificateConfig: array,
  musicConfig: array,
  sportConfig: array,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCardComponent);
