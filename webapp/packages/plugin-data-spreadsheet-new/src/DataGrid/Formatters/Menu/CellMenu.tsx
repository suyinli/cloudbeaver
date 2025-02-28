/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';
import styled from 'reshadow';

import { Icon, MenuTrigger } from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';
import { EventContext, EventStopPropagationFlag } from '@cloudbeaver/core-events';
import type { IDatabaseDataModel, IDataPresentationActions, IDataTableActions, IResultSetElementKey } from '@cloudbeaver/plugin-data-viewer';

import { DataGridContextMenuService } from '../../DataGridContextMenu/DataGridContextMenuService';
import { cellMenuStyles } from './cellMenuStyles';

interface Props {
  model: IDatabaseDataModel;
  actions: IDataTableActions;
  spreadsheetActions: IDataPresentationActions<IResultSetElementKey>;
  resultIndex: number;
  cellKey: IResultSetElementKey;
  simple: boolean;
  onClick?: () => void;
  onStateSwitch?: (state: boolean) => void;
}

export const CellMenu = observer<Props>(function CellMenu({
  model,
  actions,
  spreadsheetActions,
  resultIndex,
  cellKey,
  simple,
  onClick,
  onStateSwitch,
}) {
  const dataGridContextMenuService = useService(DataGridContextMenuService);

  const panel = dataGridContextMenuService.constructMenuWithContext(model, actions, spreadsheetActions, resultIndex, cellKey, simple);

  if (!panel.menuItems.length || panel.menuItems.every(item => item.isHidden)) {
    return null;
  }

  function handleClick() {
    dataGridContextMenuService.openMenu(model, actions, spreadsheetActions, resultIndex, cellKey, simple);
    onClick?.();
  }

  function stopPropagation(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  function markStopPropagation(event: React.MouseEvent<HTMLDivElement>) {
    EventContext.set(event, EventStopPropagationFlag);
  }

  return styled(cellMenuStyles)(
    <cell-menu as="div" onMouseUp={markStopPropagation} onDoubleClick={stopPropagation}>
      <MenuTrigger panel={panel} style={[cellMenuStyles]} modal onClick={handleClick} onVisibleSwitch={onStateSwitch}>
        <Icon name="snack" viewBox="0 0 16 10" />
      </MenuTrigger>
    </cell-menu>,
  );
});
