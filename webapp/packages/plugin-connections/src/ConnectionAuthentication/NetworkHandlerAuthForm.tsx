/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import styled from 'reshadow';

import { BASE_CONTAINERS_STYLES, Button, FieldCheckbox, GroupItem, GroupTitle, InputField, Textarea, UploadArea, useMapResource } from '@cloudbeaver/core-blocks';
import { NetworkHandlerResource } from '@cloudbeaver/core-connections';
import { useTranslate } from '@cloudbeaver/core-localization';
import { NetworkHandlerAuthType, NetworkHandlerConfigInput } from '@cloudbeaver/core-sdk';
import { useStyles } from '@cloudbeaver/core-theming';
import { getTextFileReadingProcess } from '@cloudbeaver/core-utils';

interface Props {
  id: string;
  networkHandlersConfig: NetworkHandlerConfigInput[];
  allowSaveCredentials?: boolean;
  disabled?: boolean;
}

export const NetworkHandlerAuthForm = observer<Props>(function NetworkHandlerAuthForm({ id, networkHandlersConfig, allowSaveCredentials, disabled }) {
  const translate = useTranslate();
  const handler = useMapResource(NetworkHandlerAuthForm, NetworkHandlerResource, id);

  if (!networkHandlersConfig.some(state => state.id === id)) {
    networkHandlersConfig.push({
      id,
      authType: NetworkHandlerAuthType.Password,
      userName: '',
      password: '',
      savePassword: false,
    });
  }

  const state = networkHandlersConfig.find(state => state.id === id)!;

  const handleKeyUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      throw new Error('File is not found');
    }

    const process = getTextFileReadingProcess(file);
    const key = await process.promise;

    if (key) {
      state.key = key;
    }
  };

  const keyAuth = state.authType === NetworkHandlerAuthType.PublicKey;
  const passwordLabel = keyAuth ? 'Passphrase' : translate(`connections_network_handler_${id}_password`, 'connections_network_handler_default_password');

  return styled(useStyles(BASE_CONTAINERS_STYLES))(
    <>
      <GroupTitle>{handler.data?.label || translate(`connections_network_handler_${id}_title`, 'connections_network_handler_default_title')}</GroupTitle>
      <InputField
        type="text"
        name="userName"
        state={state}
        disabled={disabled}
        mod='surface'
      >
        {translate(`connections_network_handler_${id}_user`, 'connections_network_handler_default_user')}
      </InputField>
      <InputField
        type="password"
        name="password"
        state={state}
        disabled={disabled}
        mod='surface'
      >
        {passwordLabel}
      </InputField>
      {keyAuth && (
        <>
          <Textarea
            name='key'
            state={state}
            disabled={disabled}
          >
            {translate('connections_network_handler_ssh_tunnel_private_key')}
          </Textarea>
          <GroupItem>
            <UploadArea
              accept='.txt, .ssh'
              reset
              disabled={disabled}
              onChange={handleKeyUpload}
            >
              <Button
                tag='div'
                mod={['outlined']}
              >
                {translate('ui_file')}
              </Button>
            </UploadArea>
          </GroupItem>
        </>
      )}
      {allowSaveCredentials && (
        <FieldCheckbox
          id={id + ' savePassword'}
          name="savePassword"
          state={state}
          label={translate('connections_connection_edit_save_credentials')}
          disabled={disabled}
        />
      )}
    </>
  );
});
