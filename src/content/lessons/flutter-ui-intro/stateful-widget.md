## 이 레슨에서 할 일

지금 Birdle은 단어를 입력해도 보드가 변하지 않습니다. 추측할 때마다 타일에 글자가 채워지고 판정 색이 표시되어야 합니다. 이번 레슨에서는 다음을 배웁니다.

- 위젯이 **상태(state)**를 가져야 하는 경우 판단하기
- `StatelessWidget`을 `StatefulWidget`으로 변환하기
- `setState`로 UI 갱신을 요청하기

## 1. 왜 StatefulWidget인가?

위젯의 **모양이나 데이터가 생명주기 동안 바뀌어야 한다면** `StatefulWidget`과 짝이 되는 `State` 객체를 사용합니다.

- `StatefulWidget` 자체는 여전히 **불변**입니다.
- 짝이 되는 `State` 객체는 **오래 살아남으며** 바뀌는 데이터를 보관하고, 데이터가 바뀌면 다시 빌드되어 UI를 갱신합니다.

기본 구조는 다음과 같습니다.

```dart
class ExampleWidget extends StatefulWidget {
  const ExampleWidget({super.key});

  @override
  State<ExampleWidget> createState() => _ExampleWidgetState();
}

class _ExampleWidgetState extends State<ExampleWidget> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

## 2. GamePage를 StatefulWidget으로 변환

1. `GamePage`가 `StatefulWidget`을 상속하도록 바꿉니다.
2. `State<GamePage>`를 상속하는 `_GamePageState` 클래스를 만듭니다.
3. `build` 메서드와 `_game` 필드를 `_GamePageState`로 옮깁니다.
4. `createState()`에서 `_GamePageState`를 반환합니다.

> **팁** VS Code와 IntelliJ에서 클래스 이름에 커서를 두고 빠른 수정(`Ctrl + .`)을 열면 **Convert to StatefulWidget**으로 자동 변환할 수 있습니다.

```dart
class GamePage extends StatefulWidget {
  const GamePage({super.key});

  @override
  State<GamePage> createState() => _GamePageState();
}

class _GamePageState extends State<GamePage> {
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
          GuessInput(
            onSubmitGuess: (guess) {
              // TODO: 추측 처리
            },
          ),
        ],
      ),
    );
  }
}
```

`_game` 필드가 `State`로 옮겨졌으므로 이제 `GamePage`는 `const` 생성자를 가질 수 있습니다.

## 3. setState로 UI 갱신하기

`State` 객체의 데이터를 바꿀 때는 반드시 `setState`를 호출해 프레임워크에 **"다시 빌드해 달라"**고 알려야 합니다.

```dart
GuessInput(
  onSubmitGuess: (String guess) {
    setState(() {
      _game.guess(guess);
    });
  },
),
```

사용자가 추측하면 다음 순서로 동작합니다.

1. `_game.guess(guess)`가 추측을 `Game` 객체에 저장하고 판정합니다.
2. `setState`가 프레임워크에 변경을 알립니다.
3. `build`가 다시 실행되어 보드에 글자와 색이 표시됩니다.

> **중요** `setState` 없이 `_game.guess(guess)`만 호출하면 내부 데이터는 바뀌지만 Flutter는 화면을 다시 그려야 한다는 사실을 모릅니다. 사용자는 아무 변화도 보지 못합니다.

## 4. GuessInput도 StatefulWidget으로

`GamePage`가 다시 빌드되면 자식인 `GuessInput`도 새로 만들어집니다. `GuessInput`이 `StatelessWidget`이면 그 안의 `TextEditingController`와 `FocusNode`도 매번 **새로 생성**되어 다음 문제가 생깁니다.

- 추측할 때마다 입력란의 포커스를 잃음
- 이전 컨트롤러가 해제(dispose)되지 않고 남음

`GuessInput`을 `StatefulWidget`으로 바꾸고, 컨트롤러·포커스 노드·제출 로직을 `State`로 옮긴 뒤 `dispose()`에서 정리합니다.

```dart
class GuessInput extends StatefulWidget {
  const GuessInput({super.key, required this.onSubmitGuess});

  final void Function(String) onSubmitGuess;

  @override
  State<GuessInput> createState() => _GuessInputState();
}

class _GuessInputState extends State<GuessInput> {
  final TextEditingController _textEditingController = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  @override
  void dispose() {
    _textEditingController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onSubmit() {
    widget.onSubmitGuess(_textEditingController.text.trim());
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

- `State` 안에서는 **`widget.`**을 통해 `StatefulWidget`의 필드(`widget.onSubmitGuess`)에 접근합니다.
- `_GuessInputState`는 부모가 다시 빌드되어도 **유지**되므로 포커스가 사라지지 않습니다.

## 5. State 생명주기 한눈에 보기

| 메서드 | 호출 시점 | 주 용도 |
| --- | --- | --- |
| `initState()` | `State`가 처음 만들어질 때 한 번 | 초기화, 구독 시작. `super.initState()` 먼저 호출 |
| `build()` | 처음 그리고 `setState`·부모 변경 등으로 다시 그릴 때 | UI 반환(빠르고 부작용 없게) |
| `didUpdateWidget()` | 부모가 새 설정으로 위젯을 다시 만들 때 | 이전 위젯과 비교해 대응 |
| `dispose()` | `State`가 영구히 제거될 때 | 컨트롤러·타이머·구독 해제. `super.dispose()` 마지막에 호출 |

## 핵심 정리

- 데이터가 **시간에 따라 바뀌고 UI가 따라 바뀌어야 하면** `StatefulWidget`을 씁니다.
- `GamePage`와 `GuessInput`을 `StatefulWidget` + `State` 쌍으로 변환했습니다.
- `setState` 안에서 상태를 바꿔야 `build`가 다시 실행되어 화면에 반영됩니다.
- 컨트롤러와 `FocusNode`는 `State`에 두고 `dispose()`에서 해제합니다.
