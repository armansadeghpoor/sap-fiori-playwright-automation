const fs=require('node:fs'),path=require('node:path');
const minimum='0.3.0';
function compare(a,b){const x=a.split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++){if(!Number.isSafeInteger(x[i])||!Number.isSafeInteger(y[i]))throw Error('Invalid Studio version.');if(x[i]!==y[i])return x[i]-y[i];}return 0;}
function assertCompatible(root,version){const file=path.join(root,'tools','test-studio','package.json');if(fs.existsSync(file)&&compare(JSON.parse(fs.readFileSync(file)).version,minimum)>=0&&compare(version,minimum)<0)throw Error('Install Playwright Test Studio '+minimum+' or newer and Reload VS Code; Service crash locks require the updated client.');}
module.exports={compare,assertCompatible,minimum};
