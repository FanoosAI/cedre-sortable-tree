import { ChangeEvent, FC, useState } from 'react';
import { TreeItem } from 'react-sortable-tree';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import BackupIcon from '@material-ui/icons/Backup';

interface ImportInitialTreeProps {
  onImport: (initialTree: Array<TreeItem>) => void;
}

const ImportInitialTree: FC<ImportInitialTreeProps> = ({ onImport }) => {
  const [inputValue, setInputValue] = useState('');

  const handleUploadFile = function (event: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const uploadedArray = JSON.parse(
        e.target?.result as string,
      ) as Array<TreeItem>;
      if (Array.isArray(uploadedArray)) {
        onImport(uploadedArray);
      } else {
        alert('فایل انتخابی ساختار مناسبی ندارد.');
      }
    };

    reader.readAsText(event.target.files?.[0] as File);
    // This input value reset is needed to be able upload multiple times
    setInputValue('');
  };

  return (
    <FormControl>
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="secondary"
          component="span"
          startIcon={<BackupIcon />}
        >
          بارگزاری درخت
        </Button>
      </label>
      <input
        accept="application/json"
        type="file"
        id="contained-button-file"
        name="initial tree"
        style={{ display: 'none' }}
        value={inputValue}
        onChange={handleUploadFile}
      />
    </FormControl>
  );
};

export default ImportInitialTree;
