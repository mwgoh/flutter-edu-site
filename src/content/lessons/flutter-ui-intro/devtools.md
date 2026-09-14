## 이 레슨에서 할 일

**Dart DevTools**는 Flutter 앱을 검사하고 디버깅하는 도구 모음입니다. 이번 레슨에서는 그중 개발 중 가장 자주 쓰는 두 가지를 다룹니다.

- **위젯 인스펙터(Widget Inspector)**: 위젯 트리를 시각적으로 탐색
- **속성 편집기(Property Editor)**: 선택한 위젯의 속성을 보고 실시간으로 수정

## 1. DevTools 실행하기

앱을 디버그 모드로 실행한 상태에서, **다른 터미널 창**에 다음 명령을 입력합니다.

```bash
dart devtools
```

DevTools 서버가 시작되고 브라우저에 DevTools 화면이 열립니다. 이제 실행 중인 앱에 연결합니다.

1. `flutter run`을 실행한 터미널에서 DevTools 주소를 찾습니다. 예: `Serving DevTools at http://127.0.0.1:9101`
2. 이 주소를 복사합니다.
3. DevTools 브라우저 화면의 연결 입력란에 붙여 넣습니다.

> **팁** VS Code, IntelliJ, Android Studio에 Flutter 플러그인을 설치했다면 IDE 안에서 바로 DevTools를 열 수 있습니다. VS Code에서는 명령 팔레트에서 `Dart: Open DevTools`를 실행해 보세요.

## 2. 위젯 인스펙터

위젯 인스펙터는 앱의 위젯 트리를 그대로 보여 줍니다. 지금까지 만든 Birdle 앱을 열면 다음과 같은 구조를 확인할 수 있습니다.

```text
MaterialApp
└── Scaffold (home)
    └── Center
        └── GamePage
            └── Padding
                └── Column
                    └── Row ── Tile ...
```

위젯 인스펙터로 할 수 있는 일은 다음과 같습니다.

- 트리에서 위젯을 선택해 **속성 확인**
- 선택한 위젯의 **소스 코드 위치로 바로 이동**
- 화면의 어느 부분을 어떤 위젯이 그리는지 파악

## 3. 레이아웃 문제 디버깅: unbounded constraints

Flutter에서 가장 흔한 오류 중 하나가 **unbounded constraints(무한 제약)** 오류입니다.

위젯의 제약에서 최대 너비나 최대 높이가 `double.infinity`이면 제약이 **unbounded**라고 합니다. 이때 **최대한 커지려는 위젯**을 넣으면 크기를 정할 수 없어 디버그 모드에서 예외가 발생합니다. 주로 다음 상황에서 생깁니다.

- `Row`나 `Column` 같은 flex 위젯 안에 제약 없이 넣은 경우
- `ListView` 같은 스크롤 영역 안에 넣은 경우

대표적인 예로, 세로로 무한히 늘어날 수 있는 `Column` 안에 `ListView`를 그냥 넣으면 `ListView`가 무한한 높이를 받아 오류가 납니다.

```dart
// 오류: ListView가 Column으로부터 무한한 높이를 받는다
Column(
  children: [
    const Text('제목'),
    ListView(children: const [Text('A'), Text('B')]),
  ],
)
```

`Expanded`로 감싸 **남은 공간만큼** 크기를 정해 주면 해결됩니다.

```dart
Column(
  children: [
    const Text('제목'),
    Expanded(
      child: ListView(children: const [Text('A'), Text('B')]),
    ),
  ],
)
```

공식 문서가 드는 또 다른 고전적인 예는 **가로 스크롤 `ListView` 안에 세로 스크롤 `ListView`를 중첩**하는 경우입니다. 안쪽 목록이 최대한 넓어지려 하는데, 바깥 목록이 가로로 스크롤되므로 너비가 무한해집니다.

위젯 인스펙터에서 문제가 된 위젯을 선택하면 전달된 제약을 확인할 수 있어 원인을 빠르게 찾을 수 있습니다.

## 4. 속성 편집기

위젯 인스펙터에서 위젯을 선택하면 **속성 편집기**가 그 위젯의 모든 속성을 보여 줍니다. `Tile`의 `Container`를 선택하면 다음과 같은 속성이 표시됩니다.

- `width`: 60
- `height`: 60
- `decoration`: 펼치면 `border`, `color` 확인 가능

속성 값을 직접 바꿔 보세요. 예를 들어 `width`와 `height`를 바꾸면 도구가 **디스크의 `.dart` 소스 파일을 직접 수정**하고, 저장하거나 핫 리로드하면 실행 중인 앱에 바로 반영됩니다. UI를 세밀하게 다듬을 때 빠르게 반복 실험할 수 있습니다.

## 핵심 정리

- `dart devtools`로 DevTools를 실행하고 `flutter run`이 출력한 주소로 앱에 연결했습니다.
- **위젯 인스펙터**로 위젯 트리를 시각화하고, 속성을 확인하고, 소스 코드로 이동할 수 있습니다.
- **unbounded constraints** 오류는 최대한 커지려는 위젯이 무한한 제약을 받을 때 생기며, `Expanded` 등으로 크기를 제한해 해결합니다.
- **속성 편집기**로 속성 값을 바꾸면 소스 파일에 반영되어 빠르게 UI를 실험할 수 있습니다.
