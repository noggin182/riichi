module.exports = {
  name: 'scorer',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/scorer',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
