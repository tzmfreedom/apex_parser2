const antlr4 = require('antlr4');
const ApexParser = require('../apexParser');
const ApexLexer = require('../apexLexer');
const ApexInterpreter = require('../visitor/apex-interpreter');
const ApexAstBuilder = require('../visitor/apex-ast-builder');
const SymbolDeclarator = require('../visitor/symbol-declarator');
const ApexBuilder = require('../visitor/apex-builder');
const TypeBuilder = require('../visitor/type-builder');
const MethodInvocationNode = require('../node/ast').MethodInvocationNode;
const NameNode = require('../node/ast').NameNode;
const NameSpaceStore = require('../node/apexClass').NameSpaceStore;
const ApexClassStore = require('../node/apexClass').ApexClassStore
const util = require('util');
const fs = require('fs');
const ClassStaticFields = require('../class-static-fields')
const path = require('path')

const runtimeFiles = fs.readdirSync(path.resolve(__dirname, '../runtime'))
runtimeFiles.forEach((runtimeFile) => {
  require(`../runtime/${runtimeFile}`)
})

class Cli {
  constructor() {
    this.readFile = (fileName) => {
      const input = fs.readFileSync(fileName, 'utf8');
      const chars = new antlr4.InputStream(input);
      const lexer = new ApexLexer.apexLexer(chars);
      const tokens = new antlr4.CommonTokenStream(lexer);
      const parser = new ApexParser.apexParser(tokens);
      parser.buildParseTrees = true;
      const tree = parser.compilationUnit();

      try {
        const visitor = new ApexAstBuilder();
        const top = visitor.visit(tree);

        const declarator = new SymbolDeclarator();
        // console.log(`End ReadFile: ${fileName}`);
        return declarator.visit(top);
      } catch (e) {
        console.log(e);
      }
    }

    // prepare global
    this.prepareClass = (classInfo) => {
      Object.keys(classInfo.staticFields).forEach((fieldName) => {
        const staticField = classInfo.staticFields[fieldName]
        ClassStaticFields.put(classInfo.name, staticField.type, fieldName)
      })
    }

    this.buildClass = (classInfo) => {
      const typeBuilder = new TypeBuilder();
      typeBuilder.visit(classInfo);
      const apexBuilder = new ApexBuilder();
      apexBuilder.visit(classInfo);
    }
  }
  run(className, actionName) {
    this.parse()
    this.prepareAllClass()
    this.buildAllClass()
    this.execute(className, actionName)
  }

  // Create CST with ANTLR
  parse() {
    const fileList = fs.readdirSync('examples')
      .filter((file) => {
        // return fs.statSync(`examples/${file}`).isFile() && /.*sample3\.cls$/.test(file);
        return fs.statSync(`examples/${file}`).isFile() && /.*\.cls$/.test(file);
      });

    this.classes = fileList.map((fileName) => {
      return this.readFile(`examples/${fileName}`);
    });
  }

  prepareAllClass() {
    ['System', 'ApexPages'].forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace);
      Object.keys(classes).forEach((className) => {
        this.prepareClass(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      this.prepareClass(classInfo);
    });
  }

  buildAllClass() {

    ['System', 'ApexPages'].forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace);
      Object.keys(classes).forEach((className) => {
        this.buildClass(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      this.buildClass(classInfo);
    });
  }

  execute(className, actionName) {
    const interpreter = new ApexInterpreter();
    const invokeNode = new MethodInvocationNode(
      new NameNode([className, actionName]),
      [],
    );
    interpreter.visit(invokeNode);
  }

  reloadFile(file, className) {
    ApexClassStore.deregister(className);
    const classInfo = this.readFile(`examples/${file}`);
    this.prepareClass(classInfo)
    this.buildClass(classInfo)
  }
}

module.exports = new Cli()