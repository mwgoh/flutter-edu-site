## 테스트가 필요한 이유

기능이 늘어날수록 모든 화면을 손으로 확인하기 어려워집니다. **자동화된 테스트**는 새 기능을 추가하거나 코드를 고칠 때 기존 기능이 망가지지 않았는지 빠르게 알려 줍니다.

## 1. 테스트의 세 가지 종류

| 종류 | 대상 | 목표 |
| --- | --- | --- |
| **단위(unit) 테스트** | 함수, 메서드, 클래스 하나 | 다양한 조건에서 로직이 올바른지 검증. 외부 의존성은 모의(mock) 객체로 대체 |
| **위젯(widget) 테스트** | 위젯 하나 | UI가 기대대로 보이고 상호작용하는지 검증. 다른 프레임워크의 컴포넌트 테스트에 해당 |
| **통합(integration) 테스트** | 앱 전체 또는 큰 부분 | 위젯과 서비스가 함께 올바르게 동작하는지, 성능은 괜찮은지 실제 기기·에뮬레이터에서 검증 |

각 테스트에는 장단점이 있습니다.

| 비교 항목 | 단위 | 위젯 | 통합 |
| --- | --- | --- | --- |
| 신뢰도 | 낮음 | 높음 | 가장 높음 |
| 유지 비용 | 낮음 | 높음 | 가장 높음 |
| 의존성 | 적음 | 많음 | 가장 많음 |
| 실행 속도 | 빠름 | 빠름 | 느림 |

> **공식 권장** 잘 테스트된 앱은 **코드 커버리지로 추적되는 많은 단위·위젯 테스트**와, **중요한 사용 사례를 모두 다루는 충분한 통합 테스트**를 갖춥니다.

## 2. 단위 테스트

### 테스트 패키지 추가

```bash
flutter pub add dev:test
```

`dev:` 접두사는 앱 실행에는 필요 없고 개발 중에만 쓰는 **dev_dependencies**에 추가하라는 뜻입니다.

### 테스트할 클래스와 파일 구조

테스트 파일은 프로젝트 루트의 `test` 폴더에 두고, 이름은 `_test.dart`로 끝나야 합니다.

```text
counter_app/
  lib/
    counter.dart
  test/
    counter_test.dart
```

```dart
// lib/counter.dart
class Counter {
  int value = 0;

  void increment() => value++;

  void decrement() => value--;
}
```

### 테스트 작성

```dart
// test/counter_test.dart
import 'package:counter_app/counter.dart';
import 'package:test/test.dart';

void main() {
  group('Test start, increment, decrement', () {
    test('value should start at 0', () {
      expect(Counter().value, 0);
    });

    test('value should be incremented', () {
      final counter = Counter();

      counter.increment();

      expect(counter.value, 1);
    });

    test('value should be decremented', () {
      final counter = Counter();

      counter.decrement();

      expect(counter.value, -1);
    });
  });
}
```

- **`test(설명, 본문)`**: 테스트 하나
- **`group(설명, 본문)`**: 관련 테스트 묶음
- **`expect(실제값, 기대값)`**: 결과 검증

### 실행

```bash
# 파일 하나 실행
flutter test test/counter_test.dart

# 특정 그룹만 실행
flutter test --plain-name "Test start, increment, decrement"

# 전체 옵션 보기
flutter test --help
```

VS Code와 IntelliJ에서는 테스트 함수 옆의 실행 버튼으로도 실행할 수 있습니다.

> **팁** HTTP 클라이언트 같은 외부 의존성은 [mockito](https://pub.dev/packages/mockito) 같은 패키지로 모의 객체를 만들어 대체하면, 네트워크 없이도 빠르고 안정적으로 단위 테스트를 할 수 있습니다.

## 3. 위젯 테스트

### 의존성

Flutter 프로젝트를 만들면 `flutter_test`가 기본으로 들어 있습니다.

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
```

### 테스트할 위젯

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({super.key, required this.title, required this.message});

  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(title: Text(title)),
        body: Center(child: Text(message)),
      ),
    );
  }
}
```

### 테스트 작성

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('MyWidget has a title and message', (tester) async {
    // 위젯을 빌드한다.
    await tester.pumpWidget(const MyWidget(title: 'T', message: 'M'));

    // Finder로 위젯을 찾는다.
    final titleFinder = find.text('T');
    final messageFinder = find.text('M');

    // Matcher로 트리에 정확히 하나씩 있는지 검증한다.
    expect(titleFinder, findsOneWidget);
    expect(messageFinder, findsOneWidget);
  });
}
```

| 구성 요소 | 설명 |
| --- | --- |
| `testWidgets` | 위젯 테스트를 정의하고 `WidgetTester`를 제공 |
| `tester.pumpWidget()` | 위젯을 빌드하고 렌더링 |
| `tester.pump()` | 프레임을 하나 예약해 다시 빌드. `Duration`을 넘기면 그만큼 시간을 진행 |
| `tester.pumpAndSettle()` | 예약된 프레임이 없을 때까지 `pump()` 반복(애니메이션 완료 대기) |
| `find.text()`, `find.byType()`, `find.byKey()` | 트리에서 위젯을 찾는 Finder |

검증에 쓰는 Matcher는 다음과 같습니다.

| Matcher | 의미 |
| --- | --- |
| `findsOneWidget` | 정확히 하나 |
| `findsNothing` | 없음 |
| `findsWidgets` | 하나 이상 |
| `findsNWidgets(n)` | 정확히 n개 |
| `matchesGoldenFile()` | 렌더링 결과가 골든 이미지 파일과 일치 |

### 사용자 동작 흉내 내기

탭, 텍스트 입력, 드래그도 테스트할 수 있습니다. 동작 후에는 `pump()`로 화면을 갱신해야 결과를 확인할 수 있습니다.

```dart
testWidgets('추측을 입력하면 입력란이 비워진다', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: Scaffold(body: GuessInput(onSubmitGuess: (_) {})),
    ),
  );

  await tester.enterText(find.byType(TextField), 'hello');
  await tester.tap(find.byIcon(Icons.arrow_circle_up));
  await tester.pump();

  expect(find.text('hello'), findsNothing);
});
```

위 예제는 **Flutter UI 입문** 과정에서 만든 `GuessInput` 위젯을 테스트합니다.

## 4. 통합 테스트

통합 테스트는 SDK에 포함된 `integration_test` 패키지로 작성하고, 실제 기기나 에뮬레이터에서 앱 전체를 실행해 검증합니다.

```yaml
dev_dependencies:
  integration_test:
    sdk: flutter
  flutter_test:
    sdk: flutter
```

```bash
flutter test integration_test/app_test.dart
```

권한 대화상자, 알림 같은 **네이티브 UI**까지 다뤄야 한다면 오픈소스 프레임워크 [Patrol](https://pub.dev/packages/patrol)을 고려할 수 있습니다.

## 5. 커버리지와 CI

```bash
flutter test --coverage
```

실행하면 `coverage/lcov.info` 파일이 생성되어 어떤 코드가 테스트되었는지 확인할 수 있습니다. 테스트는 Codemagic, Bitrise, GitHub Actions 같은 **CI 서비스**에서 커밋마다 자동 실행하도록 설정하는 것이 좋습니다.

## 핵심 정리

- **단위** 테스트는 빠르고 저렴하게 로직을, **위젯** 테스트는 UI와 상호작용을, **통합** 테스트는 앱 전체를 검증합니다.
- 단위 테스트는 `test`·`group`·`expect`로 작성하고 `flutter test`로 실행합니다.
- 위젯 테스트는 `testWidgets`에서 `pumpWidget`으로 빌드하고, `find`로 찾고, `findsOneWidget` 같은 Matcher로 검증합니다.
- `enterText`, `tap` 뒤에는 `pump()`로 화면을 갱신합니다.
