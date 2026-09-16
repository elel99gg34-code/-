; EggMate Windows 설치 프로그램 (Inno Setup 6)
; PyInstaller 가 만든 dist\EggMate 폴더를 그대로 담는다.

#ifndef AppVersion
  #define AppVersion "1.0.0"
#endif

#define AppName "EggMate"
#define AppNameKo "에그메이트"
#define AppExe "EggMate.exe"
#define AppPublisher "EggMate"

[Setup]
AppId={{B7E4F2A1-9C3D-4E8B-A5F6-2D1C8E7A4B90}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputDir=..\dist
OutputBaseFilename=EggMate-{#AppVersion}-Setup
SetupIconFile=..\src\eggmate\data\icon.ico
UninstallDisplayIcon={app}\{#AppExe}
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequiredOverridesAllowed=dialog
; 관리자 권한 없이도 설치할 수 있게 한다.
PrivilegesRequired=lowest

[Languages]
Name: "korean"; MessagesFile: "compiler:Languages\Korean.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[CustomMessages]
korean.CreateDesktopIcon=바탕화면에 바로가기 만들기
korean.LaunchApp={#AppName} 실행
english.CreateDesktopIcon=Create a desktop shortcut
english.LaunchApp=Launch {#AppName}

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "..\dist\EggMate\{#AppExe}"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\dist\EggMate\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\README.md"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExe}"
Name: "{group}\{cm:UninstallProgram,{#AppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExe}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#AppExe}"; Description: "{cm:LaunchApp}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; 설치 폴더에 남는 파이썬 캐시만 지운다. 사용자 기록(%APPDATA%\EggMate)은 건드리지 않는다.
Type: filesandordirs; Name: "{app}\__pycache__"
