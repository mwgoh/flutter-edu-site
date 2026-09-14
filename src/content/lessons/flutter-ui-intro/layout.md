## 이 레슨에서 할 일

Flutter로 개발하면 레이아웃을 짜는 데 많은 시간을 씁니다. 이번 레슨에서는 두 종류의 레이아웃 위젯으로 Birdle의 **5×5 게임 보드**를 만듭니다.

- **고수준 위젯**: 화면 전체 구조를 잡는 `Scaffold`, `AppBar`
- **저수준 위젯**: 위젯을 세로·가로로 나열하는 `Column`, `Row`

## 1. Scaffold와 AppBar

모바일 앱은 보통 화면 위쪽에 제목과 동작 버튼이 있는 **앱 바**를 둡니다. `Scaffold`는 앱 바, 본문(body), 서랍(drawer), 하단 내비게이션 바 같은 **슬롯을 가진 Material 스타일 페이지 뼈대**이고, `AppBar`가 실제 앱 바 위젯입니다.

```dart
class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Align(
            alignment: Alignment.centerLeft,
            child: Text('Birdle'),
          ),
        ),
        body: const Center(
          child: Tile('A', HitType.hit),
        ),
      ),
    );
  }
}
```

이제 위젯 트리가 가지를 칩니다. `Scaffold` 아래에 `appBar`와 `body` 두 갈래가 생겼습니다.

## 2. GamePage 위젯 만들기

게임 화면 전체를 담당할 `GamePage` 위젯을 만듭니다. 게임 상태를 관리하는 `Game` 객체를 필드로 가집니다.

```dart
class GamePage extends StatelessWidget {
  GamePage({super.key});
  // game.dart에 정의된 객체로, 단어 판정 로직을 관리한다.
  final Game _game = Game();

  @override
  Widget build(BuildContext context) {
    // TODO: 화면 내용으로 교체
    return Container();
  }
}
```

`MainApp`의 `body`를 `GamePage`로 바꿉니다.

```dart
body: Center(child: GamePage()),
```

> **const를 뺀 이유** `GamePage`는 `Game()`처럼 상수가 아닌 값으로 필드를 초기화하므로 `const` 생성자를 가질 수 없습니다. 그래서 `GamePage()`와 이를 감싸는 `Center`, `MaterialApp`에서 `const`를 제거했습니다. `const`는 인자가 모두 상수인 위젯에만 붙일 수 있습니다.

## 3. Column과 Row로 배치하기

게임 보드는 **추측 5번 × 글자 5개**입니다. 세로로 5줄을 쌓을 때는 `Column`, 한 줄 안에서 타일 5개를 가로로 늘어놓을 때는 `Row`를 씁니다.

먼저 여백과 `Column`을 추가합니다.

```dart
class GamePage extends StatelessWidget {
  GamePage({super.key});
  final Game _game = Game();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        spacing: 5.0,
        children: [
          // 다음 단계에서 자식을 추가한다.
        ],
      ),
    );
  }
}
```

`spacing: 5.0`은 **주축(main axis)** 방향으로 자식 사이에 5픽셀 간격을 넣습니다. `Column`의 주축은 세로, `Row`의 주축은 가로입니다. 주축과 교차축 정렬은 각각 `mainAxisAlignment`, `crossAxisAlignment`로 조절합니다.

## 4. 컬렉션 for로 줄 만들기

`_game.guesses`는 크기가 5로 고정된 추측 목록입니다. **컬렉션 for**를 쓰면 목록의 항목마다 `Row`를 하나씩 만들 수 있습니다.

```dart
child: Column(
  spacing: 5.0,
  children: [
    for (final guess in _game.guesses)
      Row(
        spacing: 5.0,
        children: [
          // 타일은 다음 단계에서 추가한다.
        ],
      ),
  ],
),
```

같은 코드를 `map`으로 쓰면 다음과 같습니다. 컬렉션 for가 데이터 구조를 더 직관적으로 드러냅니다.

```dart
[..._game.guesses.map((guess) => Row(/* ... */))],
```

## 5. 도전 과제: 5×5 타일 채우기

각 `guess`는 글자 5개의 목록이고, 글자 하나(`letter`)는 `({String char, HitType type})` 레코드입니다. 안쪽 `Row`에도 컬렉션 for를 써서 `Tile`을 채워 보세요.

정답 코드는 다음과 같습니다.

```dart
class GamePage extends StatelessWidget {
  GamePage({super.key});
  final Game _game = Game();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        spacing: 5.0,
        children: [
          for (final guess in _game.guesses)
            Row(
              spacing: 5.0,
              children: [
                for (final letter in guess) Tile(letter.char, letter.type),
              ],
            ),
        ],
      ),
    );
  }
}
```

완성된 위젯 트리는 다음과 같습니다.

```text
GamePage
└── Padding
    └── Column
        ├── Row ── Tile × 5
        ├── Row ── Tile × 5
        ├── Row ── Tile × 5
        ├── Row ── Tile × 5
        └── Row ── Tile × 5
```

핫 리로드하면 빈 타일 25개로 된 게임 보드가 나타납니다.

## 핵심 정리

- `Scaffold`와 `AppBar`로 Material 스타일 화면 구조를 만들었습니다.
- `Column`은 세로, `Row`는 가로로 자식을 배치하며 `spacing`으로 간격을 줍니다.
- **컬렉션 for**로 데이터 목록에서 위젯을 선언적으로 생성했습니다.
- `Column` 안에 `Row`를 중첩해 5×5 게임 보드를 완성했습니다.

> **더 알아보기** [Dart 레코드](https://dart.dev/language/records) · [컬렉션 for](https://dart.dev/language/collections#for-element) · [레이아웃 소개](https://docs.flutter.dev/ui/layout)
