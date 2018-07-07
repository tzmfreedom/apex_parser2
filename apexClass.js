'use strict';

class ApexClass {
  constructor(name, superClass, implementClasses, instanceFields, staticFields, instanceMethods, staticMethods) {
    this.name             = name;
    this.superClass       = superClass;
    this.implementClasses = implementClasses;
    this.instanceFields   = instanceFields;
    this.staticFields     = staticFields;
    this.instanceMethods  = instanceMethods;
    this.staticMethods    = staticMethods;
  }

  accept(visitor) {
    visitor.visitClass(this);
  }
}

class ApexMethod {
  constructor(modifiers, returnType, identifier, parameters, throws, statements, nativeFunction) {
    this.modifiers      = modifiers;
    this.returnType     = returnType;
    this.identifier     = identifier;
    this.parameters     = parameters;
    this.throws         = throws;
    this.statements     = statements;
    this.nativeFunction = nativeFunction;
  }
}

class InstanceFieldDeclaration {
  constructor(modifiers, type, identifier, expression) {
    this.modifiers  = modifiers;
    this.type       = type;
    this.identifier = identifier;
    this.expression = expression;
  }
}

class ApexObject {
  constructor(classNode, instanceFields) {
    this.classNode = classNode;
    this.instanceFields = instanceFields;
  }
}

let apexClassStore = {};
class ApexClassStore {
  static register(classObject) {
    if (apexClassStore[classObject.name]) {
      throw `Already Stored ${classObject.name}`;
    } else {
      apexClassStore[classObject.name] = classObject;
    }
  }

  static get(class_name) {
    return apexClassStore[class_name];
  }

  static all() {
    return apexClassStore;
  }
}

let nameSpaceStore = {};
class NameSpaceStore {
  static register(namespace) {
    if (nameSpaceStore[namespace]) {
      throw `Already Stored ${namespace}`;
    } else {
      nameSpaceStore[namespace] = {};
    }
  }

  static registerClass(namespace, classObject) {
    nameSpaceStore[namespace][classObject.name] = classObject;
  }

  static get(class_name) {
    return nameSpaceStore[class_name];
  }
}

module.exports = {
  ApexClass: ApexClass,
  ApexMethod: ApexMethod,
  InstanceFieldDeclaration: InstanceFieldDeclaration,
  ApexObject: ApexObject,
  ApexClassStore: ApexClassStore,
  NameSpaceStore: NameSpaceStore,
};
