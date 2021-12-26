import { FC, forwardRef, ReactNode, ReactElement, Ref } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

interface AlertDialogProps {
  open: boolean;
  title: string;
  content: string | ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  okText?: string;
  cancelText?: string;
  onOK?: () => void;
  onCancel?: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog: FC<AlertDialogProps> = (props) => {
  const {
    maxWidth = 'sm',
    open,
    title,
    content,
    okText,
    cancelText,
    onOK,
    onCancel,
  } = props;
  return (
    <Dialog
      fullWidth
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth={maxWidth}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div" id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {cancelText && (
          <Button onClick={onCancel} color="primary">
            {cancelText}
          </Button>
        )}
        {okText && (
          <Button onClick={onOK} color="primary">
            {okText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
