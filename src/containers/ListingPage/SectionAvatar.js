import React from 'react';
import { NamedLink, AvatarLarge, AvatarMedium } from '../../components';

import css from './ListingPage.css';

const SectionAvatar = props => {
  const { user, params } = props;
  return (
    <div className={css.sectionAvatar}>
      <NamedLink name="ListingPage" params={params} to={{ hash: '#host' }}>
        <AvatarLarge user={user} className={css.avatarDesktop} initialsClassName={css.initialsDesktop} disableProfileLink />
      </NamedLink>
      <NamedLink name="ListingPage" params={params} to={{ hash: '#host' }}>
        <AvatarMedium user={user} className={css.avatarMobile} disableProfileLink />
      </NamedLink>
    </div>
  );
};

export default SectionAvatar;
