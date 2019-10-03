module.exports = {
  name: 'riichi',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/riichi',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
