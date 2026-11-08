// Testes isolados das regras de cálculo de repasse, sem instalar dependências.
const path=require('path');
const fs=require('fs');
const Module=require('module');
const ts=require('typescript');
Module._extensions['.ts']=function(m,filename){
 const compiled=ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,esModuleInterop:true}});
 m._compile(compiled.outputText,filename);
};
require(path.resolve(__dirname,'src/shared/utils/__tests__/deliveryPerformance.test.ts'));
