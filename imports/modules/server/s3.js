import s3PublicUrl from 'node-s3-public-url';
import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';

AWS.config = new AWS.Config();

AWS.config.accessKeyId = Meteor.settings.AWSAccessKeyId;
AWS.config.secretAccessKey = Meteor.settings.AWSSecretAccessKey;

const s3 = new AWS.S3();

export default {
  deleteFile(file, callback) {
    const sanitizedEmailAddress = encodeURIComponent(file.emailAddress);
    const sanitizedFileName = s3PublicUrl(file.fileName);
    const sanitizedUrl = file.url.replace(sanitizedEmailAddress, file.emailAddress).replace(sanitizedFileName, file.fileName);

    s3.deleteObject({
      Bucket: 'rlives-test3',
      Key: sanitizedUrl.replace('https://tmc-react-s3.s3-us-west-2.amazonaws.com/', ''),
    }, Meteor.bindEnvironment((error) => {
      if (error) console.warn(error);
      if (!error && callback) callback(file.url);
    }));
  },
};

export const getSignedUrl = (file) => {
// export function getSignedUrl(file) {

  const params = { Bucket: 'rlives-test3', Key: file };

  const signedUrl = s3.getSignedUrl('getObject', params);
  s3.getSignedUrl('getObject', params, function (err, signedUrl) {
    console.log('getSignedUrl input file:',file);
    console.log('getSignedUrl output signedUrl:',signedUrl);
    return signedUrl;
  });

};
