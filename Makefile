.PHONY: run
run:
	node main.js examples/sample3.cls

.PHONY:debug
debug:
	node inspect main.js examples/sample3.cls

.PHONY: build
build:
	java -jar /usr/local/bin/antlr4 -Dlanguage=JavaScript -visitor apex.g4

node/ast.js: misc/generate_node.rb misc/node.yml
	misc/generate_node.rb < misc/node.yml > node/ast.js

node/apex_interpreter.js: misc/generate_ast_visitor.rb misc/node.yml
	misc/generate_ast_visitor.rb ApexInterpreter < misc/node.yml > misc/apex_interpreter.js
