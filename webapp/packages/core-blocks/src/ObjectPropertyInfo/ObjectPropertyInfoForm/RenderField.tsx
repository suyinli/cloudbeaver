/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';

import type { ObjectPropertyInfo } from '@cloudbeaver/core-sdk';
import { removeMetadataFromBase64 } from '@cloudbeaver/core-utils';

import { FieldCheckbox } from '../../FormControls/Checkboxes/FieldCheckbox';
import { Combobox } from '../../FormControls/Combobox';
import { FormFieldDescription } from '../../FormControls/FormFieldDescription';
import { InputField } from '../../FormControls/InputField';
import { InputFileTextContent } from '../../FormControls/InputFileTextContent';
import { isControlPresented } from '../../FormControls/isControlPresented';
import { Textarea } from '../../FormControls/Textarea';
import { Link } from '../../Link';
import { useTranslate } from '../../localization/useTranslate';
import { type ControlType, getPropertyControlType } from './getPropertyControlType';

const RESERVED_KEYWORDS = ['no', 'off', 'new-password'];

interface RenderFieldProps {
  property: ObjectPropertyInfo;
  state?: Record<string, any>;
  editable?: boolean;
  autofillToken?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoHide?: boolean;
  showRememberTip?: boolean;
  saved?: boolean;
  className?: string;
  canShowPassword?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

function getValue(value: any, controlType: ControlType) {
  const checkbox = controlType === 'checkbox';

  if (value === null || value === undefined) {
    return checkbox ? false : '';
  }

  if (typeof value === 'string') {
    return checkbox ? value.toLowerCase() === 'true' : value;
  }

  return value.displayName || value.value || JSON.stringify(value);
}

export const RenderField = observer<RenderFieldProps>(function RenderField({
  property,
  state,
  editable = true,
  autofillToken = '',
  disabled,
  readOnly,
  autoHide,
  showRememberTip,
  saved,
  className,
  canShowPassword,
  onFocus,
}) {
  const translate = useTranslate();

  const controlType = getPropertyControlType(property);
  const password = property.features.includes('password');
  const required = property.required && !readOnly;

  const value = getValue(property.value, controlType);
  const defaultValue = getValue(property.defaultValue, controlType);
  const passwordSaved = showRememberTip && ((password && !!property.value) || saved);
  const description = passwordSaved ? translate('ui_processing_saved') : undefined;

  if (controlType === 'file' && state) {
    return (
      <InputFileTextContent
        required={required}
        tooltip={property.description}
        labelTooltip={property.displayName || property.description}
        name={property.id!}
        state={state}
        disabled={disabled}
        fileName={description}
        className={className}
        mapValue={removeMetadataFromBase64}
      >
        {property.displayName}
      </InputFileTextContent>
    );
  }

  if (controlType === 'link') {
    return (
      <FormFieldDescription label={property.displayName} className={className}>
        <Link href={state?.[property.id!]} target="_blank" rel="noopener noreferrer">
          {property.description}
        </Link>
      </FormFieldDescription>
    );
  }

  if (!editable) {
    if (autoHide && !isControlPresented(property.id!, state)) {
      return null;
    }
    return (
      <FormFieldDescription title={property.description} label={property.displayName} className={className}>
        {state?.[property.id!]}
      </FormFieldDescription>
    );
  }

  if (controlType === 'checkbox') {
    if (state !== undefined) {
      return (
        <FieldCheckbox
          required={required}
          id={property.id}
          name={property.id!}
          state={state}
          defaultChecked={defaultValue}
          title={property.description}
          disabled={disabled || readOnly}
          className={className}
        >
          {property.displayName ?? ''}
        </FieldCheckbox>
      );
    }
    return (
      <FieldCheckbox
        id={property.id}
        name={property.id!}
        checked={value}
        defaultChecked={defaultValue}
        title={property.description}
        disabled={disabled || readOnly}
        className={className}
      >
        {property.displayName ?? ''}
      </FieldCheckbox>
    );
  }

  if (controlType === 'combobox') {
    if (state !== undefined) {
      return (
        <Combobox
          required={required}
          name={property.id!}
          state={state}
          items={property.validValues!}
          keySelector={value => value}
          valueSelector={value => value}
          defaultValue={defaultValue}
          title={property.description}
          disabled={disabled}
          readOnly={readOnly}
          description={property.hint}
          className={className}
        >
          {property.displayName ?? ''}
        </Combobox>
      );
    }

    return (
      <Combobox
        required={required}
        name={property.id!}
        items={property.validValues!}
        keySelector={value => value}
        valueSelector={value => value}
        defaultValue={defaultValue}
        title={property.description}
        disabled={disabled}
        readOnly={readOnly}
        description={property.hint}
        className={className}
      >
        {property.displayName ?? ''}
      </Combobox>
    );
  }

  if (controlType === 'textarea') {
    if (state !== undefined) {
      return (
        <Textarea
          required={required}
          title={state[property.id!]}
          labelTooltip={property.description || property.displayName}
          description={description}
          name={property.id!}
          state={state}
          disabled={disabled}
          readOnly={readOnly}
          className={className}
        >
          {property.displayName ?? ''}
        </Textarea>
      );
    }

    return (
      <Textarea
        required={required}
        title={value}
        labelTooltip={property.description || property.displayName}
        description={description}
        name={property.id!}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        className={className}
      >
        {property.displayName ?? ''}
      </Textarea>
    );
  }

  if (state !== undefined) {
    return (
      <InputField
        required={required}
        type={password ? 'password' : 'text'}
        title={password ? property.description || property.displayName : state[property.id!]}
        labelTooltip={property.description || property.displayName}
        name={property.id!}
        state={state}
        defaultValue={defaultValue}
        description={description ?? property.hint}
        disabled={disabled}
        readOnly={readOnly}
        autoHide={autoHide}
        autoComplete={RESERVED_KEYWORDS.includes(autofillToken) ? autofillToken : `${autofillToken} ${property.id}`}
        className={className}
        canShowPassword={canShowPassword}
        onFocus={onFocus}
      >
        {property.displayName}
      </InputField>
    );
  }

  return (
    <InputField
      required={required}
      type={password ? 'password' : 'text'}
      title={password ? property.description || property.displayName : value}
      labelTooltip={property.description || property.displayName}
      name={property.id!}
      value={value}
      defaultValue={defaultValue}
      description={description ?? property.hint}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={RESERVED_KEYWORDS.includes(autofillToken) ? autofillToken : `${autofillToken} ${property.id}`}
      className={className}
      canShowPassword={canShowPassword}
      onFocus={onFocus}
    >
      {property.displayName}
    </InputField>
  );
});
