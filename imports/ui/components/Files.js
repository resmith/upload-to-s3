import React from 'react';
import PropTypes from 'prop-types';
import { composeWithTracker } from 'react-komposer';
import { ListGroup, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

import Files from '../../api/files/files';
import FileListLine from './FilesListLine';
import Loading from './Loading';

const FileList = ({ files }) => (
    <div className="Files">
      {files.length ? <ListGroup>
        {files.map(({ _id, url, fileName, s3Key }) => (
          <FileListLine
            key={_id}
            _id={_id}
            url={url}
            fileName={fileName}
            s3Key={s3Key}
          />
        ))}
      </ListGroup> : <Alert bsStyle="warning">No files yet. Try uploading something!</Alert>}
    </div>
);

FileList.propTypes = {
  files: PropTypes.array,
};

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('files');
  if (subscription.ready()) {
    const files = Files.find({ userId: Meteor.userId() }).fetch();
    onData(null, { files });
  }
};


export default composeWithTracker(composer, Loading)(FileList);
