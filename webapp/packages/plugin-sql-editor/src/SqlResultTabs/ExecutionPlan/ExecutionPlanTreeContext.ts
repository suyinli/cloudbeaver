/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { createContext } from 'react';

import type { ObjectPropertyInfo, SqlExecutionPlanNode } from '@cloudbeaver/core-sdk';

export interface IExecutionPlanNode extends SqlExecutionPlanNode {
  children: IExecutionPlanNode[];
}

export interface IExecutionPlanTreeContext {
  selectedNodes: Map<string, boolean>;
  readonly columns: ObjectPropertyInfo[];
  readonly nodes: IExecutionPlanNode[];
  selectNode: (nodeId: string) => void;
}

export const ExecutionPlanTreeContext = createContext<IExecutionPlanTreeContext | null>(null);
