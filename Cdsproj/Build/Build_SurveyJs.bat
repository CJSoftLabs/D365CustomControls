cls
cd ..\..\Controls\SurveyJsComponent\SurveyJsForm
if exist .\bin (
    echo Removing .\bin directory...
    rd /s /q .\bin
)
if exist .\obj (
    echo Removing .\obj directory...
    rd /s /q .\obj
)
MSBUILD /t:restore
MSBUILD /P:Config=Release

cd ..\SurveyJsFormBuilder
if exist .\bin (
    echo Removing .\bin directory...
    rd /s /q .\bin
)
if exist .\obj (
    echo Removing .\obj directory...
    rd /s /q .\obj
)
MSBUILD /t:restore
MSBUILD /P:Config=Release

cd ..\..\..\Cdsproj\Cjs.SurveyJs.FormComponents
if exist .\bin (
    echo Removing .\bin directory...
    rd /s /q .\bin
)
if exist .\obj (
    echo Removing .\obj directory...
    rd /s /q .\obj
)
MSBUILD /t:restore
MSBUILD /P:Config=Release
