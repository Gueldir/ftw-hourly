import unionWith from 'lodash/unionWith';
import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { convertUnitToSubUnit, unitDivisor } from '../../util/currency';
import { formatDateStringToTz, getExclusiveEndDateWithTz } from '../../util/dates';
import config from '../../config';

// ================ Action types ================ //

export const SEARCH_LISTINGS_REQUEST = 'app/SearchPage/SEARCH_LISTINGS_REQUEST';
export const SEARCH_LISTINGS_SUCCESS = 'app/SearchPage/SEARCH_LISTINGS_SUCCESS';
export const SEARCH_LISTINGS_ERROR = 'app/SearchPage/SEARCH_LISTINGS_ERROR';

export const SEARCH_MAP_LISTINGS_REQUEST = 'app/SearchPage/SEARCH_MAP_LISTINGS_REQUEST';
export const SEARCH_MAP_LISTINGS_SUCCESS = 'app/SearchPage/SEARCH_MAP_LISTINGS_SUCCESS';
export const SEARCH_MAP_LISTINGS_ERROR = 'app/SearchPage/SEARCH_MAP_LISTINGS_ERROR';

export const SEARCH_MAP_SET_ACTIVE_LISTING = 'app/SearchPage/SEARCH_MAP_SET_ACTIVE_LISTING';

// ================ Reducer ================ //

const initialState = {
  pagination: null,
  searchParams: null,
  searchInProgress: false,
  searchListingsError: null,
  currentPageResultIds: [],
  searchMapListingIds: [],
  searchMapListingsError: null,
};

const resultIds = data => data.data.map(l => l.id);

const listingPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_LISTINGS_REQUEST:
      return {
        ...state,
        searchParams: payload.searchParams,
        searchInProgress: true,
        searchMapListingIds: [],
        searchListingsError: null,
      };
    case SEARCH_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        searchInProgress: false,
      };
    case SEARCH_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchInProgress: false, searchListingsError: payload };

    case SEARCH_MAP_LISTINGS_REQUEST:
      return {
        ...state,
        searchMapListingsError: null,
      };
    case SEARCH_MAP_LISTINGS_SUCCESS: {
      const searchMapListingIds = unionWith(
        state.searchMapListingIds,
        resultIds(payload.data),
        (id1, id2) => id1.uuid === id2.uuid
      );
      return {
        ...state,
        searchMapListingIds,
      };
    }
    case SEARCH_MAP_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchMapListingsError: payload };

    case SEARCH_MAP_SET_ACTIVE_LISTING:
      return {
        ...state,
        activeListingId: payload,
      };
    default:
      return state;
  }
};

export default listingPageReducer;

// ================ Action creators ================ //

export const searchListingsRequest = searchParams => ({
  type: SEARCH_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const searchListingsSuccess = response => ({
  type: SEARCH_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const searchListingsError = e => ({
  type: SEARCH_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const searchMapListingsRequest = () => ({ type: SEARCH_MAP_LISTINGS_REQUEST });

export const searchMapListingsSuccess = response => ({
  type: SEARCH_MAP_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const searchMapListingsError = e => ({
  type: SEARCH_MAP_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const searchListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchListingsRequest(searchParams));

  const priceSearchParams = priceParam => {
    const inSubunits = value =>
      convertUnitToSubUnit(value, unitDivisor(config.currencyConfig.currency));
    const values = priceParam ? priceParam.split(',') : [];
    return priceParam && values.length === 2
      ? {
          price: [inSubunits(values[0]), inSubunits(values[1]) + 1].join(','),
        }
      : {};
  };

  const availabilityParams = (datesParam, minDurationParam) => {
    const dateValues = datesParam ? datesParam.split(',') : [];
    const hasDateValues = datesParam && dateValues.length === 2;
    const startDate = hasDateValues ? dateValues[0] : null;
    const endDate = hasDateValues ? dateValues[1] : null;

    const minDurationMaybe =
      minDurationParam && Number.isInteger(minDurationParam) && hasDateValues
        ? { minDuration: minDurationParam }
        : {};

    const timeZone = config.custom.dateRangeLengthFilterConfig.searchTimeZone;

    return hasDateValues
      ? {
          start: formatDateStringToTz(startDate, timeZone),
          end: getExclusiveEndDateWithTz(endDate, timeZone),

          // When we have `time-partial` value in the availability, the
          // API returns listings that don't necessarily have the full
          // start->end range available, but enough that the minDuration
          // (in minutes) can be fulfilled.
          //
          // See: https://www.sharetribe.com/api-reference/marketplace.html#availability-filtering
          availability: 'time-partial',

          ...minDurationMaybe,
        }
      : {};
  };
  const { perPage, price, dates, minDuration, keywords, pub_sport, pub_music, pub_art, ...rest } = searchParams;
  const priceMaybe = priceSearchParams(price);
  const availabilityMaybe = availabilityParams(dates, minDuration);
  const keywordsArray = keywords && [keywords.slice(",").split(" ")];
  const keywords_search = !pub_sport && !pub_music && !pub_art && keywords && "has_any:" + keywordsArray.join(",");
  const multi_sport = pub_sport && keywords ? ("has_any:" + pub_sport + "," + keywordsArray.join(",")) : pub_sport ? ("has_any:" + pub_sport) : null;
  const multi_music = pub_music && keywords ? ("has_any:" + pub_music + "," +  keywordsArray.join(",")) : pub_music ? ("has_any:" + pub_music) : null;
  const multi_art = pub_art && keywords ? ("has_any:" + pub_art + "," +  keywordsArray.join(",")) : pub_art ? ("has_any:" + pub_art) : null;

  const params = {
    ...rest,
    ...priceMaybe,
    ...availabilityMaybe,
    keywords: keywords,
    per_page: perPage,
    pub_sport: multi_sport,
    pub_music: multi_music,
    pub_art: multi_art,   
  };

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(searchListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(searchListingsError(storableError(e)));
      throw e;
    });
};

export const setActiveListing = listingId => ({
  type: SEARCH_MAP_SET_ACTIVE_LISTING,
  payload: listingId,
});

export const searchMapListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchMapListingsRequest(searchParams));

  const { perPage, ...rest } = searchParams;
  const params = {
    ...rest,
    per_page: perPage,
  };

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(searchMapListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(searchMapListingsError(storableError(e)));
      throw e;
    });
};
