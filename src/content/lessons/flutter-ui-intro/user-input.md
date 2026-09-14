## 이 레슨에서 할 일

게임 보드는 완성했지만 아직 단어를 입력할 방법이 없습니다. 이번 레슨에서는 다섯 글자 추측을 입력받는 `GuessInput` 위젯을 만듭니다.

- `TextField`로 텍스트 입력 받기
- `TextEditingController`로 입력 값 읽고 지우기
- `FocusNode`로 입력 포커스 제어하기
- 콜백과 `IconButton`으로 사용자 동작 처리하기

## 1. 콜백 함수를 받는 위젯

입력한 단어로 무엇을 할지는 부모(`GamePage`)가 정하도록, `GuessInput`은 **콜백 함수**를 매개변수로 받습니다.

```dart
class GuessInput extends StatelessWidget {
  GuessInput({super.key, required this.onSubmitGuess});

  final void Function(String) onSubmitGuess;

  @override
  Widget build(BuildContext context) {
    // 다음 단계에서 UI를 만든다.
    return Container();
  }
}
```

`final void Function(String) onSubmitGuess;`는 **`String` 하나를 받고 아무것도 반환하지 않는 함수**를 담는 필드입니다. 위젯이 구체적인 동작과 분리되어 재사용하기 쉬워집니다.

## 2. TextField 추가하기

```dart
@override
Widget build(BuildContext context) {
  return Row(
    children: [
      Expanded(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: TextField(
            maxLength: 5,
            decoration: const InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(35)),
              ),
            ),
          ),
        ),
      ),
    ],
  );
}
```

- **`TextField`**: Flutter의 기본 텍스트 입력 위젯
- **`maxLength: 5`**: 다섯 글자까지만 입력 가능
- **`decoration`**: `OutlineInputBorder`로 둥근 테두리 적용
- **`Expanded`**: `TextField`가 `Row`의 남은 가로 공간을 채우게 함

> **팁** `TextField`는 가능한 한 넓어지려 하므로 `Row` 안에 그냥 넣으면 unbounded width 오류가 납니다. `Expanded`로 감싸면 해결됩니다.

## 3. TextEditingController로 텍스트 다루기

`TextEditingController`를 연결하면 코드에서 입력 값을 읽고, 지우고, 바꿀 수 있습니다. 사용자가 Enter를 누르면 호출되는 `onSubmitted`에서 값을 출력하고 입력란을 비워 봅니다.

```dart
class GuessInput extends StatelessWidget {
  GuessInput({super.key, required this.onSubmitGuess});

  final void Function(String) onSubmitGuess;

  final TextEditingController _textEditingController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              maxLength: 5,
              decoration: const InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(35)),
                ),
              ),
              controller: _textEditingController,
              onSubmitted: (_) {
                print(_textEditingController.text); // 임시 출력
                _textEditingController.clear();
              },
            ),
          ),
        ),
      ],
    );
  }
}
```

쓰지 않는 콜백 매개변수는 `_`(와일드카드)로 표시하는 것이 Dart 모범 사례입니다.

## 4. 입력 포커스 제어하기

앱을 열자마자 입력할 수 있도록 `autofocus: true`를 지정합니다. 그런데 Enter를 누르면 포커스가 사라져 매번 입력란을 다시 클릭해야 합니다. `FocusNode`로 제출 후에도 포커스를 되돌려 줍니다.

```dart
final FocusNode _focusNode = FocusNode();

// TextField 속성
autofocus: true,
focusNode: _focusNode,
onSubmitted: (input) {
  print(input);
  _textEditingController.clear();
  _focusNode.requestFocus(); // 포커스를 다시 입력란으로
},
```

| 속성·메서드 | 역할 |
| --- | --- |
| `autofocus: true` | 처음 빌드될 때 포커스를 줌 |
| `FocusNode` | 키보드 포커스를 코드로 관리 |
| `requestFocus()` | 연결된 위젯으로 포커스를 이동 |

## 5. 입력 값 사용하기

이제 `print` 대신 콜백을 호출합니다. `.trim()`으로 앞뒤 공백을 없애 "네 글자+공백" 같은 입력을 막습니다.

```dart
onSubmitted: (input) {
  onSubmitGuess(_textEditingController.text.trim());
  _textEditingController.clear();
  _focusNode.requestFocus();
},
```

`GamePage`의 게임 보드 아래에 `GuessInput`을 추가합니다.

```dart
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
    GuessInput(
      onSubmitGuess: (guess) {
        // TODO: 추측 처리
        print(guess); // 임시 출력
      },
    ),
  ],
),
```

## 6. 버튼 추가와 공통 로직 정리

휴대폰에서는 Enter 대신 누를 버튼이 있으면 편리합니다. `TextField` 옆에 `IconButton`을 두고, Enter와 버튼이 **같은 제출 로직**을 쓰도록 `_onSubmit` 메서드로 묶습니다.

```dart
class GuessInput extends StatelessWidget {
  GuessInput({super.key, required this.onSubmitGuess});

  final void Function(String) onSubmitGuess;

  final TextEditingController _textEditingController = TextEditingController();

  final FocusNode _focusNode = FocusNode();

  void _onSubmit() {
    onSubmitGuess(_textEditingController.text.trim());
    _textEditingController.clear();
    _focusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              maxLength: 5,
              focusNode: _focusNode,
              autofocus: true,
              decoration: const InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(35)),
                ),
              ),
              controller: _textEditingController,
              onSubmitted: (_) {
                _onSubmit();
              },
            ),
          ),
        ),
        IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(Icons.arrow_circle_up),
          onPressed: _onSubmit,
        ),
      ],
    );
  }
}
```

- `onSubmitted`: 키보드에서 Enter를 눌렀을 때 호출
- `onPressed`: 버튼을 탭했을 때 호출. `null`을 넘기면 버튼이 비활성화됩니다.

> **다음 레슨 예고** 지금은 `StatelessWidget` 안에서 컨트롤러와 `FocusNode`를 만들고 있습니다. 부모가 다시 빌드될 때마다 이 객체들이 새로 생성되어 포커스를 잃고, 해제(dispose)도 되지 않는 문제가 있습니다. 다음 레슨에서 `StatefulWidget`으로 바꿔 해결합니다.

## 핵심 정리

- `TextField`와 `Expanded`로 남은 공간을 채우는 입력란을 만들었습니다.
- `TextEditingController`의 `text`로 값을 읽고 `clear()`로 지웠습니다.
- `autofocus`와 `FocusNode.requestFocus()`로 매끄러운 입력 흐름을 만들었습니다.
- 콜백(`onSubmitGuess`)으로 위젯을 동작과 분리하고, `onSubmitted`·`onPressed`에서 같은 로직을 재사용했습니다.
