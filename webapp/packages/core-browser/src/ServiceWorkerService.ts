/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
/// <reference lib="WebWorker" />
import { Workbox } from 'workbox-window';

import { injectable } from '@cloudbeaver/core-di';
import { Executor, IExecutor } from '@cloudbeaver/core-executor';
import { GlobalConstants } from '@cloudbeaver/core-utils';

@injectable()
export class ServiceWorkerService {
  readonly onUpdate: IExecutor;

  private readonly workerURL: string;
  private workbox: Workbox | null;

  constructor() {
    this.onUpdate = new Executor();
    this.workerURL = GlobalConstants.absoluteRootUrl('service-worker.js');
    this.workbox = null;
  }

  register(): void | Promise<void> {
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'development') {
        navigator.serviceWorker
          .getRegistration(this.workerURL)
          .then(registration => registration?.unregister())
          .catch();
      } else {
        this.workbox = new Workbox(this.workerURL);
        this.registerSkipWaitingPrompt(this.workbox);
        this.workbox.register();
        setInterval(() => this.workbox?.update(), 1000 * 60 * 60);
      }
    }
  }

  private registerSkipWaitingPrompt(workbox: Workbox): void {
    workbox.addEventListener('controlling', async event => {
      if (!event.isUpdate) {
        return;
      }

      await this.onUpdate.execute();
      window.location.reload();
    });

    workbox.addEventListener('waiting', event => {
      workbox.messageSkipWaiting();
    });
  }
}
