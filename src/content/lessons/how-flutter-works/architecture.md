## Flutter는 어떻게 화면을 그릴까?

지금까지 위젯을 조합해 앱을 만들었습니다. 이번 레슨에서는 그 위젯이 **어떻게 실제 픽셀이 되는지** 살펴봅니다. 공식 Learn 경로의 마지막 단계인 [How Flutter works](https://docs.flutter.dev/learn/pathway/how-flutter-works) 영상 시리즈와 [아키텍처 개요](https://docs.flutter.dev/resources/architectural-overview) 문서를 요약했습니다.

## 1. 계층 구조

Flutter는 **계층형으로 확장 가능한 시스템**입니다. 각 계층은 아래 계층에만 의존하며, 어느 부분이든 교체할 수 있게 설계되었습니다.

```text
┌──────────────────────────────────────────────┐
│ Framework (Dart)                             │
│   Material · Cupertino       디자인 시스템      │
│   Widgets                    컴포지션 추상화     │
│   Rendering                  레이아웃 추상화     │
│   Foundation · Animation · Painting · Gestures│
├──────────────────────────────────────────────┤
│ Engine (주로 C++)   dart:ui · Impeller · Dart 런타임 │
├──────────────────────────────────────────────┤
│ Embedder (플랫폼별 네이티브 코드)                  │
├──────────────────────────────────────────────┤
│ 운영체제                                        │
└──────────────────────────────────────────────┘
```

| 계층 | 언어 | 역할 |
| --- | --- | --- |
| **임베더(Embedder)** | Android: Java·C++, iOS·macOS: Swift·Objective-C, Windows·Linux: C++ | 앱 진입점 제공, 엔진 초기화, 스레드·렌더링 텍스처 관리, 앱 생명주기·입력·창 크기·플랫폼 메시지 처리 |
| **엔진(Engine)** | 주로 C++ | 매 프레임 합성된 장면을 래스터화, 그래픽(Impeller), 텍스트 레이아웃, 파일·네트워크 I/O, Dart 런타임과 컴파일 도구 제공. `dart:ui`로 프레임워크에 노출 |
| **프레임워크(Framework)** | Dart | 우리가 사용하는 위젯, 레이아웃, 애니메이션, 제스처, Material·Cupertino 라이브러리 |

> **알아 두기** Flutter 3.29부터 iOS와 Android에서는 UI 스레드와 플랫폼 스레드가 합쳐져, Dart 코드가 네이티브 플랫폼 스레드에서 실행됩니다.

### 왜 네이티브 컨트롤을 쓰지 않을까?

Flutter는 버튼, 스위치 같은 UI 컨트롤을 운영체제에 맡기지 않고 **Dart로 직접 구현해 직접 그립니다**. 공식 문서가 꼽는 이점은 다음과 같습니다.

- **확장성**: OS가 허용하는 범위에 얽매이지 않고 원하는 대로 변형할 수 있습니다.
- **성능**: Flutter 코드와 플랫폼 코드를 오가지 않고 장면 전체를 한 번에 합성합니다.
- **일관성**: OS 버전과 관계없이 앱이 같은 모습과 동작을 유지합니다.

또한 렌더러 **Impeller가 앱과 함께 배포**되므로, 기기의 OS가 업데이트되지 않아도 앱을 업데이트하면 최신 렌더링 개선을 받을 수 있습니다.

## 2. 반응형 UI: UI = f(state)

Flutter는 React에서 영감을 받은 **선언적·반응형** 방식을 씁니다. 위젯은 `build()` 메서드로 **현재 상태를 UI로 바꾸는 함수**를 선언합니다.

전통적인 방식은 UI를 "만드는 코드"와 "갱신하는 코드"를 따로 작성해 둘이 어긋나기 쉽습니다. Flutter에서는 UI **설명 하나만** 작성하면, 프레임워크가 그 설명으로 UI를 만들고 갱신하는 일을 모두 처리합니다.

> **`build()` 규칙** `build()`는 필요할 때마다(최대 매 프레임) 호출될 수 있으므로 **빠르게 실행되고 부작용이 없어야** 합니다. 네트워크 요청이나 무거운 계산은 `build()` 밖에서 하세요.

## 3. 위젯과 컴포지션

위젯은 **UI 일부에 대한 불변 선언**입니다. Flutter는 기능이 많은 거대한 위젯 대신, 작은 위젯을 **조합(composition)**하는 방식을 택합니다.

- `Container`는 사실 `LimitedBox`, `ConstrainedBox`, `Align`, `Padding`, `DecoratedBox`, `Transform` 같은 위젯의 조합입니다.
- 정렬이나 여백도 속성이 아니라 위젯으로 감싸 표현합니다.

```dart
Center(
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Text('가운데 정렬 + 여백'),
  ),
)
```

## 4. 세 개의 트리

Flutter는 화면을 그리기 위해 세 가지 트리를 함께 관리합니다.

| 트리 | 성격 | 역할 |
| --- | --- | --- |
| **Widget 트리** | 불변, 가볍고 자주 새로 만들어짐 | UI 설정(설계도) |
| **Element 트리** | 프레임 간 **유지(persistent)** | 위젯과 렌더 객체를 연결하고, 트리의 특정 위치에 있는 위젯 인스턴스를 나타냄 |
| **RenderObject 트리** | 유지, 무거움 | 레이아웃, 페인팅, 히트 테스트, 접근성 처리 |

다음 코드를 예로 들어 보겠습니다.

```dart
Container(
  color: Colors.blue,
  child: Row(
    children: [
      Image.network('https://www.example.com/1.png'),
      const Text('A'),
    ],
  ),
);
```

- `Container`는 `build()`에서 `color`가 있으므로 `ColoredBox`를 추가합니다. `Image`와 `Text`도 `build()`에서 각각 `RawImage`, `RichText` 같은 더 기본적인 위젯을 반환합니다.
- 위젯마다 **Element**가 하나씩 만들어집니다. Element는 다른 Element를 품는 `ComponentElement`와, 레이아웃·페인트에 참여하는 `RenderObjectElement`로 나뉩니다.
- 실제로 화면에 무언가를 그리는 것은 **RenderObjectWidget**뿐입니다. 예를 들어 `Row`는 `RenderFlex`, `RawImage`는 `RenderImage`, `RichText`는 `RenderParagraph`를 만듭니다.

`build(BuildContext context)`의 **`BuildContext`가 바로 Element**입니다. `Theme.of(context)`는 이 Element의 위치에서 트리를 거슬러 올라가 가장 가까운 테마를 찾습니다.

### 왜 성능이 좋을까?

위젯은 불변이므로 상태가 바뀌면 새 위젯 객체가 만들어집니다. 하지만 **Element 트리는 유지**되기 때문에 Flutter는 위젯을 마음껏 버리고 새로 만드는 것처럼 동작하면서도, 실제로는 **바뀐 부분만** Element와 RenderObject를 갱신합니다. `const` 위젯은 같은 인스턴스이므로 다시 빌드하는 작업도 건너뛸 수 있습니다.

## 5. State와 생명주기

`setState()`를 호출하면 해당 Element가 "더러워졌다(dirty)"고 표시되고, 다음 프레임에 Flutter가 그 아래 위젯 트리를 다시 빌드합니다.

| 메서드 | 설명 |
| --- | --- |
| `initState()` | `State`가 만들어질 때 한 번. 리소스 초기화 |
| `didChangeDependencies()` | 의존하는 `InheritedWidget`(예: 테마)이 바뀔 때 |
| `didUpdateWidget()` | 부모가 새 설정의 위젯으로 다시 빌드했을 때 |
| `build()` | UI를 반환 |
| `dispose()` | `State`가 영구 제거될 때. 리소스 정리 |

> **주의** `setState`에 넘기는 콜백은 **동기** 함수여야 합니다. 비동기 작업은 먼저 `await`로 끝낸 뒤, 결과를 반영하는 부분만 `setState` 안에서 처리하세요.

## 6. 렌더링 파이프라인

Flutter가 한 프레임을 그리는 과정은 다음과 같습니다. 핵심 원칙은 **"단순한 것이 빠르다(simple is fast)"**입니다.

1. **사용자 입력·애니메이션**: 상태가 바뀝니다.
2. **Build**: 바뀐 부분의 위젯을 다시 빌드하고 Element 트리를 갱신합니다.
3. **Layout**: 렌더 트리를 깊이 우선으로 **한 번 순회**하며 부모가 자식에게 **제약(constraints)을 내려주고**, 자식은 그 안에서 정한 **크기를 올려보냅니다**. 이 방식 덕분에 레이아웃이 O(n)에 끝납니다.
4. **Paint**: 각 RenderObject가 `paint()`로 자신을 그립니다.
5. **Composite**: 그린 결과를 레이어로 합성합니다. 렌더 트리의 루트인 `RenderView`가 `compositeFrame()`으로 장면을 엔진에 넘깁니다.
6. **Rasterize**: 엔진이 Impeller로 장면을 GPU에서 픽셀로 바꿉니다.

레이아웃 단계의 제약 규칙은 다음 레슨에서 자세히 다룹니다.

## 7. 네이티브 코드와 통신하기

- **플랫폼 채널**: `MethodChannel`로 Dart와 Kotlin·Swift 코드가 메시지를 주고받습니다. 데이터는 표준 형식으로 직렬화됩니다. 타입 안전한 채널 코드는 [Pigeon](https://pub.dev/packages/pigeon) 패키지로 생성할 수 있습니다.

```dart
const channel = MethodChannel('foo');
final greeting = await channel.invokeMethod('bar', 'world') as String;
print(greeting);
```

- **FFI(`dart:ffi`)**: C 기반 API를 직렬화 없이 직접 호출하므로 플랫폼 채널보다 훨씬 빠를 수 있습니다.
- **플랫폼 뷰**: `AndroidView`, `UiKitView`로 지도처럼 Flutter로 다시 만들기 어려운 네이티브 컨트롤을 앱에 넣습니다. 동기화 비용이 있으므로 꼭 필요할 때만 씁니다.

> **웹은 조금 다릅니다** 웹에서는 Dart 런타임이 필요 없고, 프레임워크와 앱 코드가 JavaScript 또는 WebAssembly(`--wasm`)로 컴파일됩니다. 개발 중에는 증분 컴파일러 `dartdevc`를, 릴리스에서는 `dart2js`·`dart2wasm`을 사용합니다.

## 영상으로 더 보기

공식 Learn 경로의 **How Flutter works** 페이지에서 다음 6편의 영상을 볼 수 있습니다.

1. How Flutter Works: 선언적 코드, 멀티 플랫폼, Dart의 역할
2. The three trees: Widget·Element·RenderObject 트리
3. The state class: State 생명주기와 `setState`, `const`의 성능 효과
4. The RenderObjectWidget: 실제로 그리는 위젯
5. A day in the life of a RenderObject: 레이아웃, 페인팅, 히트 테스트, 접근성
6. The Flutter Engine and Embedders: 엔진, 임베더, 스레드, 플랫폼 채널

## 핵심 정리

- Flutter는 **임베더 → 엔진(C++) → 프레임워크(Dart)** 계층으로 이루어집니다.
- `build()`는 상태를 UI로 바꾸는 함수이며, 빠르고 부작용이 없어야 합니다.
- **Widget(설정) · Element(유지되는 인스턴스, BuildContext) · RenderObject(레이아웃·페인트)** 세 트리가 협력하며, Element가 유지되어 바뀐 부분만 갱신합니다.
- 한 프레임은 Build → Layout → Paint → Composite → Rasterize 순서로 그려집니다.
