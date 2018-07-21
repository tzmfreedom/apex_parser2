const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const EnvManager       = require('../env-manager')
const Ast              = require('../node/ast')
const createMethodNode = require('../create-method-node')

const ApexSet = new ApexClass(
  'Set',
  null,
  [],
  [],
  {},
  {},
  {
    hasNext: [
      createMethodNode(
        'hasNext',
        ['public'],
        'Boolean',
        [],
        () => {
          const obj = EnvManager.get('this').value;
          return new Ast.BooleanNode(obj._idx < obj._records.length);
        }
      )
    ],
    next: [
      createMethodNode(
        'next',
        ['public'],
        'Object',
        [],
        () => {
          const obj = EnvManager.get('this').value;
          const record = obj._records[obj._idx];
          obj._idx++;
          return record;
        }
      )
    ],
    add: [
      createMethodNode(
        'add',
        ['public'],
        'void',
        [['Object', 'value']],
        () => {
          const obj = EnvManager.get('this').value;
          const value = EnvManager.get('value');
          obj._records.push(value);
        }
      )
    ],
    get: [
      createMethodNode(
        'get',
        ['public'],
        'Object',
        [['Object', 'key']],
        () => {
          const obj = EnvManager.get('this').value;
          const keyNode = EnvManager.get('key').value;
          return obj._records[parseInt(keyNode.value)].value;
        }
      )
    ]
  },
  {},
  []
);
ApexSet.valueFunction = (node) => {
  const messages = node._records.map((record) => {
    return `  ${record.val()}`;
  });
  return `Set\n${messages.join('\n')}`;
};
NameSpaceStore.registerClass('System', ApexSet);

module.exports = ApexSet