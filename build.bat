@echo off

Rem uses http://dynamicflash.com/goodies/base64/

SET OPTS=-use-network=false -library-path+=as3corelib.swc  -library-path+=as3base64.swc

REM this is a little wasteful because it compiles the components too, but there aren't that many
for /R . %%f in (*.mxml) do  ..\..\bin\mxmlc.exe %OPTS% "%%f"


xcopy /Y *.* C:\dev\prog\Apache2\htdocs\flashcamshim\
