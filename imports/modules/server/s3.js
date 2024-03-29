import s3PublicUrl from 'node-s3-public-url';
import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';

AWS.config = new AWS.Config();

AWS.config.accessKeyId = Meteor.settings.AWSAccessKeyId;
AWS.config.secretAccessKey = Meteor.settings.AWSSecretAccessKey;

const s3 = new AWS.S3();

export const deleteFile = (file, callback) => {
  const sanitizedEmailAddress = encodeURIComponent(file.emailAddress);
  const sanitizedFileName = s3PublicUrl(file.fileName);
  const sanitizedUrl = file.url.replace(sanitizedEmailAddress, file.emailAddress).replace(sanitizedFileName, file.fileName);
  const s3Key = file.s3Key;

  s3.deleteObject({
    Bucket: Meteor.settings.private.s3Bucket,
    Key: s3Key,
  }, Meteor.bindEnvironment((error) => {
    if (error) console.warn(error);
    if (!error && callback) callback(file.url);
  }));
};

export const getSignedUrl = (s3Key) => {
  const params = {
    Bucket: Meteor.settings.private.s3Bucket,
    Key: s3Key,
  };

  const signedUrl = s3.getSignedUrl('getObject', params);
  return signedUrl;
};
