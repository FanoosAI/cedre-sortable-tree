import { FC, FormEvent, useState } from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export interface MessageFormFields {
  message_content: string;
}

interface AddNodeFormProps {
  onSubmit: (formValues: MessageFormFields) => void;
}

const MessageForm: FC<AddNodeFormProps> = (props) => {
  const { onSubmit } = props;

  const [formValues, setFormValues] = useState({ message_content: '' });

  const handleFieldChange = (
    fieldName: keyof MessageFormFields,
    fieldValue: MessageFormFields[keyof MessageFormFields],
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            multiline
            rows={3}
            type="text"
            label="متن پیام"
            variant="outlined"
            size="medium"
            value={formValues.message_content}
            onChange={(e) =>
              handleFieldChange('message_content', e.target.value)
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="flex-end">
        <Grid item>
          <Button type="submit" color="primary" variant="contained">
            ارسال
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MessageForm;
