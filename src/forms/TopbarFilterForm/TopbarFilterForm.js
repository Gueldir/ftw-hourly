import React from 'react';
import { bool, func, node, object } from 'prop-types';
import classNames from 'classnames';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { injectIntl, intlShape } from '../../util/reactIntl';

import { Form } from '../../components';
import css from './TopbarFilterForm.css';

const TopbarFilterFormComponent = props => {
  const { liveEdit, onChange, onSubmit, onCancel, onClear, ...rest } = props;

  if (liveEdit && !onChange) {
    throw new Error('TopbarFilterForm: if liveEdit is true you need to provide onChange function');
  }

  if (!liveEdit && !(onCancel && onClear && onSubmit)) {
    throw new Error(
      'TopbarFilterForm: if liveEdit is false you need to provide onCancel, onClear, and onSubmit functions'
    );
  }

  const handleChange = formState => {
    if (formState.dirty) {
      onChange(formState.values);
    }
  };

  const formCallbacks = liveEdit ? { onSubmit: () => null } : { onSubmit, onCancel, onClear };
  return (
    <FinalForm
      {...rest}
      {...formCallbacks}
      mutators={{ ...arrayMutators }}
      render={formRenderProps => {
        const {
          id,
          handleSubmit,
          style,
          children,
        } = formRenderProps;

        const classes = classNames(css.root);

        const spy =
          liveEdit || onChange ? (
            <FormSpy onChange={handleChange} subscription={{ values: true, dirty: true }} />
          ) : null;

        return (
          <Form
            id={id}
            className={classes}
            onSubmit={handleSubmit}
            tabIndex="0"
            style={{ ...style }}
          >
            {children}
            {spy}
          </Form>
        );
      }}
    />
  );
};

TopbarFilterFormComponent.defaultProps = {
  liveEdit: false,
  style: null,
  onCancel: null,
  onChange: null,
  onClear: null,
  onSubmit: null,
};

TopbarFilterFormComponent.propTypes = {
  liveEdit: bool,
  onCancel: func,
  onChange: func,
  onClear: func,
  onSubmit: func,
  style: object,
  children: node.isRequired,

  // form injectIntl
  intl: intlShape.isRequired,
};

const TopbarFilterForm = injectIntl(TopbarFilterFormComponent);

export default TopbarFilterForm;
