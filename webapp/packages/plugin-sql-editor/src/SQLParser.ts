/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { action, computed, makeObservable, observable } from 'mobx';

export interface IQueryInfo {
  start: number;
  end: number;
}

export interface ISQLScriptSegment {
  query: string;

  /** query begin index in script */
  begin: number;
  /** query end index in script */
  end: number;
}

export interface ISQLScriptLine {
  index: number;
  begin: number;
  end: number;
}

export class SQLParser {
  get scripts(): ISQLScriptSegment[] {
    return this._scripts;
  }

  get actualScript(): string {
    return this.script;
  }

  private _scripts: ISQLScriptSegment[];
  private script: string;

  constructor() {
    this._scripts = [];
    this.script = '';

    makeObservable<this, '_scripts' | 'script'>(this, {
      actualScript: computed,
      _scripts: observable.ref,
      script: observable.ref,
      getScriptSegment: action,
      getSegment: action,
      getQueryAtPos: action,
      setScript: action,
      setQueries: action,
    });
  }

  getScriptSegment(): ISQLScriptSegment {
    const script = this.script || '';

    return {
      query: script,
      begin: 0,
      end: script.length,
    };
  }

  getSegment(begin: number, end: number): ISQLScriptSegment | undefined {
    if (begin === end) {
      return this.getQueryAtPos(begin);
    }

    if (end === -1) {
      end = begin;
    }

    return {
      query: (this.script || '').substring(begin, end),
      begin,
      end,
    };
  }

  getQueryAtPos(position: number): ISQLScriptSegment | undefined {
    const script = this._scripts.find(script => script.begin <= position && script.end > position);

    if (script) {
      return script;
    }

    const closestScripts = this._scripts.filter(script => script.begin <= position);

    if (closestScripts.length > 0) {
      return closestScripts[closestScripts.length - 1];
    }

    return undefined;
  }

  setScript(script: string): void {
    this.script = script;
  }

  setQueries(queries: IQueryInfo[]): this {
    this._scripts = queries.map<ISQLScriptSegment>(query => ({
      query: this.script.substring(query.start, query.end),
      begin: query.start,
      end: query.end,
    }));

    return this;
  }
}
