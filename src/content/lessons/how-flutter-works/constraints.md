## 핵심 규칙 한 줄

Flutter 레이아웃을 이해하는 열쇠는 다음 한 문장입니다.

> **제약은 내려가고, 크기는 올라가며, 위치는 부모가 정한다.**
> (Constraints go down. Sizes go up. Parent sets position.)

"왜 `width: 100`을 줬는데 화면을 꽉 채우지?" 같은 의문은 대부분 이 규칙으로 풀립니다.

## 1. 규칙 풀어 보기

**제약(constraint)**은 네 개의 숫자, 즉 **최소·최대 너비와 최소·최대 높이**입니다.

1. 위젯은 **부모에게서** 자신의 제약을 받습니다.
2. 위젯은 자식들에게 하나씩 **각자의 제약**을 알려 주고, 각 자식이 **어떤 크기가 되고 싶은지** 묻습니다.
3. 위젯은 자식들을 가로(x축)·세로(y축)로 하나씩 **배치**합니다.
4. 마지막으로 위젯은 **원래 받은 제약 안에서** 자신의 크기를 부모에게 알립니다.

## 2. 협상 과정 예시

여백이 5픽셀인 위젯이 자식 둘을 세로로 배치하는 과정을 대화로 표현하면 다음과 같습니다.

```text
위젯: "부모님, 제 제약이 뭔가요?"
부모: "너비 0~300, 높이 0~85 사이여야 해."

위젯: "여백 5픽셀을 두려면 자식들은 최대 너비 290, 높이 75까지 쓸 수 있겠군."

위젯: "첫째야, 너비 0~290, 높이 0~75 사이로 해."
첫째: "그럼 290×20 할게요."

위젯: "그러면 둘째에게는 높이 55가 남는구나."

위젯: "둘째야, 너비 0~290, 높이 0~55 사이로 해."
둘째: "140×30 할게요."

위젯: "좋아. 첫째는 (5, 5), 둘째는 (80, 25)에 둘게."
위젯: "부모님, 제 크기는 300×60입니다."
```

## 3. 규칙에서 나오는 한계

- **위젯은 부모가 허용하는 만큼만 커질 수 있습니다.** 원하는 크기를 마음대로 가질 수 없습니다.
- **위젯은 화면에서 자신의 위치를 모릅니다.** 위치는 부모가 정합니다.
- **크기와 위치는 트리 전체에 따라 달라집니다.** 위젯 하나만 보고는 정확히 알 수 없습니다.
- 자식이 부모와 다른 크기를 원할 때 부모에게 **정렬 정보가 없으면** 자식의 크기가 무시될 수 있습니다. 정렬은 명시적으로 지정하세요.

## 4. tight 제약과 loose 제약

| 종류 | 조건 | 의미 | 예 |
| --- | --- | --- | --- |
| **tight** | 최소 = 최대 | 크기가 **정확히 하나로 강제**됨 | 화면이 루트 위젯에게 "정확히 화면 크기" |
| **loose** | 최소 = 0 | 최대값 **이하에서 자유롭게** 선택 | `Center`가 자식에게 "화면 크기 이하면 아무거나" |

## 5. 세 종류의 상자

제약을 받았을 때 위젯이 크기를 정하는 방식은 크게 세 가지입니다.

- **최대한 커지려는 위젯**: `Center`, `ListView`
- **자식과 같은 크기가 되려는 위젯**: `Transform`, `Opacity`
- **특정 크기가 되려는 위젯**: `Image`, `Text`

`Container`처럼 생성자 인자에 따라 동작이 달라지는 위젯도 있습니다.

## 6. 예제로 익히기

아래 예제는 공식 문서의 번호를 그대로 따릅니다. 코드를 보고 결과를 먼저 예측해 보세요.

### 예제 1

```dart
Container(color: red)
```

화면은 루트 위젯에 **tight 제약**을 줍니다. `Container`는 화면과 정확히 같은 크기가 되어 화면 전체를 빨갛게 칠합니다.

### 예제 2

```dart
Container(width: 100, height: 100, color: red)
```

`Container`는 100×100이 되고 싶지만 **화면이 정확히 화면 크기가 되라고 강제**하므로 여전히 화면 전체를 칠합니다. 원하는 크기는 제약 안에서만 존중됩니다.

### 예제 3

```dart
Center(child: Container(width: 100, height: 100, color: red))
```

화면은 `Center`에게 화면을 채우라고 강제하지만, `Center`는 자식에게 **"화면 크기 이하면 원하는 대로"라는 loose 제약**을 줍니다. 이제 `Container`는 100×100이 됩니다.

### 예제 6

```dart
Center(child: Container(color: red))
```

`Center`는 loose 제약을 주지만, 자식도 크기도 없는 `Container`는 **설계상 최대한 커지기로** 되어 있어 화면을 채웁니다. 이는 `Container` 위젯의 의도된 동작입니다.

### 예제 10

```dart
Center(
  child: ConstrainedBox(
    constraints: const BoxConstraints(
      minWidth: 70,
      minHeight: 70,
      maxWidth: 150,
      maxHeight: 150,
    ),
    child: Container(color: red, width: 10, height: 10),
  ),
)
```

`ConstrainedBox`는 부모 제약에 **추가 제약**을 더합니다. `Container`는 10×10을 원하지만 최소가 70이므로 **70×70**이 됩니다.

### 예제 13

```dart
UnconstrainedBox(
  child: Container(color: red, width: 20, height: 50),
)
```

`UnconstrainedBox`는 부모의 제약을 무시하고 **자식이 원하는 크기를 그대로** 허용합니다. `Container`는 20×50이 됩니다.

### 예제 14

```dart
UnconstrainedBox(
  child: Container(color: red, width: 4000, height: 50),
)
```

자식이 화면보다 커져 넘치므로, 디버그 모드에서 **노랑·검정 줄무늬의 오버플로 경고**가 표시됩니다.

### 예제 25

```dart
Row(
  children: [
    Expanded(
      child: Container(color: red, child: const Text('...')),
    ),
    Container(color: green, child: const Text('Goodbye!')),
  ],
)
```

`Row`의 자식을 `Expanded`로 감싸면, `Row`는 그 자식이 원하는 너비를 무시하고 **다른 자식들의 크기를 먼저 정한 뒤 남은 공간을 강제로** 줍니다.

## 7. 실전에서 기억할 것

- 자식이 **원하는 크기를 갖게 하려면** `Center`나 `Align`으로 감싸 loose 제약을 주세요.
- `Row`·`Column` 안에서 남은 공간을 채우려면 `Expanded`나 `Flexible`을 쓰세요.
- `ListView`처럼 최대한 커지려는 위젯을 `Column` 안에 넣으면 **unbounded constraints** 오류가 납니다. `Expanded`나 고정 높이로 제한하세요.
- 위젯이 받은 제약이 궁금하면 `LayoutBuilder`로 `constraints`를 출력하거나, **DevTools 위젯 인스펙터**에서 확인하세요.

## 핵심 정리

- **제약은 내려가고, 크기는 올라가며, 위치는 부모가 정합니다.**
- tight 제약은 크기를 강제하고, loose 제약은 최대값 이하에서 선택을 허용합니다.
- 위젯마다 "최대한 크게 / 자식만큼 / 특정 크기" 중 하나의 방식으로 크기를 정합니다.
- `Center`, `ConstrainedBox`, `UnconstrainedBox`, `Expanded`가 제약을 어떻게 바꾸는지 예제로 확인했습니다.
