## 왜 Dart를 먼저 배우나요?

Flutter 앱은 **Dart** 언어로 작성합니다. Dart는 개발 중에는 JIT 컴파일로 핫 리로드를 지원하고, 릴리스 빌드에서는 AOT 컴파일로 네이티브 코드를 만들며, 웹에서는 JavaScript나 WebAssembly로 컴파일됩니다.

공식 Learn 경로는 Flutter 튜토리얼을 시작하기 전에 [dart.dev의 Dart 튜토리얼](https://dart.dev/learn/tutorial)을 먼저 보길 권장합니다. 이 레슨은 그중 **이후 Flutter 튜토리얼에 실제로 나오는 문법**만 추려 정리했습니다.

> **팁** 모든 예제는 설치 없이 [DartPad](https://dartpad.dev)에 붙여 넣어 바로 실행해 볼 수 있습니다.

## 1. main 함수와 출력

모든 Dart 프로그램은 `main()` 함수에서 시작합니다.

```dart
void main() {
  print('Hello, Dart!');
}
```

## 2. 변수: var, final, const

```dart
var name = 'Birdle';              // 타입 추론(String), 다시 대입 가능
String title = 'Flutter';         // 타입을 명시
final createdAt = DateTime.now(); // 한 번만 대입 가능(런타임에 결정)
const maxGuesses = 5;             // 컴파일 타임 상수
```

| 키워드 | 다시 대입 | 값이 정해지는 시점 |
| --- | --- | --- |
| `var` / 타입 | 가능 | 런타임 |
| `final` | 불가 | 런타임(최초 대입 시) |
| `const` | 불가 | 컴파일 타임 |

Flutter에서는 `const Text('Hello')`처럼 위젯에도 `const`를 붙입니다. 컴파일 타임에 만들어진 같은 인스턴스를 재사용하므로 다시 빌드할 때 불필요한 작업이 줄어듭니다.

## 3. Null safety

Dart는 **sound null safety**를 지원합니다. 타입 뒤에 `?`를 붙여야만 `null`을 담을 수 있습니다.

```dart
String? description;   // null 가능
String title = 'Dart'; // null 불가: title = null; 은 컴파일 오류

void main() {
  // ?. : 대상이 null이면 null을 반환, ?? : 왼쪽이 null이면 오른쪽 값을 사용
  final length = description?.length ?? 0;
  print(length); // 0

  // null 검사 후에는 자동으로 non-null 타입으로 승격된다
  if (description != null) {
    print(description.length);
  }
}
```

- `!` 연산자는 "이 값은 null이 아니다"라고 단언합니다. 실제로 null이면 런타임 오류가 나므로 꼭 필요할 때만 씁니다.
- `late`는 "선언 시점이 아니라 나중에 초기화하겠다"는 약속입니다.

## 4. 함수와 매개변수

```dart
// 화살표(=>) 함수: 식 하나를 반환
int add(int a, int b) => a + b;

// 중괄호 {} 안은 이름 있는 매개변수. required는 필수, 기본값도 지정 가능
void greet({required String name, String greeting = '안녕하세요'}) {
  print('$greeting, $name!'); // 문자열 보간
}

void main() {
  print(add(2, 3));  // 5
  greet(name: '대시'); // 안녕하세요, 대시!
}
```

Dart에서 함수는 값처럼 변수에 담거나 매개변수로 넘길 수 있습니다. Flutter에서 **콜백**을 받을 때 자주 쓰는 형태입니다.

```dart
// String을 받고 아무것도 반환하지 않는 함수 타입의 필드
final void Function(String) onSubmitGuess;

// 익명 함수를 넘기기
onSubmitGuess: (guess) {
  print(guess);
},
```

## 5. 클래스와 생성자

```dart
class Tile {
  // this.letter: 매개변수를 같은 이름의 필드에 바로 대입(초기화 형식 매개변수)
  const Tile(this.letter, this.hitType);

  final String letter;
  final HitType hitType;

  // getter
  bool get isEmpty => letter.isEmpty;
}
```

Flutter 위젯 클래스에서 보게 될 문법은 다음과 같습니다.

```dart
class MainApp extends StatelessWidget {   // extends: 상속
  const MainApp({super.key});             // super.key: key를 부모 생성자로 전달

  @override                               // 부모 메서드 재정의
  Widget build(BuildContext context) {
    return const Text('Hello');
  }
}
```

- 이름이 `_`로 시작하는 멤버(`_counter`, `_GamePageState`)는 **라이브러리(파일) 전용(private)**입니다.
- `static` 메서드나 **팩터리/이름 있는 생성자**(`Summary.fromJson(...)`)로 JSON 같은 데이터에서 객체를 만듭니다.

## 6. enum과 typedef, 레코드

```dart
enum HitType { none, hit, partial, miss }

// 이름 있는 필드를 가진 레코드 타입에 별칭을 붙인다
typedef Letter = ({String char, HitType type});

void main() {
  final Letter letter = (char: 'a', type: HitType.hit);
  print(letter.char); // a

  // 위치 기반 레코드: $1, $2로 접근
  final (int, String) pair = (1, 'one');
  print(pair.$2); // one
}
```

레코드는 클래스를 따로 만들지 않고 여러 값을 하나로 묶을 때 편리합니다. Birdle 게임의 글자 한 칸이 바로 `({String char, HitType type})` 레코드입니다.

## 7. switch 식과 패턴

`switch` **식**은 값을 바로 반환합니다. `_`는 나머지 모든 경우를 뜻합니다.

```dart
String colorOf(HitType hitType) => switch (hitType) {
  HitType.hit => 'green',
  HitType.partial => 'yellow',
  HitType.miss => 'grey',
  _ => 'white',
};
```

여러 값을 레코드로 묶어 한 번에 검사할 수도 있습니다. 이 패턴은 상태 관리 과정에서 로딩·오류·성공 상태를 처리할 때 사용합니다.

```dart
String describe(bool isLoading, Exception? error) {
  return switch ((isLoading, error)) {
    (true, _) => '불러오는 중...',
    (_, final Exception e) => '오류: $e',
    _ => '완료',
  };
}
```

맵 패턴은 JSON의 구조와 타입을 검사하면서 값을 꺼냅니다.

```dart
void main() {
  final json = <String, Object?>{'title': 'Flutter', 'pageid': 123};

  if (json case {'title': final String title, 'pageid': final int id}) {
    print('$title ($id)'); // Flutter (123)
  }
}
```

## 8. 컬렉션과 컬렉션 for · if

```dart
void main() {
  final guesses = ['aback', 'abase'];    // List
  final scores = {'kim': 3, 'lee': 5};   // Map
  final letters = {'a', 'b'};            // Set

  final items = [
    for (final guess in guesses) guess.toUpperCase(), // 컬렉션 for
    if (guesses.isEmpty) 'EMPTY',                     // 컬렉션 if
    ...['extra'],                                     // 스프레드
  ];
  print(items); // [ABACK, ABASE, extra]
}
```

Flutter에서는 위젯 목록을 만들 때 그대로 씁니다.

```dart
Row(
  children: [
    for (final letter in guess) Tile(letter.char, letter.type),
  ],
)
```

## 9. 비동기: Future, async, await

네트워크 요청처럼 시간이 걸리는 작업은 `Future`를 반환합니다. `async` 함수 안에서 `await`로 결과를 기다립니다.

```dart
Future<String> fetchTitle() async {
  await Future.delayed(const Duration(seconds: 1)); // 1초 기다리기
  return 'Flutter';
}

Future<void> main() async {
  print('요청 시작');
  final title = await fetchTitle();
  print('받은 제목: $title');
}
```

오류는 `try`/`on`/`catch`로 처리합니다.

```dart
try {
  final title = await fetchTitle();
  print(title);
} on FormatException catch (e) {
  print('형식 오류: ${e.message}'); // 특정 예외 타입만 잡기
} catch (e) {
  print('알 수 없는 오류: $e');
}
```

> Dart는 단일 스레드 이벤트 루프에서 동작합니다. `await`는 스레드를 멈추는 것이 아니라, 작업이 끝날 때까지 다른 이벤트를 처리하다가 결과가 오면 이어서 실행합니다.

## 10. 최신 Dart에서 보게 될 문법

- **와일드카드 `_`**: 쓰지 않는 매개변수는 `(_) { ... }`처럼 `_`로 표시합니다.
- **dot shorthand**(Dart 3.10 이상): 문맥상 타입이 분명하면 `MainAxisAlignment.center`를 `.center`로 줄여 쓸 수 있습니다. 튜토리얼 코드는 긴 형태를 쓰지만, 최신 샘플에서 짧은 형태를 만나도 당황하지 마세요.

## 핵심 정리

- `final`은 한 번만 대입, `const`는 컴파일 타임 상수이며 Flutter 위젯에도 적극 사용합니다.
- `?`는 nullable 타입, `?.`·`??`·`!`로 null을 다룹니다.
- `{required ...}` 이름 있는 매개변수와 `super.key`는 위젯 생성자의 기본 형태입니다.
- 레코드, switch 식, 패턴, 컬렉션 for/if는 Flutter 튜토리얼 곳곳에서 사용됩니다.
- `async`/`await`와 `try`/`catch`로 비동기 작업과 오류를 처리합니다.
