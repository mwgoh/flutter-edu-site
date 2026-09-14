## 만들 앱: Birdle

이 레슨부터 다음 과정 **Flutter UI 입문**까지, New York Times의 단어 게임 Wordle과 비슷한 **Birdle**을 만듭니다. 다섯 글자 단어를 추측하면 글자마다 색으로 결과를 알려 주는 게임입니다.

- **초록**: 글자와 위치가 모두 맞음
- **노랑**: 단어에 있는 글자지만 위치가 다름
- **회색**: 단어에 없는 글자

이번 레슨에서는 프로젝트를 만들고 구조를 살펴본 뒤 핫 리로드를 사용해 봅니다.

## 1. 새 Flutter 프로젝트 만들기

터미널에서 다음 명령을 실행합니다.

```bash
flutter create birdle --empty
```

`--empty` 플래그를 붙이면 기본 카운터 예제 대신 **Hello World만 있는 최소 템플릿**으로 프로젝트가 만들어져, 불필요한 코드를 지우는 수고가 없습니다.

생성된 프로젝트의 주요 파일은 다음과 같습니다.

```text
birdle/
├── lib/
│   └── main.dart          # 앱 코드의 진입점
├── pubspec.yaml           # 앱 이름·버전·의존성(패키지) 설정
├── analysis_options.yaml  # 코드 분석(린트) 규칙
└── android/ ios/ web/ ... # 플랫폼별 호스트 프로젝트
```

## 2. 코드 살펴보기

`lib/main.dart`를 열어 보세요.

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello World!'),
        ),
      ),
    );
  }
}
```

- **`main()`**: Dart 프로그램의 진입점입니다.
- **`runApp()`**: 위젯 하나를 받아 **위젯 트리의 루트**로 만들고 화면에 그리기 시작합니다.
- **`MainApp`**: 상태가 없는 `StatelessWidget`입니다. 화면에 무엇을 그릴지는 `build()` 메서드가 반환하는 위젯으로 결정합니다.
- **`BuildContext`**: 위젯 트리에서 이 위젯의 위치를 가리키는 핸들입니다.

## 3. 위젯 트리

Flutter에서는 앱 설정, 페이지 구조, 정렬, 텍스트까지 **거의 모든 것이 위젯**입니다. 위젯이 다른 위젯을 자식으로 품으면서 계층 구조를 이루는데, 이를 **위젯 트리**라고 합니다.

```text
MainApp
└── MaterialApp        앱 전체 설정(테마, 내비게이션 등)
    └── Scaffold       Material 스타일 페이지 뼈대
        └── Center     자식을 가운데 정렬
            └── Text   'Hello World!' 표시
```

UI를 바꾸고 싶으면 이 트리를 이루는 위젯을 바꾸거나 새 위젯으로 감싸면 됩니다. 다음 레슨들에서 이 트리를 점점 키워 게임 화면을 완성합니다.

## 4. 앱 실행하기

```bash
cd birdle
flutter run -d chrome
```

`-d` 옵션으로 실행할 기기를 고릅니다. 연결된 기기 목록은 `flutter devices`로 확인할 수 있습니다. 빌드가 끝나면 Chrome에 "Hello World!"가 표시됩니다.

## 5. 핫 리로드 사용하기

1. `lib/main.dart`에서 `child: Text('Hello World!'),` 줄을 찾습니다.
2. 문자열을 원하는 문구로 바꾸고 저장합니다.
3. `flutter run`을 실행한 터미널에서 **`r`** 키를 누릅니다.

앱이 다시 시작되지 않고 바뀐 문구가 즉시 반영됩니다. `flutter run` 터미널에서 쓰는 주요 키는 다음과 같습니다.

| 키 | 동작 |
| --- | --- |
| `r` | 핫 리로드: 코드 변경을 반영하고 **앱 상태를 유지** |
| `R` | 핫 리스타트: 앱 상태를 초기화하고 처음부터 다시 실행 |
| `q` | 앱 종료 |

> **알아 두기** 핫 리로드는 바뀐 코드를 실행 중인 앱에 주입한 뒤 위젯 트리를 다시 빌드합니다. 그래서 `main()`이나 `initState()`처럼 **처음 한 번만 실행되는 초기화 코드**를 고쳤다면 핫 리스타트(`R`)가 필요합니다.

## 핵심 정리

- `flutter create 이름 --empty`로 최소 템플릿 프로젝트를 만들었습니다.
- `runApp()`이 루트 위젯을 받아 위젯 트리를 시작하고, 위젯은 `build()`로 하위 위젯을 반환합니다.
- `MaterialApp → Scaffold → Center → Text`로 이어지는 위젯 트리를 살펴봤습니다.
- `flutter run -d chrome`으로 실행하고, 터미널에서 `r`을 눌러 상태를 유지하는 핫 리로드를 체험했습니다.
