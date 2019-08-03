general links:
https://github.com/cocos-creator/engine
https://docs.cocos.com/creator/manual/en/advanced-topics/engine-customization.html


1) install node
https://nodejs.org/en/

2) install gulp: open cmd and do:
npm install --global gulp-cli

3) cd to the cloned "engine" folder

4) execute in cmd in the engine folder: 
npm install

5) execute in cmd, WARNING: must increase memory limit or build will run out of memory
gulp build --max_old_space_size=8000


6) Open cocos creator:
Use the Custom Engine tab of the Project -> Project Settings panel to set the path to your customized JavaScript engine.