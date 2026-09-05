const fs = require('fs');
let cfg = fs.readFileSync('c:/Users/hiver/Desktop/Github/sandbox-main/sandbox-main/trigger.config.ts', 'utf8');
cfg = cfg.replace('project: "proj_mrgzxrrrlsqxhkxnkflz"', 'project: "proj_atsnienvbfcdzytdpaqz"');
cfg = cfg.replace('project: process.env.SENTRY_PROJECT', 'project: "gamegenplay"');
fs.writeFileSync('c:/Users/hiver/Desktop/Github/GameGenPlay/trigger.config.ts', cfg);
console.log('Merged trigger.config.ts');
