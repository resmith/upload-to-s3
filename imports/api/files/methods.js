import s3PublicUrl from 'node-s3-public-url';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Files from './files';
import { deleteFile, getSignedUrl } from '../../modules/server/s3';

Meteor.methods({
  'files.store': function filesStoreMethod(file) {
    check(file, Object);
    const user = Meteor.users.findOne(this.userId, { fields: { emails: 1 } });
    const email = user.emails[0].address;
    const sanitizedUrl = file.url.replace(email, `${encodeURIComponent(email)}`).replace(file.name, `${s3PublicUrl(file.name)}`);
    const s3Key = `${email}/${file.name}`;

    return Files.insert({ userId: this.userId, url: sanitizedUrl, fileName: file.name, s3Key });
  },
  'files.delete': function filesStoreMethod(fileId) {
    check(fileId, String);

    const file = Files.findOne(fileId);
    const user = Meteor.users.findOne(this.userId, { fields: { emails: 1 } });
    file.emailAddress = user.emails[0].address;
    if (file && file.userId === this.userId) {
      return deleteFile(file, () => {
        Files.remove({ _id: fileId, userId: this.userId });
      });
    }

    throw new Meteor.Error('500', 'Must be logged in to delete a File!');
  },

  'awss3.getSignedUrl': function s3getSignedUrl(s3Key) {
    check(s3Key, String);

    if (this.userId) {
      // Did it in two parts so you can console out the results to debug if needed
      const signedUrl = getSignedUrl(s3Key);
      return signedUrl;
    }
    throw new Meteor.Error('500', 'Must be logged in to get a signedUrl!');
  },
});
