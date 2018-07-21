const antlr4 = require('antlr4');
const ApexParser = require('./apexParser');
const ApexLexer = require('./apexLexer');
const ApexInterpreter = require('./visitor/apex-interpreter');
const ApexAstBuilder = require('./visitor/apex-ast-builder');
const SymbolDeclarator = require('./visitor/symbol-declarator');
const ApexBuilder = require('./visitor/apex-builder');
const TypeBuilder = require('./visitor/type-builder');
const MethodInvocationNode = require('./node/ast').MethodInvocationNode;
const NameNode = require('./node/ast').NameNode;
const NameSpaceStore = require('./node/apexClass').NameSpaceStore;
const util = require('util');
const fs = require('fs');
const ClassStaticFields = require('./class-static-fields')

const runtimeFiles = fs.readdirSync('./lib/runtime')
runtimeFiles.forEach((runtimeFile) => {
  require(`./runtime/${runtimeFile}`)
})

// Create CST with ANTLR
const fileList = fs.readdirSync('examples')
                   .filter((file) => {
                     // return fs.statSync(`examples/${file}`).isFile() && /.*sample3\.cls$/.test(file);
                     return fs.statSync(`examples/${file}`).isFile() && /.*\.cls$/.test(file);
                   });

setTimeout(()=>{}, 10);
const classes = fileList.map((fileName) => {
  return readFile(`examples/${fileName}`);
});

const systemClasses = NameSpaceStore.getClasses('System');
// prepare global
const prepare = (classInfo) => {
  Object.keys(classInfo.staticFields).forEach((fieldName) => {
    const staticField = classInfo.staticFields[fieldName];
    ClassStaticFields.put(classInfo.name, staticField.type, fieldName)
  })
}

Object.keys(systemClasses).forEach((className) => {
  prepare(systemClasses[className])
});
const apexPagesClasses = NameSpaceStore.getClasses('ApexPages');
Object.keys(apexPagesClasses).forEach((className) => {
  prepare(apexPagesClasses[className])
});

classes.forEach((classInfo) => {
  prepare(classInfo);
});

// build
Object.keys(systemClasses).forEach((className) => {
  build(systemClasses[className])
});
Object.keys(apexPagesClasses).forEach((className) => {
  build(apexPagesClasses[className])
});

classes.forEach((classInfo) => {
  build(classInfo);
});

run('Hoge', 'action');

function readFile(fileName) {
  // console.log(`Start ReadFile: ${fileName}`);
  const input = fs.readFileSync(fileName, 'utf8');
  const chars = new antlr4.InputStream(input);
  const lexer = new ApexLexer.apexLexer(chars);
  const tokens  = new antlr4.CommonTokenStream(lexer);
  const parser = new ApexParser.apexParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.compilationUnit();

// Create AST from CST with Visitor
  const classInfo = [];
  try {
    const visitor = new ApexAstBuilder();
    const top = visitor.visit(tree);

   // console.log(util.inspect(top, {depth: 13, colors: true}));

    const declarator = new SymbolDeclarator();
    // console.log(`End ReadFile: ${fileName}`);
    return declarator.visit(top);
  } catch (e) {
    console.log(e);
  }
}

function build(classInfo) {
  // const builder = new ApexBuilder();
  const typeBuilder = new TypeBuilder();
  typeBuilder.visit(classInfo);
  const apexBuilder = new ApexBuilder();
  apexBuilder.visit(classInfo);
}

function run(className, actionName) {
  const interpreter = new ApexInterpreter();
  const invokeNode = new MethodInvocationNode(
    new NameNode([className, actionName]),
    [],
  );
  interpreter.visit(invokeNode);
}