import { FC, FormEvent, useState } from 'react';
import jMoment, { Moment } from 'moment-jalaali';

import { DatePicker, TimePicker, DateTimePicker } from '@material-ui/pickers';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useConfigs, Fields, NodeTypes } from '@configs/main-configs';

interface AddNodeFormProps {
  initialValues: SedrahNodeData;
  fields: Array<Fields>;
  onUpdateNode: (formValues: SedrahNodeData) => void;
}

type FormErrors = {
  [key in keyof SedrahNodeData]: string;
};

const EditNodeForm: FC<AddNodeFormProps> = (props) => {
  const { initialValues, fields, onUpdateNode } = props;
  const { treeNodes, nodeTypes, generateNewNode } = useConfigs();

  const [formFields, setFormFields] = useState(fields);

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState(
    formFields.reduce(
      (res, field) => ({ ...res, [field.name]: '' }),
      {} as FormErrors,
    ),
  );

  const handleUpdateType = (type: NodeTypes) => {
    setFormFields(treeNodes[type].fields);
    setFormValues((prevValues) => ({
      ...generateNewNode(type),
      ...(prevValues.name && { name: prevValues.name }),
    }));
  };

  const handleFieldChange = (
    fieldName: keyof SedrahNodeData,
    fieldValue: SedrahNodeData[keyof SedrahNodeData],
  ) => {
    setFormErrors(
      formFields.reduce(
        (res, field) => ({ ...res, [field.name]: '' }),
        {} as FormErrors,
      ),
    );
    setFormValues((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const withoutError = formFields.reduce((isValid, field) => {
      if (field.isRequired) {
        if (formValues[field.name] === '') {
          setFormErrors((prevState) => ({
            ...prevState,
            [field.name]: 'ضروری است',
          }));
          return false;
        }
      }

      if (typeof field.validationFunc === 'function') {
        if (!field.validationFunc(formValues[field.name])) {
          setFormErrors((prevState) => ({
            ...prevState,
            [field.name]: 'مقدار معتبر نیست',
          }));
          return false;
        }
      }

      return isValid;
    }, true);

    if (withoutError) {
      onUpdateNode(formValues);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="select-label">نوع گره</InputLabel>
            <Select
              labelId="select-label"
              value={formValues.nodeType}
              onChange={(e) => {
                handleUpdateType(e.target.value as NodeTypes);
                handleFieldChange('nodeType', e.target.value as NodeTypes);
              }}
              label="نوع گره"
            >
              {nodeTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {formFields.map((field) => {
          switch (field.type) {
            case 'number':
            case 'text':
            case 'color':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    multiline={field.multiline}
                    type={field.type}
                    required={field.isRequired}
                    label={field.label}
                    variant="outlined"
                    size="small"
                    error={Boolean(formErrors[field.name])}
                    helperText={formErrors[field.name]}
                    value={formValues[field.name]}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                  />
                </Grid>
              );
            case 'checkbox':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formValues[field.name])}
                        onChange={(e) =>
                          handleFieldChange(field.name, e.target.checked)
                        }
                        name={field.name}
                      />
                    }
                    label={field.label}
                  />
                </Grid>
              );
            case 'select':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="select-label">{field.label}</InputLabel>
                    <Select
                      labelId="select-label"
                      value={formValues[field.name]}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value as string)
                      }
                      multiple={field.selectType === 'multiple'}
                      label={field.label}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );
            case 'date':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label={field.label}
                    type="text"
                    size="small"
                    inputVariant="outlined"
                    okLabel="تایید"
                    cancelLabel="انصراف"
                    value={formValues[field.name] as Moment}
                    onChange={(v) =>
                      handleFieldChange(field.name, v || jMoment())
                    }
                  />
                </Grid>
              );
            case 'time':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <TimePicker
                    fullWidth
                    label={field.label}
                    type="text"
                    size="small"
                    inputVariant="outlined"
                    okLabel="تایید"
                    cancelLabel="انصراف"
                    value={formValues[field.name] as Moment}
                    onChange={(v) =>
                      handleFieldChange(field.name, v || jMoment())
                    }
                  />
                </Grid>
              );
            case 'dateTime':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <DateTimePicker
                    fullWidth
                    label={field.label}
                    type="text"
                    size="small"
                    inputVariant="outlined"
                    okLabel="تایید"
                    cancelLabel="انصراف"
                    value={formValues[field.name] as Moment}
                    onChange={(v) =>
                      handleFieldChange(field.name, v || jMoment())
                    }
                  />
                </Grid>
              );

            default:
              return <>نوع فیلد معتبر نیست!</>;
          }
        })}
        <Grid container spacing={2} justify="flex-end">
          <Grid item>
            <Button type="submit" color="primary" variant="contained">
              ویرایش
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditNodeForm;
