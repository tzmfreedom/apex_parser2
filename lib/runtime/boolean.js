const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../create-method-node')

const ApexBoolean = new ApexClass(
  'Boolean',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    valueOf: [
      createMethodNode(
        'valueOf',
        ['public'],
        'Boolean',
        [
          ['String', 'stringToBoolean'],
        ],
        () => {
          const object = EnvManager.getValue('stringToBoolean')
          return new Ast.BooleanNode(object.value === 'true')
        }
      )
    ]
  },
  []
);
NameSpaceStore.registerClass('System', ApexBoolean);

module.exports = ApexBoolean