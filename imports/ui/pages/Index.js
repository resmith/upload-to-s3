import React from 'react';
import PropTypes from 'prop-types';
import Uploader from '../components/Uploader';
import Files from '../components/Files';

const Index = () => (
  <div className="Index">
    <Uploader />
    <Files />
  </div>
);

Index.propTypes = {};

export default Index;
