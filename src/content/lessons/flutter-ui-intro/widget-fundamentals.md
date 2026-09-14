## 이 레슨에서 할 일

Birdle 게임판은 글자 한 칸짜리 **타일** 25개(5×5)로 이루어집니다. 이번 레슨에서는 이 타일을 표현하는 커스텀 위젯 `Tile`을 만들며 다음을 익힙니다.

- `StatelessWidget`을 상속해 나만의 위젯 만들기
- 생성자 매개변수로 위젯을 재사용 가능하게 만들기
- `Container`와 `BoxDecoration`으로 크기·테두리·배경색 꾸미기

## 1. 시작하기 전에: 게임 로직 파일 추가

단어 판정 같은 게임 로직은 튜토리얼 범위 밖이므로 미리 준비된 파일을 사용합니다. [공식 튜토리얼 페이지](https://docs.flutter.dev/learn/pathway/tutorial/widget-fundamentals)의 **Before you start** 단계에서 `game.dart`를 내려받아 `lib/game.dart`로 저장하세요. 이 파일에는 다음이 들어 있습니다.

```dart
// 글자 판정 결과
enum HitType { none, hit, partial, miss }

// 글자 한 칸: 문자와 판정 결과를 묶은 레코드
typedef Letter = ({String char, HitType type});

// 그 밖에 단어를 다루는 Word 클래스와
// 추측 목록(guesses)·판정 로직을 가진 Game 클래스
```

`lib/main.dart` 맨 위에 import를 추가합니다.

```dart
import 'package:flutter/material.dart';

import 'game.dart';
```

## 2. StatelessWidget의 구조

`MainApp` 클래스 아래에 `Tile` 위젯을 추가합니다.

```dart
class Tile extends StatelessWidget {
  const Tile(this.letter, this.hitType, {super.key});

  final String letter;
  final HitType hitType;

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

| 구성 요소 | 역할 |
| --- | --- |
| 생성자 | 표시할 글자(`letter`)와 판정 결과(`hitType`)를 받아 위젯을 재사용 가능하게 만듦 |
| `final` 필드 | 생성자로 받은 값을 보관. 위젯은 **불변**이므로 필드는 `final` |
| `build` 메서드 | 이 위젯이 그릴 **위젯 트리를 반환**. 모든 위젯이 반드시 구현 |

## 3. 커스텀 위젯 사용하기

`MainApp`의 `Text`를 `Tile`로 바꿉니다.

```dart
class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Tile('A', HitType.hit),
        ),
      ),
    );
  }
}
```

아직 `Tile`이 빈 `Container`를 반환하므로 화면에는 아무것도 보이지 않습니다.

## 4. Container로 크기 지정하기

```dart
@override
Widget build(BuildContext context) {
  return Container(
    width: 60,
    height: 60,
  );
}
```

`Container`는 자주 함께 쓰는 여러 위젯을 한데 묶은 **편의 위젯**입니다. 내부적으로 `Padding`, `ColoredBox`, `SizedBox`, `DecoratedBox` 등을 조합해 여백·크기·장식을 한 번에 지정하게 해 줍니다.

## 5. BoxDecoration으로 꾸미기

`decoration` 속성에 `BoxDecoration`을 넘겨 테두리를 그립니다.

```dart
return Container(
  width: 60,
  height: 60,
  decoration: BoxDecoration(
    border: Border.all(color: Colors.grey.shade300),
  ),
);
```

이제 `hitType`에 따라 배경색을 바꿉니다. Dart의 **switch 식**을 사용하면 값을 바로 고를 수 있습니다.

```dart
return Container(
  width: 60,
  height: 60,
  decoration: BoxDecoration(
    border: Border.all(color: Colors.grey.shade300),
    color: switch (hitType) {
      HitType.hit => Colors.green,
      HitType.partial => Colors.yellow,
      HitType.miss => Colors.grey,
      _ => Colors.white,
    },
  ),
);
```

| `HitType` | 색 | 의미 |
| --- | --- | --- |
| `hit` | 초록 | 글자와 위치가 모두 맞음 |
| `partial` | 노랑 | 단어에 있지만 위치가 다름 |
| `miss` | 회색 | 단어에 없는 글자 |
| `none` | 흰색 | 아직 판정 전 |

> **주의** `Container`에 `decoration`을 쓸 때는 `Container`의 `color` 속성을 함께 쓸 수 없습니다. 배경색은 위 코드처럼 `BoxDecoration` 안에 넣으세요.

## 6. 자식 위젯 추가하기

`child`에 `Center`와 `Text`를 넣어 글자를 가운데에 표시합니다.

```dart
class Tile extends StatelessWidget {
  const Tile(this.letter, this.hitType, {super.key});

  final String letter;
  final HitType hitType;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        color: switch (hitType) {
          HitType.hit => Colors.green,
          HitType.partial => Colors.yellow,
          HitType.miss => Colors.grey,
          _ => Colors.white,
        },
      ),
      child: Center(
        child: Text(
          letter.toUpperCase(),
          style: Theme.of(context).textTheme.titleLarge,
        ),
      ),
    );
  }
}
```

`Theme.of(context)`는 `BuildContext`를 이용해 위젯 트리 위쪽의 `MaterialApp`이 제공하는 테마를 찾아옵니다. 덕분에 글자 크기와 글꼴을 직접 정하지 않고 앱 테마의 `titleLarge` 스타일을 그대로 쓸 수 있습니다.

`MainApp`에서 `Tile`의 두 번째 인자를 바꿔 가며 핫 리로드로 색이 바뀌는지 확인해 보세요.

```dart
Tile('A', HitType.hit);     // 초록
Tile('A', HitType.miss);    // 회색
Tile('A', HitType.partial); // 노랑
```

## 핵심 정리

- `StatelessWidget`을 상속하고 `build()`에서 위젯을 반환해 **커스텀 위젯**을 만들었습니다.
- 생성자 매개변수와 `final` 필드로 같은 위젯을 다른 데이터로 **재사용**할 수 있습니다.
- `Container`로 크기를, `BoxDecoration`으로 테두리와 배경색을 지정했습니다.
- switch 식으로 enum 값에 따라 스타일을 조건부로 적용했습니다.
