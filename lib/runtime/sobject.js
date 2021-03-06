const NameSpaceStore = require('../store/name-space-store')
const TypeStore = require('../store/type-store')
const Ast = require('../node/ast')
const createFieldNode = require('../helper/create-field-node')
const createMethodNode = require('../helper/create-method-node')
const path = require('path')
const fs = require('fs')
const jsonfile = require('jsonfile')

const ApexSObject = new Ast.ApexClass(
  'SObject',
  null,
  [],
  [],
  {},
  {},
  {
    put: [
      createMethodNode(
        'put',
        ['public'],
        'void',
        [
          ['String', 'fieldName'],
          ['Object', 'fieldValue']
        ],
        () => {
        }
      )
    ]
  },
  {},
  []
)
ApexSObject.valueFunction = (node) => {
  const keys = node.instanceFields.keys().map((fieldName) => {
    const field = node.instanceFields.get(fieldName)
    return `${fieldName} => ${field.value}`
  })
  return `${node.type().classNode.name}: ${keys.join(', ')}`
}
NameSpaceStore.registerClass('System', ApexSObject)

function createSObject (filePath) {
  return new Promise(function (resolve, reject) {
    jsonfile.readFile(filePath, function (err, meta) {
      const fields = {}
      meta.fields.forEach((field) => {
        fields[field.name] = createFieldNode(
          'String',
          ['public'],
          new Ast.NullNode()
        )
        if (field.type == 'reference' && field.referenceTo.length > 0) {
          fields[field.relationshipName] = createFieldNode(
            [field.referenceTo[0]],
            ['public'],
            new Ast.NullNode()
          )
        }
      })

      const sObject = new Ast.ApexClass(
        meta.name,
        new Ast.TypeNode(['SObject'], []),
        [],
        [],
        fields,
        {},
        {},
        {},
        []
      )
      sObject.valueFunction = ApexSObject.valueFunction
      NameSpaceStore.registerClass('System', sObject)
      resolve()
    })
  })
}

const cwd = process.cwd()
const metaFiles = fs.readdirSync(path.resolve(cwd, './meta'))

const loadSObject = function (callback) {
  Promise.all(
    metaFiles.map((metaFiles) => {
      return createSObject(path.resolve(cwd, `./meta/${metaFiles}`))
    })
  ).then(() => {
    callback()
  })
}

const SObjectType = new Ast.TypeNode(
  ['SObject'],
  []
)
SObjectType.classNode = ApexSObject
TypeStore.set('SObject', SObjectType)

module.exports = loadSObject
