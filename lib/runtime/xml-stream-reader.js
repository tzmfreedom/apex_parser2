const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast')
const createMethodNode = require('../create-method-node')
const createFieldNode  = require('../create-field-node')

const ApexXmlStreamReader = new ApexClass(
  'XmlStreamReader',
  null,
  [],
  [],
  {},
  {},
  {
    getEventType: [
      createMethodNode(
        'getEventType',
        ['public'],
        'XmlTag',
        [],
        () => {
        }
      )
    ],
    getLocalName: [
      createMethodNode(
        'getLocalName',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    getText: [
      createMethodNode(
        'getText',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    next: [
      createMethodNode(
        'next',
        ['public'],
        'void',
        [],
        () => {
        }
      )
    ],
    hasNext: [
      createMethodNode(
        'hasNext',
        ['public'],
        'Boolean',
        [],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexXmlStreamReader);

module.exports = ApexXmlStreamReader