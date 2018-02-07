import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const deleteObject = (s3Key) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('files.delete', s3Key, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('File deleted!', 'success');
      }
    });
  }
};

export default class FilesListLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedUrl: '',
    };
  }

  componentDidMount() {
    const { s3Key } = this.props;

    Meteor.call('awss3.getSignedUrl', s3Key, (error, result) => {
      this.setState({ signedUrl: result });
    });
  }

  render() {
    const { _id, url, fileName, s3Key } = this.props;

    return (
      <ListGroupItem key={_id}>
        <a href={ url } target='_blank'>{fileName} - publicURL</a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        <a href={ this.state.signedUrl } target='_blank'>{fileName} - signedUrl</a>

        <i onClick={() => { deleteObject(_id, s3Key); }} className="fa fa-remove" />
      </ListGroupItem>

    );
  }
}

FilesListLine.propTypes = {
  _id: PropTypes.string,
  url: PropTypes.string,
  fileName: PropTypes.string,
  s3Key: PropTypes.string,
  signedUrl: PropTypes.string,
};
