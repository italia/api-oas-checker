import React, {useEffect} from 'react';
import { Badge } from 'design-react-kit';
import { useSelector } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { getFilename } from '../redux/selectors.js';

const useStyles = createUseStyles({
  info: {
    backgroundColor: 'var(--info)',
    color: 'var(--text-dark)',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  },
});

export const FilenameSection = () => {
  const filename = useSelector((state) => getFilename(state));

  useEffect(() => {
  }, [filename]);
  const classes = useStyles(filename);
  return (
    filename && (
      <div className="d-flex p-3 bg-primary">
        <h4 className="pr-3">
          <Badge data-testid="info-badge" className={classes.info} pill={false} tag="span">
            {"File: " + filename}
          </Badge>
        </h4>
      </div>
    )
  );
};
