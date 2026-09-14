## 이 레슨에서 할 일

이번 레슨에서는 Wikipedia API에 HTTP 요청을 보내고 응답을 파싱합니다. 코드를 역할별로 나누기 위해 **MVVM** 패턴을 도입하고, 그중 첫 번째 계층인 **Model**을 만듭니다.

## 1. MVVM 아키텍처 패턴

**MVVM(Model-View-ViewModel)**은 앱을 세 계층으로 나눕니다.

| 계층 | 이 앱의 클래스 | 역할 |
| --- | --- | --- |
| **Model** | `ArticleModel` | 데이터 작업(HTTP 요청, 파싱) |
| **ViewModel** | `ArticleViewModel` | 상태 관리, Model과 View 연결 |
| **View** | `ArticleView` | UI 표시 |

```text
View ──(사용자 동작)──▶ ViewModel ──(데이터 요청)──▶ Model ──▶ Wikipedia API
View ◀──(변경 알림)──── ViewModel ◀──(Summary 반환)─ Model
```

핵심 원칙은 **관심사 분리**입니다. 상태와 데이터 로직을 UI 위젯 밖의 클래스로 빼면 테스트하기 쉽고, 재사용하기 좋고, 유지보수가 편해집니다.

## 2. Model 정의하기

`main.dart`에 빈 `ArticleModel` 클래스를 추가합니다.

```dart
class ArticleModel {
  // 속성과 메서드를 여기에 추가한다.
}
```

## 3. HTTP 요청 만들기

Wikipedia는 무작위 문서 요약을 주는 REST 엔드포인트를 제공합니다.

```text
https://en.wikipedia.org/api/rest_v1/page/random/summary
```

이 주소로 요청을 보내는 메서드를 추가합니다.

```dart
class ArticleModel {
  Future<Summary> getRandomArticleSummary() async {
    final uri = Uri.https(
      'en.wikipedia.org',
      '/api/rest_v1/page/random/summary',
    );
    final response = await get(uri);

    // TODO: 오류 처리와 JSON 파싱 추가
    throw UnimplementedError();
  }
}
```

- **`async`**: 메서드를 비동기로 표시합니다. 반환 타입은 `Future<Summary>`입니다.
- **`await`**: `get(uri)`가 반환한 `Future`가 완료될 때까지 기다린 뒤 응답을 받습니다.
- **`Uri.https`**: 호스트와 경로를 받아 URL을 안전하게 만듭니다. 특수 문자나 쿼리 매개변수의 인코딩을 알아서 처리하므로 문자열을 이어 붙이는 것보다 안전합니다.

> **팁** 실무에서는 `import 'package:http/http.dart' as http;`처럼 접두사를 붙이고 `http.get(uri)`로 호출하는 경우가 많습니다. 다른 라이브러리의 `get`과 이름이 겹치지 않아 읽기 쉽습니다.

## 4. 네트워크 오류 처리하기

HTTP 요청은 언제든 실패할 수 있으므로 항상 오류를 처리해야 합니다. 상태 코드 **200**은 성공, 그 밖의 코드는 문제가 생겼음을 뜻합니다.

```dart
class ArticleModel {
  Future<Summary> getRandomArticleSummary() async {
    final uri = Uri.https(
      'en.wikipedia.org',
      '/api/rest_v1/page/random/summary',
    );
    final response = await get(uri);

    if (response.statusCode != 200) {
      throw const HttpException('Failed to update resource');
    }

    // TODO: JSON 파싱 후 Summary 반환
    throw UnimplementedError();
  }
}
```

## 5. JSON 파싱하기

응답 본문(`response.body`)은 JSON 문자열입니다. `jsonDecode`로 Dart 맵으로 바꾼 뒤 `Summary.fromJson`에 넘깁니다.

```dart
class ArticleModel {
  Future<Summary> getRandomArticleSummary() async {
    final uri = Uri.https(
      'en.wikipedia.org',
      '/api/rest_v1/page/random/summary',
    );
    final response = await get(uri);

    if (response.statusCode != 200) {
      throw const HttpException('Failed to update resource');
    }

    return Summary.fromJson(jsonDecode(response.body) as Map<String, Object?>);
  }
}
```

`jsonDecode`는 `dynamic`을 반환하므로 `as Map<String, Object?>`로 타입을 지정합니다. 이렇게 **원시 JSON을 타입이 있는 Dart 객체로 바꿔 두면**, 이후 코드에서는 `summary.titles.normalized`처럼 자동 완성과 타입 검사의 도움을 받을 수 있습니다.

## 핵심 정리

- **MVVM**은 Model(데이터), ViewModel(상태), View(UI)로 역할을 나눕니다.
- `async`/`await`와 `Uri.https`로 HTTP GET 요청을 보냈습니다.
- 상태 코드가 200이 아니면 `HttpException`을 던져 오류를 알렸습니다.
- `jsonDecode`와 `Summary.fromJson`으로 JSON을 타입이 있는 객체로 변환했습니다.
