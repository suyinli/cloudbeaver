/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { UserInfoResource } from '@cloudbeaver/core-authentication';
import { Loader, s, useResource } from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';

import { UserProfileService } from '../UserProfileService';
import { UserForm } from './UserForm';
import style from './UserProfileForm.m.css';

export const UserProfileForm = observer(function UserProfileForm() {
  const userProfileService = useService(UserProfileService);
  const userInfo = useResource(UserProfileForm, UserInfoResource, {
    key: undefined,
    includes: ['includeMetaParameters'] as const,
  });

  const close = useCallback(() => userProfileService.close(true), []);

  if (!userProfileService.formState) {
    return null;
  }

  return (
    <Loader className={s(style, { loader: true })} state={userInfo}>
      {() => userInfo.data && <UserForm user={userInfo.data} state={userProfileService.formState!} onClose={close} />}
    </Loader>
  );
});
