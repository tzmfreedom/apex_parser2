const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../create-method-node')

const System = new ApexClass(
  'System',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    assertEquals: [
      createMethodNode(
        'assertEquals',
        ['public'],
        'void',
        [
          ['Object', 'expected'],
          ['Object', 'actual'],
          ['Object', 'msg']
        ],
        () => {
        }
      ),
      createMethodNode(
        'assertEquals',
        ['public'],
        'void',
        [
          ['Object', 'expected'],
          ['Object', 'actual'],
        ],
        () => {
        }
      ),
    ],
    debug: [
      new Ast.MethodDeclarationNode(
        'debug',
        [new Ast.ModifierNode('public')],
        new Ast.TypeNode(['void'], []),
        [
          new Ast.ParameterNode(
            [],
            new Ast.TypeNode(['Object'], []),
            'object'
          )
        ],
        [],
        null,
        () => {
          let object = EnvManager.get('object');
          console.log(object.val());
        }
      )
    ],
    now: [
      createMethodNode(
        'now',
        ['public'],
        'DateTime',
        [],
        () => {
        }
      )
    ]
  },
  []
);
NameSpaceStore.registerClass('System', System);

module.exports = System