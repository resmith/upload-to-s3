import s3PublicUrl from 'node-s3-public-url';
import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import Files from '../../api/files/files';

Slingshot.fileRestrictions('Uploader', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg', 'image/gif', 'image/svg+xml'],
  maxSize: 9 * 1024 * 1024, // 1MB limit (use null for unlimited)
});

Slingshot.createDirective('Uploader', Slingshot.S3Storage, {
  bucket: Meteor.settings.private.s3Bucket,
  acl: Meteor.settings.private.s3Acl,
  region: Meteor.settings.private.s3Region,
  authorize() {
    if (!this.userId) throw new Meteor.Error('need-login', 'You need to be logged in to upload files!');
    const userFileCount = Files.find({ userId: this.userId }).count();
    return userFileCount < 20;
  },
  key(file) {
    const user = Meteor.users.findOne(this.userId);
    return `${user.emails[0].address}/${file.name}`;
  },
});
