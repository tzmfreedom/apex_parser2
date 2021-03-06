const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const Continuation = new Ast.ApexClass(
  'Continuation',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('System', Continuation)

module.exports = Continuation
