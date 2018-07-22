const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../create-method-node')

const Version = new ApexClass(
  'Version',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', Version);

module.exports = Version