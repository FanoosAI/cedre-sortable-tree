import { FC, FormEvent, useState } from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export interface LoginFormFields {
  username: string;
  password: string;
}

interface AddNodeFormProps {
  onSubmit: (formValues: LoginFormFields) => void;
}

const LoginForm: FC<AddNodeFormProps> = (props) => {
  const { onSubmit } = props;

  const [formValues, setFormValues] = useState({ username: '', password: '' });

  const handleFieldChange = (
    fieldName: keyof LoginFormFields,
    fieldValue: LoginFormFields[keyof LoginFormFields],
  ) => {
    setFormValues((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="text"
            label="نام کاربری"
            variant="outlined"
            size="small"
            value={formValues.username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="password"
            label="گذرواژه"
            variant="outlined"
            size="small"
            value={formValues.password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="flex-end">
        <Grid item>
          <Button type="submit" color="primary" variant="contained">
            ورود
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginForm;



