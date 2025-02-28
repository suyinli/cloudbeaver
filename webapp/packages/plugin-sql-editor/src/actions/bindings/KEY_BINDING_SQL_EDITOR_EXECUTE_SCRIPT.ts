/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { createKeyBinding } from '@cloudbeaver/core-view';

export const KEY_BINDING_SQL_EDITOR_EXECUTE_SCRIPT = createKeyBinding({
  id: 'sql-editor-execute-script',
  keys: 'alt+x',
  preventDefault: true,
});
