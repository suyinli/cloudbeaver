/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import styled, { css, use } from 'reshadow';

import { AdministrationScreenService } from '@cloudbeaver/core-administration';
import { UserInfoResource } from '@cloudbeaver/core-authentication';
import {
  SubmittingForm, TabsState, TabList, Tab, TabTitle, Loader, UNDERLINE_TAB_STYLES, ErrorMessage
} from '@cloudbeaver/core-blocks';
import { useController, useService } from '@cloudbeaver/core-di';
import { CommonDialogWrapper, DialogComponent } from '@cloudbeaver/core-dialogs';
import { useTranslate } from '@cloudbeaver/core-localization';
import { composes, useStyles } from '@cloudbeaver/core-theming';

import { AuthDialogController } from './AuthDialogController';
import { AuthDialogFooter } from './AuthDialogFooter';
import { AuthProviderForm } from './AuthProviderForm/AuthProviderForm';
import { ConfigurationsList } from './AuthProviderForm/ConfigurationsList';

const styles = composes(
  css`
    ErrorMessage {
      composes: theme-background-secondary theme-text-on-secondary from global;
    }
`,
  css`
    CommonDialogWrapper {
      min-height: 400px;
      min-width: 500px;
      max-width: min-content;
    }
    SubmittingForm {
      overflow: auto;
      &[|form] {
        margin: auto;
      }
    }
    SubmittingForm, AuthProviderForm {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    TabList {
      justify-content: center;
    }
    Tab {
      text-transform: uppercase;
      &:global([aria-selected=true]) {
        font-weight: 500 !important;
      }
    }
    AuthProviderForm {
      flex-direction: column;
      padding: 18px 24px;
    }
    ConfigurationsList {
      margin-top: 12px;
    }
    ErrorMessage {
      flex: 1;
    }
`);

interface IAuthPayload {
  provider: string | null;
  link?: boolean;
}

export const AuthDialog: DialogComponent<IAuthPayload, null> = observer(function AuthDialog({
  payload: {
    provider,
    link = false,
  },
  options,
  rejectDialog,
}) {
  const administrationScreenService = useService(AdministrationScreenService);
  const userInfo = useService(UserInfoResource);
  const controller = useController(AuthDialogController, link, rejectDialog);
  const translate = useTranslate();

  if (provider) {
    controller.selectProvider(provider);
  } else {
    controller.setAdminMode(administrationScreenService.activeScreen !== null);
  }

  const additional = userInfo.data !== null
    && controller.provider?.id !== undefined
    && !userInfo.hasToken(controller.provider.id);

  const providers = useMemo(() => computed(() =>
    controller.providers.filter(provider => !provider.configurable || !!provider.configurations?.length)
  ), [controller.providers]).get();

  const showTabs = !provider && providers.length > 1;
  const configurable = !!controller.provider?.configurable;

  const dialogTitle = `${controller.provider?.label || ''} ${translate('authentication_login_dialog_title')}`;
  let subTitle: string | undefined;

  if (configurable) {
    subTitle = translate('authentication_identity_provider_dialog_subtitle');
  }

  if (additional) {
    subTitle = translate('authentication_request_token');
  }

  return styled(useStyles(styles, UNDERLINE_TAB_STYLES))(
    <TabsState currentTabId={controller.provider?.id}>
      <CommonDialogWrapper
        title={dialogTitle}
        icon={controller.provider?.icon}
        subTitle={subTitle}
        footer={!configurable && (
          <AuthDialogFooter
            isAuthenticating={controller.isAuthenticating}
            onLogin={controller.login}
          >
            {controller.error?.responseMessage && (
              <ErrorMessage
                text={controller.error.responseMessage}
                hasDetails={controller.error.hasDetails}
                onShowDetails={controller.showDetails}
              />
            )}
          </AuthDialogFooter>
        )}
        onReject={options?.persistent ? undefined : rejectDialog}
      >
        {showTabs && (
          <TabList aria-label='Auth providers'>
            {providers.map(provider => (
              <Tab
                key={provider.id}
                tabId={provider.id}
                title={provider.description || provider.label}
                disabled={controller.isAuthenticating}
                onOpen={() => controller.selectProvider(provider.id)}
              >
                <TabTitle>{provider.label}</TabTitle>
              </Tab>
            ))}
          </TabList>
        )}
        <SubmittingForm {...use({ form: !configurable })} onSubmit={controller.login}>
          {controller.provider && (
            configurable ? (
              <ConfigurationsList
                configurations={controller.provider.configurations!}
                providerIcon={controller.provider.icon}
              />
            ) : (
              <AuthProviderForm
                provider={controller.provider}
                credentials={controller.credentials}
                authenticate={controller.isAuthenticating}
              />
            )
          )}
          {controller.isLoading && <Loader />}
          {!controller.isLoading && !controller.provider && <>Select available provider</>}
        </SubmittingForm>
      </CommonDialogWrapper>
    </TabsState>
  );
});
