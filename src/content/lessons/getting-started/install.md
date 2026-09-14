## 이 레슨에서 할 일

Flutter는 코드 하나로 모바일(Android, iOS), 웹, 데스크톱(Windows, macOS, Linux) 앱을 만드는 Google의 UI 툴킷입니다. 이 레슨에서는 공식 문서의 **빠른 시작(Quick start)** 방법대로 VS Code에서 Flutter SDK를 설치하고, 웹(Chrome)을 대상으로 첫 앱을 실행합니다.

> **왜 웹부터 시작하나요?** Chrome만 있으면 Android Studio나 Xcode 같은 추가 도구 없이 바로 앱을 실행할 수 있어 설치가 가장 간단합니다. Android·iOS 같은 다른 플랫폼은 나중에 추가로 설정하면 됩니다.

## 1. 사전 준비

| 운영체제 | 필요한 도구 |
| --- | --- |
| Windows | [Git for Windows](https://git-scm.com/downloads/win), [VS Code](https://code.visualstudio.com/) |
| macOS | Xcode Command Line Tools(iOS·macOS 개발 시 권장), VS Code |
| Linux · ChromeOS | 아래 패키지, VS Code |

macOS에서는 Xcode 명령줄 도구를 설치합니다.

```bash
xcode-select --install
```

Linux(ChromeOS는 먼저 설정에서 Linux 지원을 켭니다)에서는 다음 패키지를 설치합니다.

```bash
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl git unzip xz-utils zip libglu1-mesa
```

## 2. VS Code에 Flutter 확장 설치

1. VS Code를 실행합니다.
2. [Flutter 확장 페이지](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter)에서 **Install**을 누르고, 브라우저가 VS Code를 열어도 되는지 물으면 허용합니다.

Flutter 확장을 설치하면 Dart 확장도 함께 설치됩니다.

## 3. VS Code로 Flutter SDK 설치

1. 명령 팔레트를 엽니다. **View > Command Palette** 또는 `Ctrl + Shift + P`(macOS는 `Cmd + Shift + P`)
2. `flutter`를 입력하고 **Flutter: New Project**를 선택합니다.
3. Flutter SDK 위치를 묻는 알림이 뜨면 **Download SDK**를 선택합니다.
4. **Select Folder for Flutter SDK** 대화상자에서 SDK를 설치할 폴더를 고릅니다.
5. **Clone Flutter**를 누르면 SDK 다운로드가 시작됩니다. 몇 분 걸릴 수 있습니다.
6. 다운로드가 끝나면 **Add SDK to PATH**를 누릅니다. "The Flutter SDK was added to your PATH" 알림이 뜨면 성공입니다.
7. Google Analytics 안내가 나오면 **OK**를 누릅니다.
8. **열려 있는 모든 터미널 창을 닫았다 다시 열고, VS Code를 재시작합니다.**

> **주의** 8단계를 건너뛰면 새 PATH가 반영되지 않아 터미널에서 `flutter` 명령을 찾지 못합니다.

> **팁** SDK 폴더는 공백이나 특수 문자가 없는 경로(예: `C:\dev`)를 고르고, `C:\Program Files`처럼 관리자 권한이 필요한 폴더는 피하세요.

## 4. 설치 확인: flutter doctor

새 터미널을 열고 다음 명령을 실행합니다.

```bash
flutter doctor
```

`flutter doctor`는 Flutter SDK와 플랫폼별 도구가 준비되었는지 점검해 항목마다 결과를 보여 줍니다.

| 표시 | 의미 |
| --- | --- |
| `[✓]` | 준비 완료 |
| `[!]` | 일부 문제 있음(경고) |
| `[✗]` | 설치되지 않음 |

- 웹만 대상으로 한다면 **Chrome** 항목이 `[✓]`인지 확인하세요.
- Android를 대상으로 하지 않는다면 **Android toolchain·Android Studio** 관련 경고는 무시해도 됩니다.
- 자세한 정보가 필요하면 `flutter doctor -v`를 실행합니다.

## 5. 테스트 드라이브: 첫 앱 실행

1. 명령 팔레트에서 **Flutter: New Project**를 선택하고 **Application** 템플릿(카운터 앱)을 고릅니다.
2. 프로젝트를 만들 상위 폴더를 선택하고 이름을 `trying_flutter`로 입력합니다. Dart 패키지 이름은 **소문자와 밑줄**만 사용합니다.
3. 명령 팔레트에서 **Flutter: Select Device**를 선택하고 **Chrome**을 고릅니다.
4. **Run > Start Debugging**을 선택하거나 `F5`를 누릅니다. VS Code가 내부적으로 `flutter run`을 실행하고 Chrome에 앱이 열립니다.

## 6. 핫 리로드 맛보기

카운터 앱의 `lib/main.dart`에서 버튼을 눌렀을 때 실행되는 코드를 찾습니다.

```dart
void _incrementCounter() {
  setState(() {
    _counter++;
  });
}
```

`_counter++`를 `_counter += 2`로 바꾸고 저장(`Ctrl + S`)하거나 디버그 도구 모음의 **Hot Reload** 버튼을 누르세요. 앱을 다시 시작하지 않아도 변경이 즉시 반영되고, **화면에 표시되던 카운트 값도 그대로 유지**됩니다. 이것이 Flutter 개발 속도를 높여 주는 **상태 유지 핫 리로드(stateful hot reload)**입니다.

## 7. 다른 플랫폼 추가하기

웹 외의 플랫폼을 대상으로 하려면 공식 문서의 플랫폼별 설정을 이어서 진행합니다.

- [Android 설정](https://docs.flutter.dev/platform-integration/android/setup)
- [iOS 설정](https://docs.flutter.dev/platform-integration/ios/setup)(macOS 필요)
- [Windows 설정](https://docs.flutter.dev/platform-integration/windows/setup) · [macOS 설정](https://docs.flutter.dev/platform-integration/macos/setup) · [Linux 설정](https://docs.flutter.dev/platform-integration/linux/setup)

## 문제 해결

- **SDK 다운로드가 멈춘 것 같다면** **Cancel**을 누른 뒤 설치를 다시 시작합니다.
- **그 밖의 문제**는 [설치 문제 해결 문서](https://docs.flutter.dev/install/troubleshoot)를 참고하세요.

## 핵심 정리

- Git과 VS Code를 준비하고 **Flutter 확장**을 설치했습니다.
- 명령 팔레트의 **Flutter: New Project**에서 SDK를 내려받고 PATH에 추가한 뒤, 터미널과 VS Code를 재시작했습니다.
- `flutter doctor`로 설치 상태를 점검했습니다.
- Chrome에서 카운터 앱을 실행하고 핫 리로드로 상태가 유지되는 것을 확인했습니다.
